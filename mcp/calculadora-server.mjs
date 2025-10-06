import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

// ---- Calculators (standalone JS for MCP server) ----
function calculateIncapacidad({ ingresoBase, porcentajeIncapacidad, edad, tipoContingencia }) {
  const PISO_MINIMO = 55699217
  const COMPENSACION_ADICIONAL_50_66 = 24755211
  const COMPENSACION_ADICIONAL_TOTAL = 30944014

  const prestacionBasica = 53 * ingresoBase * (porcentajeIncapacidad / 100) * (65 / edad)
  const pisoMinimo = PISO_MINIMO * (porcentajeIncapacidad / 100)

  let compensacionAdicional = 0
  if (porcentajeIncapacidad > 50 && porcentajeIncapacidad < 66) {
    compensacionAdicional = COMPENSACION_ADICIONAL_50_66
  } else if (porcentajeIncapacidad >= 66) {
    compensacionAdicional = COMPENSACION_ADICIONAL_TOTAL
  }

  let indemnizacionAdicional = 0
  if ((tipoContingencia === 'accidente_trabajo' || tipoContingencia === 'enfermedad_profesional') && porcentajeIncapacidad > 0) {
    const base = Math.max(prestacionBasica, pisoMinimo) + compensacionAdicional
    indemnizacionAdicional = base * 0.2
  }

  const total = Math.max(prestacionBasica, pisoMinimo) + compensacionAdicional + indemnizacionAdicional
  return {
    total,
    componentes: {
      prestacionBasica,
      pisoMinimo,
      compensacionAdicional,
      indemnizacionAdicional,
    },
  }
}

