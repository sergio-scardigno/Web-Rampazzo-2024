from __future__ import annotations

from dataclasses import dataclass
from datetime import date
import calendar
from typing import Dict


@dataclass
class AgravantesDetalle:
	trabajoNoRegistrado: float = 0.0
	otrasInfracciones: float = 0.0
	indemnizacionesAgravadas: float = 0.0
	estabilidadSocial: float = 0.0

	def total(self) -> float:
		return (
			self.trabajoNoRegistrado
			+ self.otrasInfracciones
			+ self.indemnizacionesAgravadas
			+ self.estabilidadSocial
		)


def _inclusive_days(d1: date, d2: date) -> int:
	"""Return inclusive day count between two dates (d1 <= d2)."""
	return (d2 - d1).days + 1


def calculate_indemnizacion(
	salario: float,
	fecha_ingreso: date,
	fecha_egreso: date,
	preaviso: bool,
	agravantes: Dict[str, bool] | None = None,
) -> Dict[str, object]:
	"""Replica la fórmula usada en src/app/indemnizacion/page.tsx."""
	agravantes = agravantes or {}

	# Antigüedad en años y meses
	antiguedad_years_float = (fecha_egreso - fecha_ingreso).days / 365.25
	años = int(antiguedad_years_float // 1)
	meses = int(((antiguedad_years_float - años) * 12) // 1)

	# 1) Antigüedad Art. 245
	if meses >= 3:
		indemnizacion_antiguedad = salario * (años + 1)
	else:
		indemnizacion_antiguedad = salario * años

	# 2) Sustitutiva de Preaviso
	sustitutiva_preaviso = 0.0 if preaviso else float(salario)

	# 3) SAC sobre Preaviso
	sac_preaviso = sustitutiva_preaviso / 12.0

	# 4) Días trabajados del mes
	dias_trabajados_mes = fecha_egreso.day
	dias_del_mes_despido = calendar.monthrange(fecha_egreso.year, fecha_egreso.month)[1]
	dias_trabajados_mes_indemnizacion = (salario / dias_del_mes_despido) * dias_trabajados_mes

	# 5) Integración del mes de despido
	integracion_mes_despido = salario - dias_trabajados_mes_indemnizacion

	# 6) SAC sobre integración del mes
	sac_integracion_mes = integracion_mes_despido / 12.0

	# 7) SAC proporcional (semestre)
	is_segundo_semestre = fecha_egreso.month >= 7  # Jul (7) a Dic (12)
	inicio_semestre = date(fecha_egreso.year, 7 if is_segundo_semestre else 1, 1)
	fin_semestre = date(fecha_egreso.year, 12 if is_segundo_semestre else 6, 31 if is_segundo_semestre else 30)
	dias_totales_semestre = _inclusive_days(inicio_semestre, fin_semestre)
	dias_trabajados_semestre = _inclusive_days(inicio_semestre, fecha_egreso)
	sac_proporcional = (salario / 2.0) * (dias_trabajados_semestre / dias_totales_semestre)

	# 8) Vacaciones no gozadas (proporcionales)
	dias_vacaciones_anuales = 14
	inicio_anio = date(fecha_egreso.year, 1, 1)
	fin_anio = date(fecha_egreso.year, 12, 31)
	dias_totales_anio = _inclusive_days(inicio_anio, fin_anio)
	dias_trabajados_anio = _inclusive_days(inicio_anio, fecha_egreso)
	dias_vacaciones_proporcionales = dias_vacaciones_anuales * (dias_trabajados_anio / dias_totales_anio)
	vacaciones_no_gozadas = (salario / 25.0) * dias_vacaciones_proporcionales

	# 9) SAC sobre vacaciones no gozadas
	sac_vacaciones_no_gozadas = vacaciones_no_gozadas / 12.0

	# Agravantes
	detalle = AgravantesDetalle()
	ley24013_intimacion = bool(agravantes.get("ley24013_intimacion", False))
	if ley24013_intimacion and agravantes.get("ley24013_art8", False):
		detalle.trabajoNoRegistrado += salario * 0.25
	if ley24013_intimacion and agravantes.get("ley24013_art9", False):
		detalle.trabajoNoRegistrado += salario * 0.25
	if ley24013_intimacion and agravantes.get("ley24013_art10", False):
		detalle.trabajoNoRegistrado += salario * 0.25
	if agravantes.get("ley24013_art15", False):
		detalle.trabajoNoRegistrado += (indemnizacion_antiguedad + sustitutiva_preaviso) * 2.0
	if agravantes.get("ley25323_art1", False):
		detalle.trabajoNoRegistrado += indemnizacion_antiguedad

	if agravantes.get("intimacionPago", False):
		base_para_multa = indemnizacion_antiguedad + sustitutiva_preaviso + integracion_mes_despido
		detalle.otrasInfracciones += base_para_multa * 0.5
	if agravantes.get("certificadosArt80", False):
		detalle.otrasInfracciones += salario * 3.0

	if agravantes.get("embarazoMaternidad", False):
		detalle.indemnizacionesAgravadas += salario * 6.0
	if agravantes.get("matrimonio", False):
		detalle.indemnizacionesAgravadas += salario * 3.0

	if agravantes.get("postulanteCandidato", False):
		detalle.estabilidadSocial += salario * 12.0
	if agravantes.get("electo", False):
		detalle.estabilidadSocial += salario * 24.0

	agravantes_total = detalle.total()

	total = (
		indemnizacion_antiguedad
		+ sustitutiva_preaviso
		+ sac_preaviso
		+ dias_trabajados_mes_indemnizacion
		+ integracion_mes_despido
		+ sac_integracion_mes
		+ sac_proporcional
		+ vacaciones_no_gozadas
		+ sac_vacaciones_no_gozadas
		+ agravantes_total
	)

	desglose = [
		{"concepto": "Antigüedad Art. 245", "monto": indemnizacion_antiguedad, "descripcion": f"{años} año{'s' if años != 1 else ''} y {meses} mes{'es' if meses != 1 else ''} × salario"},
		{"concepto": "Sustitutiva de Preaviso", "monto": sustitutiva_preaviso, "descripcion": "Con preaviso (sin indemnización)" if preaviso else "Sin preaviso (1 mes de salario)"},
		{"concepto": "SAC Preaviso", "monto": sac_preaviso, "descripcion": "SAC sobre preaviso (1/12)"},
		{"concepto": "Días Trabajados del Mes", "monto": dias_trabajados_mes_indemnizacion, "descripcion": f"{dias_trabajados_mes} días del mes de despido"},
		{"concepto": "Integración Mes de Despido", "monto": integracion_mes_despido, "descripcion": "Salario - días trabajados del mes"},
		{"concepto": "SAC Integración Mes de Despido", "monto": sac_integracion_mes, "descripcion": "SAC sobre integración del mes (1/12)"},
		{"concepto": "SAC Proporcional", "monto": sac_proporcional, "descripcion": f"SAC proporcional por {dias_trabajados_semestre} días del semestre"},
		{"concepto": "Vacaciones No Gozadas", "monto": vacaciones_no_gozadas, "descripcion": "Vacaciones no gozadas del año anterior"},
		{"concepto": "SAC Vacaciones No Gozadas", "monto": sac_vacaciones_no_gozadas, "descripcion": "SAC sobre vacaciones no gozadas (1/12)"},
	]

	if detalle.trabajoNoRegistrado > 0:
		desglose.append({
			"concepto": "Agravantes - Trabajo No Registrado",
			"monto": detalle.trabajoNoRegistrado,
			"descripcion": "Ley 24013 y 25323 - Trabajo no registrado",
		})
	if detalle.otrasInfracciones > 0:
		desglose.append({
			"concepto": "Agravantes - Otras Infracciones",
			"monto": detalle.otrasInfracciones,
			"descripcion": "Ley 25323 y 25345 - Infracciones adicionales",
		})
	if detalle.indemnizacionesAgravadas > 0:
		desglose.append({
			"concepto": "Agravantes - Indemnizaciones Agravadas",
			"monto": detalle.indemnizacionesAgravadas,
			"descripcion": "Embarazo/Maternidad y Matrimonio",
		})
	if detalle.estabilidadSocial > 0:
		desglose.append({
			"concepto": "Agravantes - Estabilidad Social",
			"monto": detalle.estabilidadSocial,
			"descripcion": "Postulante/Candidato y Electo",
		})

	return {
		"indemnizacionBasica": indemnizacion_antiguedad,
		"indemnizacionAntiguedad": indemnizacion_antiguedad,
		"indemnizacionVacaciones": vacaciones_no_gozadas,
		"indemnizacionSAC": sac_proporcional + sac_preaviso + sac_integracion_mes + sac_vacaciones_no_gozadas,
		"agravantes": {
			"trabajoNoRegistrado": detalle.trabajoNoRegistrado,
			"otrasInfracciones": detalle.otrasInfracciones,
			"indemnizacionesAgravadas": detalle.indemnizacionesAgravadas,
			"estabilidadSocial": detalle.estabilidadSocial,
		},
		"total": total,
		"desglose": desglose,
	}
