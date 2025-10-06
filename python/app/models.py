from __future__ import annotations

from datetime import date
from typing import Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


class Agravantes(BaseModel):
	ley24013_intimacion: Optional[bool] = False
	ley24013_art8: Optional[bool] = False
	ley24013_art9: Optional[bool] = False
	ley24013_art10: Optional[bool] = False
	ley24013_art15: Optional[bool] = False
	ley25323_art1: Optional[bool] = False
	intimacionPago: Optional[bool] = False
	certificadosArt80: Optional[bool] = False
	embarazoMaternidad: Optional[bool] = False
	matrimonio: Optional[bool] = False
	postulanteCandidato: Optional[bool] = False
	electo: Optional[bool] = False


class IndemnizacionRequest(BaseModel):
	salario: float = Field(gt=0)
	fechaIngreso: date
	fechaEgreso: date
	preaviso: bool
	agravantes: Optional[Agravantes] = None

	@field_validator("fechaEgreso")
	@classmethod
	def _egreso_after_ingreso(cls, v: date, info):
		fecha_ingreso = info.data.get("fechaIngreso")
		if fecha_ingreso and v < fecha_ingreso:
			raise ValueError("fechaEgreso debe ser posterior a fechaIngreso")
		return v


class DesgloseItem(BaseModel):
	concepto: str
	monto: float
	descripcion: str


class IndemnizacionResponse(BaseModel):
	indemnizacionBasica: float
	indemnizacionAntiguedad: float
	indemnizacionVacaciones: float
	indemnizacionSAC: float
	agravantes: Dict[str, float]
	total: float
	desglose: List[DesgloseItem]