function calculateIndemnizacion({ salario, fechaIngreso, fechaEgreso, preaviso, agravantes = {} }) {
  const dIngreso = new Date(fechaIngreso)
  const dEgreso = new Date(fechaEgreso)
  const antiguedad = (dEgreso.getTime() - dIngreso.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  const anios = Math.floor(antiguedad)
  const meses = Math.floor((antiguedad - anios) * 12)

  let indemnizacionAntiguedad
  if (meses >= 3) indemnizacionAntiguedad = salario * (anios + 1)
  else indemnizacionAntiguedad = salario * anios

  const sustitutivaPreaviso = preaviso ? 0 : salario
  const sacPreaviso = sustitutivaPreaviso / 12

  const diasTrabajadosMes = dEgreso.getDate()
  const diasDelMes = new Date(dEgreso.getFullYear(), dEgreso.getMonth() + 1, 0).getDate()
  const diasTrabMesIndem = (salario / diasDelMes) * diasTrabajadosMes

  const integracionMesDespido = salario - diasTrabMesIndem
  const sacIntegracionMes = integracionMesDespido / 12

  const year = dEgreso.getFullYear()
  const isSegundoSemestre = dEgreso.getMonth() >= 6
  const inicioSemestre = new Date(year, isSegundoSemestre ? 6 : 0, 1)
  const finSemestre = new Date(year, isSegundoSemestre ? 11 : 5, isSegundoSemestre ? 31 : 30)
  const msPorDia = 1000 * 60 * 60 * 24
  const diasTotSem = Math.floor((finSemestre.getTime() - inicioSemestre.getTime()) / msPorDia) + 1
  const diasTrabSem = Math.floor((dEgreso.getTime() - inicioSemestre.getTime()) / msPorDia) + 1
  const sacProporcional = (salario / 2) * (diasTrabSem / diasTotSem)

  const diasVacacionesAnuales = 14
  const inicioAnio = new Date(year, 0, 1)
  const finAnio = new Date(year, 11, 31)
  const diasTotAnio = Math.floor((finAnio.getTime() - inicioAnio.getTime()) / msPorDia) + 1
  const diasTrabAnio = Math.floor((dEgreso.getTime() - inicioAnio.getTime()) / msPorDia) + 1
  const diasVacacionesProp = diasVacacionesAnuales * (diasTrabAnio / diasTotAnio)
  const vacacionesNoGozadas = (salario / 25) * diasVacacionesProp
  const sacVacacionesNoGozadas = vacacionesNoGozadas / 12

  const det = { trabajoNoRegistrado: 0, otrasInfracciones: 0, indemnizacionesAgravadas: 0, estabilidadSocial: 0 }
  if (agravantes.ley24013_intimacion && agravantes.ley24013_art8) det.trabajoNoRegistrado += salario * 0.25
  if (agravantes.ley24013_intimacion && agravantes.ley24013_art9) det.trabajoNoRegistrado += salario * 0.25
  if (agravantes.ley24013_intimacion && agravantes.ley24013_art10) det.trabajoNoRegistrado += salario * 0.25
  if (agravantes.ley24013_art15) det.trabajoNoRegistrado += (indemnizacionAntiguedad + sustitutivaPreaviso) * 2
  if (agravantes.ley25323_art1) det.trabajoNoRegistrado += indemnizacionAntiguedad
  if (agravantes.intimacionPago) det.otrasInfracciones += (indemnizacionAntiguedad + sustitutivaPreaviso + integracionMesDespido) * 0.5
  if (agravantes.certificadosArt80) det.otrasInfracciones += salario * 3
  if (agravantes.embarazoMaternidad) det.indemnizacionesAgravadas += salario * 6
  if (agravantes.matrimonio) det.indemnizacionesAgravadas += salario * 3
  if (agravantes.postulanteCandidato) det.estabilidadSocial += salario * 12
  if (agravantes.electo) det.estabilidadSocial += salario * 24

  const total =
    indemnizacionAntiguedad +
    sustitutivaPreaviso +
    sacPreaviso +
    diasTrabMesIndem +
    integracionMesDespido +
    sacIntegracionMes +
    sacProporcional +
    vacacionesNoGozadas +
    sacVacacionesNoGozadas +
    Object.values(det).reduce((s, v) => s + v, 0)

  return {
    total,
    componentes: {
      indemnizacionBasica: indemnizacionAntiguedad,
      indemnizacionAntiguedad,
      indemnizacionVacaciones: vacacionesNoGozadas,
      indemnizacionSAC: sacProporcional + sacPreaviso + sacIntegracionMes + sacVacacionesNoGozadas,
      agravantes: det,
    },
  }
}

// ---- MCP Server ----
const server = new Server({ name: 'calculadora-rampazzo', version: '1.0.0' }, new StdioServerTransport())

server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'calcular_incapacidad',
      description: 'Calcula prestación por incapacidad (Ley 26.773, Decreto 669/19). Devuelve total y componentes.',
      inputSchema: {
        type: 'object',
        properties: {
          ingresoBase: { type: 'number', minimum: 1 },
          porcentajeIncapacidad: { type: 'number', minimum: 0, maximum: 100 },
          edad: { type: 'number', minimum: 1 },
          tipoContingencia: { type: 'string', enum: ['accidente_trabajo', 'enfermedad_profesional', 'accidente_in_itinere', 'otro'] },
        },
        required: ['ingresoBase', 'porcentajeIncapacidad', 'edad', 'tipoContingencia'],
      },
    },
    {
      name: 'calcular_indemnizacion',
      description: 'Calcula indemnización por despido (LCT). Devuelve total y componentes.',
      inputSchema: {
        type: 'object',
        properties: {
          salario: { type: 'number', minimum: 1 },
          fechaIngreso: { type: 'string' },
          fechaEgreso: { type: 'string' },
          preaviso: { type: 'boolean' },
          agravantes: { type: 'object', additionalProperties: true },
        },
        required: ['salario', 'fechaIngreso', 'fechaEgreso', 'preaviso'],
      },
    },
  ],
}))

server.setRequestHandler('tools/call', async (req) => {
  const { name, arguments: args } = req.params
  if (name === 'calcular_incapacidad') {
    const result = calculateIncapacidad(args)
    return { content: [{ type: 'text', text: JSON.stringify(result) }] }
  }
  if (name === 'calcular_indemnizacion') {
    const result = calculateIndemnizacion(args)
    return { content: [{ type: 'text', text: JSON.stringify(result) }] }
  }
  throw new Error('Tool not found')
})

await server.connect()
// Keep process alive

