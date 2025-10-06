export type IncapacidadInput = {
  ingresoBase: number
  porcentajeIncapacidad: number
  edad: number
  tipoContingencia: 'accidente_trabajo' | 'enfermedad_profesional' | 'accidente_in_itinere' | 'otro'
}

export type IncapacidadResult = {
  prestacionBasica: number
  pisoMinimo: number
  compensacionAdicional: number
  indemnizacionAdicional: number
  total: number
}

// Valores actualizados según el documento (2024-2025)
const PISO_MINIMO = 55699217
const COMPENSACION_ADICIONAL_50_66 = 24755211
const COMPENSACION_ADICIONAL_TOTAL = 30944014

export function calculateIncapacidad(input: IncapacidadInput): IncapacidadResult {
  const ingresoBase = input.ingresoBase
  const porcentaje = input.porcentajeIncapacidad
  const edad = input.edad

  // Fórmula principal: 53 × (VIB) × porcentaje × (65 / edad)
  const prestacionBasica = 53 * ingresoBase * (porcentaje / 100) * (65 / edad)

  // Piso mínimo según porcentaje
  const pisoMinimo = PISO_MINIMO * (porcentaje / 100)

  // Compensación adicional según el rango de incapacidad
  let compensacionAdicional = 0
  if (porcentaje > 50 && porcentaje < 66) {
    compensacionAdicional = COMPENSACION_ADICIONAL_50_66
  } else if (porcentaje >= 66) {
    compensacionAdicional = COMPENSACION_ADICIONAL_TOTAL
  }

  // Indemnización adicional del 20% para AT/EP
  let indemnizacionAdicional = 0
  if (
    (input.tipoContingencia === 'accidente_trabajo' ||
      input.tipoContingencia === 'enfermedad_profesional') &&
    porcentaje > 0
  ) {
    const baseParaIndemnizacion = Math.max(prestacionBasica, pisoMinimo) + compensacionAdicional
    indemnizacionAdicional = baseParaIndemnizacion * 0.2
  }

  const total = Math.max(prestacionBasica, pisoMinimo) + compensacionAdicional + indemnizacionAdicional

  return {
    prestacionBasica,
    pisoMinimo,
    compensacionAdicional,
    indemnizacionAdicional,
    total,
  }
}

export type IndemnizacionInput = {
  salario: number
  fechaIngreso: Date
  fechaEgreso: Date
  preaviso: boolean
  agravantes?: {
    ley24013_intimacion?: boolean
    ley24013_art8?: boolean
    ley24013_art9?: boolean
    ley24013_art10?: boolean
    ley24013_art15?: boolean
    ley25323_art1?: boolean
    intimacionPago?: boolean
    certificadosArt80?: boolean
    embarazoMaternidad?: boolean
    matrimonio?: boolean
    postulanteCandidato?: boolean
    electo?: boolean
  }
}

export type IndemnizacionResult = {
  indemnizacionBasica: number
  indemnizacionAntiguedad: number
  indemnizacionVacaciones: number
  indemnizacionSAC: number
  agravantes: {
    trabajoNoRegistrado: number
    otrasInfracciones: number
    indemnizacionesAgravadas: number
    estabilidadSocial: number
  }
  total: number
}

