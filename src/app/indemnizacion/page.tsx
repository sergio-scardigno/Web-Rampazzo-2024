'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Info,
    Calculator,
    FileText,
    AlertTriangle,
    Phone,
    User,
    CheckCircle,
    XCircle,
    Scale,
    Shield,
    Heart,
    Users,
} from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface IndemnizacionResult {
    indemnizacionBasica: number;
    indemnizacionAntiguedad: number;
    indemnizacionVacaciones: number;
    indemnizacionSAC: number;
    agravantes: {
        trabajoNoRegistrado: number;
        otrasInfracciones: number;
        indemnizacionesAgravadas: number;
        estabilidadSocial: number;
    };
    total: number;
    desglose: {
        concepto: string;
        monto: number;
        descripcion: string;
    }[];
}

export default function IndemnizacionPage() {
    const [formData, setFormData] = useState({
        fechaIngreso: '',
        fechaEgreso: '',
        salario: '',
        preaviso: false,
    });

    const [agravantes, setAgravantes] = useState({
        // Trabajo no registrado - Ley 24013
        ley24013_intimacion: false,
        ley24013_art8: false,
        ley24013_art9: false,
        ley24013_art10: false,
        ley24013_art15: false,
        ley25323_art1: false,
        
        // Otras infracciones
        intimacionPago: false,
        certificadosArt80: false,
        
        // Indemnizaciones agravadas
        embarazoMaternidad: false,
        matrimonio: false,
        
        // Estabilidad social
        postulanteCandidato: false,
        electo: false,
    });

    const [contactData, setContactData] = useState({
        nombre: '',
        telefono: '',
    });

    const [resultado, setResultado] = useState<IndemnizacionResult | null>(
        null
    );
    const [paso, setPaso] = useState<'calculadora' | 'contacto' | 'resultado'>(
        'calculadora'
    );
    const [quiereContacto, setQuiereContacto] = useState<boolean | null>(null);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState<{
        tipo: 'success' | 'error';
        texto: string;
    } | null>(null);

    const calcularIndemnizacion = () => {
        const salario = parseFloat(formData.salario);
        const fechaIngreso = new Date(formData.fechaIngreso);
        const fechaEgreso = new Date(formData.fechaEgreso);
        const preaviso = formData.preaviso;

        if (!salario || !formData.fechaIngreso || !formData.fechaEgreso) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        // Calcular antigüedad a partir de las fechas
        const antiguedad = (fechaEgreso.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        const años = Math.floor(antiguedad);
        const meses = Math.floor((antiguedad - años) * 12);

        // 1) Antigüedad Art. 245: 1 mes por año + fracción mayor a 3 meses
        // En tu ejemplo: 1 año 7 meses = 2 meses de salario
        let indemnizacionAntiguedad;
        if (meses >= 3) {
            indemnizacionAntiguedad = salario * (años + 1); // +1 por los meses
        } else {
            indemnizacionAntiguedad = salario * años;
        }

        // 2) Sustitutiva de Preaviso: 1 mes si no hay preaviso
        const sustitutivaPreaviso = preaviso ? 0 : salario;
        
        // 3) SAC sobre Preaviso: 1/12 del preaviso
        const sacPreaviso = sustitutivaPreaviso / 12;

        // 4) Días trabajados del mes: proporcional a los días trabajados
        // En tu ejemplo: 18 días del mes de agosto (31 días) = $464.516,13
        const diasTrabajadosMes = fechaEgreso.getDate();
        const diasDelMesDespido = new Date(fechaEgreso.getFullYear(), fechaEgreso.getMonth() + 1, 0).getDate();
        const diasTrabajadosMesIndemnizacion = (salario / diasDelMesDespido) * diasTrabajadosMes;
        
        // 5) Integración del mes de despido: salario - días trabajados
        const integracionMesDespido = salario - diasTrabajadosMesIndemnizacion;
        
        // 6) SAC sobre integración del mes: 1/12 de la integración
        const sacIntegracionMes = integracionMesDespido / 12;

		// 7) SAC proporcional: por los días trabajados en el semestre
		// Fórmula legal: (50% del mejor salario del semestre) × (días trabajados en el semestre / días totales del semestre)
		const year = fechaEgreso.getFullYear();
		const isSegundoSemestre = fechaEgreso.getMonth() >= 6; // Jul (6) a Dic (11)
		const inicioSemestre = new Date(year, isSegundoSemestre ? 6 : 0, 1);
		const finSemestre = new Date(year, isSegundoSemestre ? 11 : 5, isSegundoSemestre ? 31 : 30);
		const msPorDia = 1000 * 60 * 60 * 24;
		const diasTotalesSemestre = Math.floor((finSemestre.getTime() - inicioSemestre.getTime()) / msPorDia) + 1;
		const diasTrabajadosSemestre = Math.floor((fechaEgreso.getTime() - inicioSemestre.getTime()) / msPorDia) + 1;
		const sacProporcional = (salario / 2) * (diasTrabajadosSemestre / diasTotalesSemestre);

		// 8) Vacaciones no gozadas: proporcionales al año del despido
		// Días de vacaciones según antigüedad (hasta 5 años: 14 días)
		const diasVacacionesAnuales = 14;
		const inicioAnio = new Date(year, 0, 1);
		const finAnio = new Date(year, 11, 31);
		const diasTotalesAnio = Math.floor((finAnio.getTime() - inicioAnio.getTime()) / msPorDia) + 1; // 365 o 366
		const diasTrabajadosAnio = Math.floor((fechaEgreso.getTime() - inicioAnio.getTime()) / msPorDia) + 1;
		const diasVacacionesProporcionales = diasVacacionesAnuales * (diasTrabajadosAnio / diasTotalesAnio);
		const vacacionesNoGozadas = (salario / 25) * diasVacacionesProporcionales;
		
		// 9) SAC sobre vacaciones no gozadas: 1/12 de las vacaciones
		const sacVacacionesNoGozadas = vacacionesNoGozadas / 12;

        // Cálculo de agravantes
        let agravantesTotal = 0;
        const agravantesDetalle = {
            trabajoNoRegistrado: 0,
            otrasInfracciones: 0,
            indemnizacionesAgravadas: 0,
            estabilidadSocial: 0,
        };

        // Trabajo no registrado - Ley 24013
        if (agravantes.ley24013_intimacion && agravantes.ley24013_art8) {
            agravantesDetalle.trabajoNoRegistrado += salario * 0.25; // 1/4 de remuneraciones
        }
        if (agravantes.ley24013_intimacion && agravantes.ley24013_art9) {
            agravantesDetalle.trabajoNoRegistrado += salario * 0.25; // 1/4 de remuneraciones
        }
        if (agravantes.ley24013_intimacion && agravantes.ley24013_art10) {
            agravantesDetalle.trabajoNoRegistrado += salario * 0.25; // 1/4 de remuneraciones
        }
        if (agravantes.ley24013_art15) {
            agravantesDetalle.trabajoNoRegistrado += (indemnizacionAntiguedad + sustitutivaPreaviso) * 2; // Duplicación
        }
        if (agravantes.ley25323_art1) {
            agravantesDetalle.trabajoNoRegistrado += indemnizacionAntiguedad; // 100% adicional
        }

        // Otras infracciones
        if (agravantes.intimacionPago) {
            // Art. 2 Ley 25323: 50% de la sumatoria de Antigüedad + pre-aviso + integración del mes de despido
            const baseParaMulta = indemnizacionAntiguedad + sustitutivaPreaviso + integracionMesDespido;
            agravantesDetalle.otrasInfracciones += baseParaMulta * 0.5;
        }
        if (agravantes.certificadosArt80) {
            // Art. 80 LCT: multiplicar por 3 el haber denunciado por la persona
            agravantesDetalle.otrasInfracciones += salario * 3;
        }

        // Indemnizaciones agravadas
        if (agravantes.embarazoMaternidad) {
            agravantesDetalle.indemnizacionesAgravadas += salario * 6; // 6 meses de salario
        }
        if (agravantes.matrimonio) {
            agravantesDetalle.indemnizacionesAgravadas += salario * 3; // 3 meses de salario
        }

        // Estabilidad social
        if (agravantes.postulanteCandidato) {
            agravantesDetalle.estabilidadSocial += salario * 12; // 12 meses de salario
        }
        if (agravantes.electo) {
            agravantesDetalle.estabilidadSocial += salario * 24; // 24 meses de salario
        }

        agravantesTotal = Object.values(agravantesDetalle).reduce((sum, value) => sum + value, 0);

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
            agravantesTotal;

		console.log('DEBUG conceptos', {
			antiguedad: indemnizacionAntiguedad,
			preaviso: sustitutivaPreaviso,
			sacPreaviso: sacPreaviso,
			diasTrabMes: diasTrabajadosMesIndemnizacion,
			integracionMes: integracionMesDespido,
			sacIntegracionMes: sacIntegracionMes,
			sacProporcional: sacProporcional,
			vacacionesNoGozadas: vacacionesNoGozadas,
			sacVacNoGozadas: sacVacacionesNoGozadas,
			total: total,
		});

        const desglose = [
            {
                concepto: 'Antigüedad Art. 245',
                monto: indemnizacionAntiguedad,
                descripcion: `${años} año${años !== 1 ? 's' : ''} y ${meses} mes${meses !== 1 ? 'es' : ''} × salario`,
            },
            {
                concepto: 'Sustitutiva de Preaviso',
                monto: sustitutivaPreaviso,
                descripcion: preaviso ? 'Con preaviso (sin indemnización)' : 'Sin preaviso (1 mes de salario)',
            },
            {
                concepto: 'SAC Preaviso',
                monto: sacPreaviso,
                descripcion: 'SAC sobre preaviso (1/12)',
            },
            {
                concepto: 'Días Trabajados del Mes',
                monto: diasTrabajadosMesIndemnizacion,
                descripcion: `${diasTrabajadosMes} días del mes de despido`,
            },
            {
                concepto: 'Integración Mes de Despido',
                monto: integracionMesDespido,
                descripcion: 'Salario - días trabajados del mes',
            },
            {
                concepto: 'SAC Integración Mes de Despido',
                monto: sacIntegracionMes,
                descripcion: 'SAC sobre integración del mes (1/12)',
            },
            {
                concepto: 'SAC Proporcional',
                monto: sacProporcional,
                descripcion: `SAC proporcional por ${diasTrabajadosSemestre} días del semestre`,
            },
            {
                concepto: 'Vacaciones No Gozadas',
                monto: vacacionesNoGozadas,
                descripcion: 'Vacaciones no gozadas del año anterior',
            },
            {
                concepto: 'SAC Vacaciones No Gozadas',
                monto: sacVacacionesNoGozadas,
                descripcion: 'SAC sobre vacaciones no gozadas (1/12)',
            },
        ];

        // Agregar agravantes al desglose si existen
        if (agravantesDetalle.trabajoNoRegistrado > 0) {
            desglose.push({
                concepto: 'Agravantes - Trabajo No Registrado',
                monto: agravantesDetalle.trabajoNoRegistrado,
                descripcion: 'Ley 24013 y 25323 - Trabajo no registrado',
            });
        }
        if (agravantesDetalle.otrasInfracciones > 0) {
            desglose.push({
                concepto: 'Agravantes - Otras Infracciones',
                monto: agravantesDetalle.otrasInfracciones,
                descripcion: 'Ley 25323 y 25345 - Infracciones adicionales',
            });
        }
        if (agravantesDetalle.indemnizacionesAgravadas > 0) {
            desglose.push({
                concepto: 'Agravantes - Indemnizaciones Agravadas',
                monto: agravantesDetalle.indemnizacionesAgravadas,
                descripcion: 'Embarazo/Maternidad y Matrimonio',
            });
        }
        if (agravantesDetalle.estabilidadSocial > 0) {
            desglose.push({
                concepto: 'Agravantes - Estabilidad Social',
                monto: agravantesDetalle.estabilidadSocial,
                descripcion: 'Postulante/Candidato y Electo',
            });
        }

        setResultado({
            indemnizacionBasica: indemnizacionAntiguedad,
            indemnizacionAntiguedad: indemnizacionAntiguedad,
            indemnizacionVacaciones: vacacionesNoGozadas,
            indemnizacionSAC: sacProporcional + sacPreaviso + sacIntegracionMes + sacVacacionesNoGozadas,
            agravantes: agravantesDetalle,
            total,
            desglose,
        });

        // Pasar al paso de contacto
        setPaso('contacto');
    };

    const limpiarFormulario = () => {
        setFormData({
            fechaIngreso: '',
            fechaEgreso: '',
            salario: '',
            preaviso: false,
        });
        setAgravantes({
            ley24013_intimacion: false,
            ley24013_art8: false,
            ley24013_art9: false,
            ley24013_art10: false,
            ley24013_art15: false,
            ley25323_art1: false,
            intimacionPago: false,
            certificadosArt80: false,
            embarazoMaternidad: false,
            matrimonio: false,
            postulanteCandidato: false,
            electo: false,
        });
        setContactData({
            nombre: '',
            telefono: '',
        });
        setResultado(null);
        setPaso('calculadora');
        setQuiereContacto(null);
        setMensaje(null);
    };

    const guardarDatos = async () => {
        if (!resultado) return;

        setGuardando(true);
        setMensaje(null);

        try {
            const datosParaGuardar = {
                nombre: contactData.nombre,
                telefono: contactData.telefono,
                salario: parseFloat(formData.salario),
                fechaIngreso: formData.fechaIngreso,
                fechaEgreso: formData.fechaEgreso,
                preaviso: formData.preaviso,
                indemnizacionCalculada: resultado.total,
                quiereContacto: quiereContacto,
                agravantes: agravantes,
            };

            const response = await fetch('/api/indemnizacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosParaGuardar),
            });

            const data = await response.json();

            if (data.success) {
                setMensaje({
                    tipo: 'success',
                    texto: 'Datos guardados exitosamente. Nos pondremos en contacto contigo pronto.',
                });
                setPaso('resultado');
            } else {
                setMensaje({
                    tipo: 'error',
                    texto: 'Error al guardar los datos. Por favor, inténtalo de nuevo.',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setMensaje({
                tipo: 'error',
                texto: 'Error de conexión. Por favor, inténtalo de nuevo.',
            });
        } finally {
            setGuardando(false);
        }
    };

    const continuarSinGuardar = () => {
        setPaso('resultado');
    };

    const formatearMoneda = (monto: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        }).format(monto);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 ">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8 mt-10">
                    <br></br>
                    <br></br>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Calculadora de Indemnización por Despido
                    </h1>
                    <p className="text-xl text-gray-600">
                        Calcula tu indemnización según la Ley de Contrato de
                        Trabajo Argentina
                    </p>
                    <Badge variant="secondary" className="mt-2">
                        Ley 20.744 - Art. 245
                    </Badge>

                    {/* Indicador de progreso */}
                    <div className="flex justify-center mt-6">
                        <div className="flex items-center space-x-4">
                            <div
                                className={`flex items-center ${
                                    paso === 'calculadora'
                                        ? 'text-blue-600'
                                        : 'text-gray-400'
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                        paso === 'calculadora'
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-gray-300 bg-white'
                                    }`}
                                >
                                    1
                                </div>
                                <span className="ml-2 font-medium">Datos</span>
                            </div>
                            <div
                                className={`w-12 h-0.5 ${
                                    paso === 'contacto' || paso === 'resultado'
                                        ? 'bg-blue-600'
                                        : 'bg-gray-300'
                                }`}
                            ></div>
                            <div
                                className={`flex items-center ${
                                    paso === 'contacto'
                                        ? 'text-blue-600'
                                        : paso === 'resultado'
                                        ? 'text-green-600'
                                        : 'text-gray-400'
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                        paso === 'contacto'
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : paso === 'resultado'
                                            ? 'border-green-600 bg-green-600 text-white'
                                            : 'border-gray-300 bg-white'
                                    }`}
                                >
                                    2
                                </div>
                                <span className="ml-2 font-medium">
                                    Contacto
                                </span>
                            </div>
                            <div
                                className={`w-12 h-0.5 ${
                                    paso === 'resultado'
                                        ? 'bg-green-600'
                                        : 'bg-gray-300'
                                }`}
                            ></div>
                            <div
                                className={`flex items-center ${
                                    paso === 'resultado'
                                        ? 'text-green-600'
                                        : 'text-gray-400'
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                        paso === 'resultado'
                                            ? 'border-green-600 bg-green-600 text-white'
                                            : 'border-gray-300 bg-white'
                                    }`}
                                >
                                    3
                                </div>
                                <span className="ml-2 font-medium">
                                    Resultado
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Paso 1: Calculadora */}
                    {paso === 'calculadora' && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5" />
                                    Datos del Trabajador
                                </CardTitle>
                                <CardDescription>
                                    Complete los datos para calcular la
                                    indemnización
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="salario">
                                        Mejor Sueldo Bruto (ARS)
                                    </Label>
                                    <Input
                                        id="salario"
                                        type="number"
                                        placeholder="Ingrese su mejor sueldo bruto mensual"
                                        value={formData.salario}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                salario: e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-xs text-gray-600">
                                        💰 Sueldo bruto más alto del último año
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaIngreso">
                                        Fecha de Ingreso
                                    </Label>
                                    <Input
                                        id="fechaIngreso"
                                        type="date"
                                        value={formData.fechaIngreso}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                fechaIngreso: e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-xs text-gray-600">
                                        📅 Fecha en que comenzó a trabajar
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaEgreso">
                                        Fecha de Despido
                                    </Label>
                                    <Input
                                        id="fechaEgreso"
                                        type="date"
                                        value={formData.fechaEgreso}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                fechaEgreso: e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-xs text-gray-600">
                                        📅 Fecha en que fue despedido
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-base font-medium">
                                        ¿Hubo Preaviso?
                                    </Label>
                                    <div className="flex gap-3">
                                        <Button
                                            variant={
                                                formData.preaviso === true
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    preaviso: true,
                                                })
                                            }
                                            className="flex-1"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Sí, hubo preaviso
                                        </Button>
                                        <Button
                                            variant={
                                                formData.preaviso === false
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    preaviso: false,
                                                })
                                            }
                                            className="flex-1"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            No, no hubo preaviso
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        ⚠️ Si no hubo preaviso, se calcula 1 mes adicional
                                    </p>
                                </div>

                                {/* Sección de Agravantes */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Scale className="h-5 w-5 text-orange-600" />
                                        <Label className="text-base font-semibold text-gray-900">
                                            Agravantes y Sanciones Adicionales
                                        </Label>
                                    </div>
                                    
                                    <Alert className="border-blue-200 bg-blue-50">
                                        <Info className="h-4 w-4 text-blue-600" />
                                        <AlertDescription className="text-blue-800 text-xs">
                                            <strong>Importante:</strong> Los agravantes se aplican según la normativa vigente. 
                                            Consulte con un abogado laboral para casos específicos.
                                        </AlertDescription>
                                    </Alert>
                                    
                                    {/* Indemnizaciones agravadas - Solo embarazo/maternidad */}
                                    <div className="space-y-3 p-4 bg-pink-50 rounded-lg border border-pink-200">
                                        <div className="flex items-center gap-2">
                                            <Heart className="h-4 w-4 text-pink-600" />
                                            <Label className="text-sm font-medium text-pink-800">
                                                Indemnizaciones agravadas
                                            </Label>
                                        </div>
                                        <div className="space-y-2 text-xs text-pink-700">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="embarazoMaternidad"
                                                    checked={agravantes.embarazoMaternidad}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            embarazoMaternidad: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                                                />
                                                <label htmlFor="embarazoMaternidad">
                                                    Embarazo / Maternidad - Art. 2 LCT
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Otras infracciones - Solo Art. 80 */}
                                    <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-red-600" />
                                            <Label className="text-sm font-medium text-red-800">
                                                Otras infracciones
                                            </Label>
                                        </div>
                                        <div className="space-y-2 text-xs text-red-700">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="certificadosArt80"
                                                    checked={agravantes.certificadosArt80}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            certificadosArt80: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-red-300 text-red-600 focus:ring-red-500"
                                                />
                                                <label htmlFor="certificadosArt80">
                                                    Intimación y falta de entrega de los certificados del art. 80, LCT - Art. 45, Ley 25345
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        onClick={calcularIndemnizacion}
                                        className="flex-1"
                                    >
                                        Calcular Indemnización
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={limpiarFormulario}
                                    >
                                        Limpiar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Paso 2: Formulario de Contacto */}
                    {paso === 'contacto' && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Información de Contacto
                                </CardTitle>
                                <CardDescription>
                                    Complete sus datos para recibir el resultado
                                    y asesoramiento personalizado
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">
                                        Nombre Completo
                                    </Label>
                                    <Input
                                        id="nombre"
                                        type="text"
                                        placeholder="Ingrese su nombre completo"
                                        value={contactData.nombre}
                                        onChange={(e) =>
                                            setContactData({
                                                ...contactData,
                                                nombre: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono">
                                        Número de Teléfono
                                    </Label>
                                                                            <PhoneInput
                                            placeholder="Ingrese su número de teléfono"
                                            value={contactData.telefono}
                                            onChange={(value) =>
                                                setContactData({
                                                    ...contactData,
                                                    telefono: value || '',
                                                })
                                            }
                                            defaultCountry="AR"
                                            international
                                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        />
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-3">
                                    <Label className="text-base font-medium">
                                        ¿Desea que nos contactemos con usted?
                                    </Label>
                                    <div className="flex gap-3">
                                        <Button
                                            variant={
                                                quiereContacto === true
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            onClick={() =>
                                                setQuiereContacto(true)
                                            }
                                            className="flex-1"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Sí, contactenme
                                        </Button>
                                        <Button
                                            variant={
                                                quiereContacto === false
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            onClick={() =>
                                                setQuiereContacto(false)
                                            }
                                            className="flex-1"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            No, gracias
                                        </Button>
                                    </div>
                                </div>

                                {mensaje && (
                                    <Alert
                                        className={
                                            mensaje.tipo === 'error'
                                                ? 'border-red-200 bg-red-50'
                                                : 'border-green-200 bg-green-50'
                                        }
                                    >
                                        <AlertDescription
                                            className={
                                                mensaje.tipo === 'error'
                                                    ? 'text-red-800'
                                                    : 'text-green-800'
                                            }
                                        >
                                            {mensaje.texto}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        onClick={guardarDatos}
                                        className="flex-1"
                                        disabled={
                                            guardando ||
                                            !contactData.nombre ||
                                            !contactData.telefono ||
                                            quiereContacto === null
                                        }
                                    >
                                        {guardando
                                            ? 'Guardando...'
                                            : 'Continuar'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPaso('calculadora')}
                                    >
                                        Volver
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Resultados */}
                    <div className="space-y-6">
                        {/* Mostrar resultado en paso de contacto */}
                        {paso === 'contacto' && resultado && (
                            <Card className="shadow-lg border-green-200">
                                <CardHeader className="bg-green-50">
                                    <CardTitle className="text-green-800 flex items-center gap-2">
                                        <Calculator className="h-5 w-5" />
                                        Resultado del Cálculo
                                    </CardTitle>
                                    <CardDescription className="text-green-700">
                                        Indemnización total a percibir
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center mb-6">
                                        <div className="text-3xl font-bold text-green-800 mb-2">
                                            {formatearMoneda(resultado.total)}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="text-green-700"
                                        >
                                            Total a percibir
                                        </Badge>
                                        
                                        {/* Resumen de agravantes aplicados */}
                                        {Object.values(resultado.agravantes).some(value => value > 0) && (
                                            <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                                <div className="text-xs text-orange-800 font-medium mb-2">
                                                    Agravantes aplicados:
                                                </div>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {resultado.agravantes.trabajoNoRegistrado > 0 && (
                                                        <Badge variant="secondary" className="text-orange-700 bg-orange-100">
                                                            Trabajo no registrado: {formatearMoneda(resultado.agravantes.trabajoNoRegistrado)}
                                                        </Badge>
                                                    )}
                                                    {resultado.agravantes.otrasInfracciones > 0 && (
                                                        <Badge variant="secondary" className="text-red-700 bg-red-100">
                                                            Otras infracciones: {formatearMoneda(resultado.agravantes.otrasInfracciones)}
                                                        </Badge>
                                                    )}
                                                    {resultado.agravantes.indemnizacionesAgravadas > 0 && (
                                                        <Badge variant="secondary" className="text-pink-700 bg-pink-100">
                                                            Protecciones especiales: {formatearMoneda(resultado.agravantes.indemnizacionesAgravadas)}
                                                        </Badge>
                                                    )}
                                                    {resultado.agravantes.estabilidadSocial > 0 && (
                                                        <Badge variant="secondary" className="text-blue-700 bg-blue-100">
                                                            Estabilidad social: {formatearMoneda(resultado.agravantes.estabilidadSocial)}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="space-y-3">
                                        {resultado.desglose.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {item.concepto}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {item.descripcion}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-gray-900">
                                                            {formatearMoneda(
                                                                item.monto
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Mostrar resultado final en paso de resultado */}
                        {paso === 'resultado' && resultado && (
                            <Card className="shadow-lg border-green-200">
                                <CardHeader className="bg-green-50">
                                    <CardTitle className="text-green-800 flex items-center gap-2">
                                        <Calculator className="h-5 w-5" />
                                        Resultado Final
                                    </CardTitle>
                                    <CardDescription className="text-green-700">
                                        Su indemnización calculada
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center mb-6">
                                        <div className="text-3xl font-bold text-green-800 mb-2">
                                            {formatearMoneda(resultado.total)}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="text-green-700"
                                        >
                                            Total a percibir
                                        </Badge>
                                        
                                        {/* Resumen de agravantes aplicados */}
                                        {Object.values(resultado.agravantes).some(value => value > 0) && (
                                            <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                                <div className="text-xs text-orange-800 font-medium mb-2">
                                                    Agravantes aplicados:
                                                </div>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {resultado.agravantes.trabajoNoRegistrado > 0 && (
                                                        <Badge variant="secondary" className="text-orange-700 bg-orange-100">
                                                            Trabajo no registrado: {formatearMoneda(resultado.agravantes.trabajoNoRegistrado)}
                                                        </Badge>
                                                    )}
                                                    {resultado.agravantes.otrasInfracciones > 0 && (
                                                        <Badge variant="secondary" className="text-red-700 bg-red-100">
                                                            Otras infracciones: {formatearMoneda(resultado.agravantes.otrasInfracciones)}
                                                        </Badge>
                                                    )}
                                                    {resultado.agravantes.indemnizacionesAgravadas > 0 && (
                                                        <Badge variant="secondary" className="text-pink-700 bg-pink-100">
                                                            Protecciones especiales: {formatearMoneda(resultado.agravantes.indemnizacionesAgravadas)}
                                                        </Badge>
                                                    )}
                                                    {resultado.agravantes.estabilidadSocial > 0 && (
                                                        <Badge variant="secondary" className="text-blue-700 bg-blue-100">
                                                            Estabilidad social: {formatearMoneda(resultado.agravantes.estabilidadSocial)}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="space-y-3">
                                        {resultado.desglose.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {item.concepto}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {item.descripcion}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-gray-900">
                                                            {formatearMoneda(
                                                                item.monto
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {quiereContacto && (
                                        <Alert className="border-blue-200 bg-blue-50 mt-4">
                                            <Info className="h-4 w-4 text-blue-600" />
                                            <AlertDescription className="text-blue-800">
                                                Nos pondremos en contacto
                                                contigo pronto para brindarte
                                                asesoramiento personalizado.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            onClick={limpiarFormulario}
                                            className="flex-1"
                                        >
                                            Nueva Consulta
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Advertencia - Mostrar en todos los pasos */}
                        {(paso === 'calculadora' || paso === 'contacto') && (
                            <Alert className="border-orange-200 bg-orange-50">
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                                <AlertDescription className="text-orange-800">
                                    Esta calculadora es informativa. Para casos
                                    específicos o disputas legales, consulte con
                                    un abogado laboral especializado.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