export function calculateIndemnizacion(input: IndemnizacionInput): IndemnizacionResult {
  const { salario, fechaIngreso, fechaEgreso, preaviso } = input

  const antiguedad = (fechaEgreso.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  const años = Math.floor(antiguedad)
  const meses = Math.floor((antiguedad - años) * 12)

  let indemnizacionAntiguedad: number
  if (meses >= 3) {
    indemnizacionAntiguedad = salario * (años + 1)
  } else {
    indemnizacionAntiguedad = salario * años
  }

  const sustitutivaPreaviso = preaviso ? 0 : salario
  const sacPreaviso = sustitutivaPreaviso / 12

  const diasTrabajadosMes = fechaEgreso.getDate()
  const diasDelMesDespido = new Date(fechaEgreso.getFullYear(), fechaEgreso.getMonth() + 1, 0).getDate()
  const diasTrabajadosMesIndemnizacion = (salario / diasDelMesDespido) * diasTrabajadosMes

  const integracionMesDespido = salario - diasTrabajadosMesIndemnizacion
  const sacIntegracionMes = integracionMesDespido / 12

  const year = fechaEgreso.getFullYear()
  const isSegundoSemestre = fechaEgreso.getMonth() >= 6
  const inicioSemestre = new Date(year, isSegundoSemestre ? 6 : 0, 1)
  const finSemestre = new Date(year, isSegundoSemestre ? 11 : 5, isSegundoSemestre ? 31 : 30)
  const msPorDia = 1000 * 60 * 60 * 24
  const diasTotalesSemestre = Math.floor((finSemestre.getTime() - inicioSemestre.getTime()) / msPorDia) + 1
  const diasTrabajadosSemestre = Math.floor((fechaEgreso.getTime() - inicioSemestre.getTime()) / msPorDia) + 1
  const sacProporcional = (salario / 2) * (diasTrabajadosSemestre / diasTotalesSemestre)

  const diasVacacionesAnuales = 14
  const inicioAnio = new Date(year, 0, 1)
  const finAnio = new Date(year, 11, 31)
  const diasTotalesAnio = Math.floor((finAnio.getTime() - inicioAnio.getTime()) / msPorDia) + 1
  const diasTrabajadosAnio = Math.floor((fechaEgreso.getTime() - inicioAnio.getTime()) / msPorDia) + 1
  const diasVacacionesProporcionales = diasVacacionesAnuales * (diasTrabajadosAnio / diasTotalesAnio)
  const vacacionesNoGozadas = (salario / 25) * diasVacacionesProporcionales
  const sacVacacionesNoGozadas = vacacionesNoGozadas / 12

  const agrav = input.agravantes || {}
  const agravantesDetalle = {
    trabajoNoRegistrado: 0,
    otrasInfracciones: 0,
    indemnizacionesAgravadas: 0,
    estabilidadSocial: 0,
  }

  if (agrav.ley24013_intimacion && agrav.ley24013_art8) {
    agravantesDetalle.trabajoNoRegistrado += salario * 0.25
  }
  if (agrav.ley24013_intimacion && agrav.ley24013_art9) {
    agravantesDetalle.trabajoNoRegistrado += salario * 0.25
  }
  if (agrav.ley24013_intimacion && agrav.ley24013_art10) {
    agravantesDetalle.trabajoNoRegistrado += salario * 0.25
  }
  if (agrav.ley24013_art15) {
    agravantesDetalle.trabajoNoRegistrado += (indemnizacionAntiguedad + sustitutivaPreaviso) * 2
  }
  if (agrav.ley25323_art1) {
    agravantesDetalle.trabajoNoRegistrado += indemnizacionAntiguedad
  }

  if (agrav.intimacionPago) {
    const baseParaMulta = indemnizacionAntiguedad + sustitutivaPreaviso + integracionMesDespido
    agravantesDetalle.otrasInfracciones += baseParaMulta * 0.5
  }
  if (agrav.certificadosArt80) {
    agravantesDetalle.otrasInfracciones += salario * 3
  }

  if (agrav.embarazoMaternidad) {
    agravantesDetalle.indemnizacionesAgravadas += salario * 6
  }
  if (agrav.matrimonio) {
    agravantesDetalle.indemnizacionesAgravadas += salario * 3
  }

  if (agrav.postulanteCandidato) {
    agravantesDetalle.estabilidadSocial += salario * 12
  }
  if (agrav.electo) {
    agravantesDetalle.estabilidadSocial += salario * 24
  }

  const total =
    indemnizacionAntiguedad +
    sustitutivaPreaviso +
    sacPreaviso +
    diasTrabajadosMesIndemnizacion +
    integracionMesDespido +
    sacIntegracionMes +
    sacProporcional +
    vacacionesNoGozadas +
    sacVacacionesNoGozadas +
    Object.values(agravantesDetalle).reduce((s, v) => s + v, 0)

  return {
    indemnizacionBasica: indemnizacionAntiguedad,
    indemnizacionAntiguedad,
    indemnizacionVacaciones: vacacionesNoGozadas,
    indemnizacionSAC: sacProporcional + sacPreaviso + sacIntegracionMes + sacVacacionesNoGozadas,
    agravantes: agravantesDetalle,
    total,
  }
}


