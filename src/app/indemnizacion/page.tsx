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
        salario: '',
        antiguedad: '',
        fechaIngreso: '',
        fechaEgreso: '',
        rubro: '',
        motivoDespido: 'sin_causa',
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
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [paso, setPaso] = useState<'calculadora' | 'contacto' | 'resultado'>(
        'calculadora'
    );
    const [quiereContacto, setQuiereContacto] = useState<boolean | null>(null);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState<{
        tipo: 'success' | 'error';
        texto: string;
    } | null>(null);

    const rubros = [
        { id: 'comercio', nombre: 'Comercio', factor: 1 },
        { id: 'industria', nombre: 'Industria', factor: 1 },
        { id: 'construccion', nombre: 'Construcción', factor: 1.2 },
        { id: 'servicios', nombre: 'Servicios', factor: 1 },
        { id: 'transporte', nombre: 'Transporte', factor: 1.1 },
        { id: 'salud', nombre: 'Salud', factor: 1.15 },
        { id: 'educacion', nombre: 'Educación', factor: 1.05 },
        { id: 'bancario', nombre: 'Bancario', factor: 1.25 },
    ];

    const calcularIndemnizacion = () => {
        const salario = parseFloat(formData.salario);
        const antiguedad = parseFloat(formData.antiguedad);
        const rubroSeleccionado = rubros.find((r) => r.id === formData.rubro);

        if (!salario || !antiguedad || !rubroSeleccionado) {
            alert('Por favor complete todos los campos');
            return;
        }

        // Cálculo según Ley de Contrato de Trabajo Argentina
        const indemnizacionBasica = salario * 1; // 1 mes de salario por año de antigüedad
        const indemnizacionAntiguedad =
            salario * antiguedad * rubroSeleccionado.factor;
        const indemnizacionVacaciones = (salario / 25) * 14; // 14 días de vacaciones
        const indemnizacionSAC = salario / 12; // 1/12 del salario anual complementario

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
            agravantesDetalle.trabajoNoRegistrado += (indemnizacionBasica + indemnizacionAntiguedad) * 2; // Duplicación
        }
        if (agravantes.ley25323_art1) {
            agravantesDetalle.trabajoNoRegistrado += indemnizacionAntiguedad; // 100% adicional
        }

        // Otras infracciones
        if (agravantes.intimacionPago) {
            agravantesDetalle.otrasInfracciones += salario * 2; // Art. 2 Ley 25323
        }
        if (agravantes.certificadosArt80) {
            agravantesDetalle.otrasInfracciones += salario * 3; // Art. 45 Ley 25345
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
            indemnizacionBasica +
            indemnizacionAntiguedad +
            indemnizacionVacaciones +
            indemnizacionSAC +
            agravantesTotal;

        const desglose = [
            {
                concepto: 'Indemnización Básica',
                monto: indemnizacionBasica,
                descripcion: '1 mes de salario por año de antigüedad',
            },
            {
                concepto: 'Indemnización por Antigüedad',
                monto: indemnizacionAntiguedad,
                descripcion: `${antiguedad} años × salario × factor ${rubroSeleccionado.factor}`,
            },
            {
                concepto: 'Vacaciones no Gozadas',
                monto: indemnizacionVacaciones,
                descripcion: '14 días de vacaciones proporcionales',
            },
            {
                concepto: 'SAC Proporcional',
                monto: indemnizacionSAC,
                descripcion: '1/12 del sueldo anual complementario',
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
            indemnizacionBasica,
            indemnizacionAntiguedad,
            indemnizacionVacaciones,
            indemnizacionSAC,
            agravantes: agravantesDetalle,
            total,
            desglose,
        });

        // Pasar al paso de contacto
        setPaso('contacto');
    };

    const limpiarFormulario = () => {
        setFormData({
            salario: '',
            antiguedad: '',
            fechaIngreso: '',
            fechaEgreso: '',
            rubro: '',
            motivoDespido: 'sin_causa',
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
                antiguedad: parseFloat(formData.antiguedad),
                fechaIngreso: formData.fechaIngreso,
                fechaEgreso: formData.fechaEgreso,
                rubro: formData.rubro,
                motivoDespido: formData.motivoDespido,
                indemnizacionCalculada: resultado.total,
                quiereContacto: quiereContacto,
                agravantes: agravantes, // Incluir agravantes en los datos guardados
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
                                        Salario Mensual (ARS)
                                    </Label>
                                    <Input
                                        id="salario"
                                        type="number"
                                        placeholder="Ingrese su salario mensual"
                                        value={formData.salario}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                salario: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="antiguedad">
                                        Años de Antigüedad
                                    </Label>
                                    <Input
                                        id="antiguedad"
                                        type="number"
                                        step="0.1"
                                        placeholder="Ej: 5.5"
                                        value={formData.antiguedad}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                antiguedad: e.target.value,
                                            })
                                        }
                                    />
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
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaEgreso">
                                        Fecha de Egreso
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
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rubro">
                                        Rubro de Actividad
                                    </Label>
                                    <Select
                                        value={formData.rubro}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                rubro: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el rubro" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rubros.map((rubro) => (
                                                <SelectItem
                                                    key={rubro.id}
                                                    value={rubro.id}
                                                >
                                                    {rubro.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="motivoDespido">
                                        Motivo del Despido
                                    </Label>
                                    <Select
                                        value={formData.motivoDespido}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                motivoDespido: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el motivo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sin_causa">
                                                Sin causa (Art. 245)
                                            </SelectItem>
                                            <SelectItem value="con_causa">
                                                Con causa justificada
                                            </SelectItem>
                                            <SelectItem value="reduccion_personal">
                                                Reducción de personal
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                            Para que procedan las indemnizaciones de la Ley 24.013, debe haber intimación previa 
                                            y notificación a la AFIP. Consulte con un abogado laboral para casos específicos.
                                        </AlertDescription>
                                    </Alert>
                                    
                                    {/* Trabajo no registrado - Ley 24013 */}
                                    <div className="space-y-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-orange-600" />
                                            <Label className="text-sm font-medium text-orange-800">
                                                Trabajo no registrado
                                            </Label>
                                        </div>
                                        <div className="space-y-2 text-xs text-orange-700">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="ley24013_intimacion"
                                                    checked={agravantes.ley24013_intimacion}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            ley24013_intimacion: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                                                />
                                                <label htmlFor="ley24013_intimacion">
                                                    Ley 24013. Intimó antes del distrato la regularización con las formalidades del art. 11, Ley 24013 y cursó inmediatamente copia a la AFIP
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="ley24013_art8"
                                                    checked={agravantes.ley24013_art8}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            ley24013_art8: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                                                />
                                                <label htmlFor="ley24013_art8">
                                                    Art. 8, Ley 24013 - No registrar relación laboral
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="ley24013_art9"
                                                    checked={agravantes.ley24013_art9}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            ley24013_art9: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                                                />
                                                <label htmlFor="ley24013_art9">
                                                    Art. 9, Ley 24013 - Fecha de ingreso posterior a la real
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="ley24013_art10"
                                                    checked={agravantes.ley24013_art10}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            ley24013_art10: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                                                />
                                                <label htmlFor="ley24013_art10">
                                                    Art. 10, Ley 24013 - Remuneración menor a la real
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="ley24013_art15"
                                                    checked={agravantes.ley24013_art15}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            ley24013_art15: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                                                />
                                                <label htmlFor="ley24013_art15">
                                                    Art. 15, Ley 24013 - Despido dentro de 2 años de intimación
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="ley25323_art1"
                                                    checked={agravantes.ley25323_art1}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            ley25323_art1: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                                                />
                                                <label htmlFor="ley25323_art1">
                                                    Art. 1, Ley 25323 - Incremento del 100% en indemnización por antigüedad
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Otras infracciones */}
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
                                                    id="intimacionPago"
                                                    checked={agravantes.intimacionPago}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            intimacionPago: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-red-300 text-red-600 focus:ring-red-500"
                                                />
                                                <label htmlFor="intimacionPago">
                                                    Se intimó al pago de indemnizaciones de los arts. 232, 233 y 245, LCT? - Art. 2 Ley 25323
                                                </label>
                                            </div>
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

                                    {/* Indemnizaciones agravadas */}
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
                                                    Embarazo / Maternidad
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="matrimonio"
                                                    checked={agravantes.matrimonio}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            matrimonio: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                                                />
                                                <label htmlFor="matrimonio">
                                                    Matrimonio
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estabilidad social */}
                                    <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-blue-600" />
                                            <Label className="text-sm font-medium text-blue-800">
                                                Estabilidad social
                                            </Label>
                                        </div>
                                        <div className="space-y-2 text-xs text-blue-700">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="postulanteCandidato"
                                                    checked={agravantes.postulanteCandidato}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            postulanteCandidato: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor="postulanteCandidato">
                                                    Postulante o candidato
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="electo"
                                                    checked={agravantes.electo}
                                                    onChange={(e) =>
                                                        setAgravantes({
                                                            ...agravantes,
                                                            electo: e.target.checked,
                                                        })
                                                    }
                                                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor="electo">
                                                    Electo
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

                        {/* Información Legal - Mostrar en todos los pasos */}
                        {(paso === 'calculadora' || paso === 'contacto') && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Información Legal
                                    </CardTitle>
                                    <CardDescription>
                                        Base legal de la indemnización
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm text-gray-700">
                                        <div className="flex items-start gap-2">
                                            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Art. 245 LCT:</strong>{' '}
                                                Indemnización por despido sin
                                                causa justificada
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Art. 232 LCT:</strong>{' '}
                                                Sueldo anual complementario
                                                proporcional
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong>Art. 170 LCT:</strong>{' '}
                                                Vacaciones no gozadas
                                            </div>
                                        </div>
                                        
                                        {/* Información sobre agravantes */}
                                        <Separator className="my-3" />
                                        <div className="text-xs text-gray-600">
                                            <div className="font-medium mb-2">Agravantes aplicables:</div>
                                            <div className="space-y-1">
                                                <div><strong>Ley 24.013:</strong> Trabajo no registrado (Arts. 8, 9, 10, 15)</div>
                                                <div><strong>Ley 25.323:</strong> Falta de pago de indemnizaciones (Art. 1, 2)</div>
                                                <div><strong>Ley 25.345:</strong> Falta de entrega de certificados (Art. 45)</div>
                                                <div><strong>Protecciones especiales:</strong> Embarazo, maternidad, matrimonio</div>
                                                <div><strong>Estabilidad social:</strong> Postulantes, candidatos y electos</div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full mt-4"
                                        onClick={() =>
                                            setMostrarInfo(!mostrarInfo)
                                        }
                                    >
                                        {mostrarInfo
                                            ? 'Ocultar'
                                            : 'Ver más información'}
                                    </Button>
                                    
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                                        <div className="font-medium mb-2">Enlaces a normativa:</div>
                                        <div className="space-y-1">
                                            <a 
                                                href="https://www.argentina.gob.ar/normativa/nacional/ley-24013-285" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline block"
                                            >
                                                📋 Ley 24.013 - Ley Nacional de Empleo
                                            </a>
                                            <a 
                                                href="https://www.argentina.gob.ar/normativa/nacional/ley-25323-285" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline block"
                                            >
                                                📋 Ley 25.323 - Incremento de indemnizaciones laborales
                                            </a>
                                            <a 
                                                href="https://www.argentina.gob.ar/normativa/nacional/ley-25345-285" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline block"
                                            >
                                                📋 Ley 25.345 - Prevención de la evasión fiscal (Art. 45)
                                            </a>
                                        </div>
                                    </div>

                                    {mostrarInfo && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                                            <h4 className="font-semibold mb-2">
                                                Consideraciones importantes:
                                            </h4>
                                            <ul className="space-y-1 list-disc list-inside">
                                                <li>
                                                    La indemnización se calcula
                                                    sobre el mejor salario del
                                                    último año
                                                </li>
                                                <li>
                                                    Se incluyen todos los
                                                    conceptos remunerativos
                                                </li>
                                                <li>
                                                    Los montos están sujetos a
                                                    actualizaciones por
                                                    inflación
                                                </li>
                                                <li>
                                                    Consulte con un abogado
                                                    laboral para casos
                                                    específicos
                                                </li>
                                            </ul>
                                            
                                            <Separator className="my-3" />
                                            
                                            <h4 className="font-semibold mb-2 mt-4">
                                                Detalle de Agravantes:
                                            </h4>
                                            <div className="space-y-2 text-xs">
                                                <div className="p-2 bg-orange-100 rounded border-l-4 border-orange-400">
                                                    <strong className="text-orange-800">Ley 24.013 - Trabajo No Registrado:</strong>
                                                    <ul className="mt-1 space-y-1 text-orange-700">
                                                        <li>• <strong>Art. 8:</strong> ¼ de remuneraciones por no registrar relación laboral</li>
                                                        <li>• <strong>Art. 9:</strong> ¼ de remuneraciones por fecha de ingreso posterior</li>
                                                        <li>• <strong>Art. 10:</strong> ¼ de remuneraciones por salario menor al real</li>
                                                        <li>• <strong>Art. 15:</strong> Duplicación si despido dentro de 2 años de intimación</li>
                                                    </ul>
                                                </div>
                                                
                                                <div className="p-2 bg-red-100 rounded border-l-4 border-red-400">
                                                    <strong className="text-red-800">Ley 25.323 - Infracciones Adicionales:</strong>
                                                    <ul className="mt-1 space-y-1 text-red-700">
                                                        <li>• <strong>Art. 1:</strong> 100% adicional en indemnización por antigüedad</li>
                                                        <li>• <strong>Art. 2:</strong> 2 meses de salario por falta de pago de indemnizaciones</li>
                                                    </ul>
                                                </div>
                                                
                                                <div className="p-2 bg-pink-100 rounded border-l-4 border-pink-400">
                                                    <strong className="text-pink-800">Protecciones Especiales:</strong>
                                                    <ul className="mt-1 space-y-1 text-pink-700">
                                                        <li>• <strong>Embarazo/Maternidad:</strong> 6 meses de salario</li>
                                                        <li>• <strong>Matrimonio:</strong> 3 meses de salario</li>
                                                    </ul>
                                                </div>
                                                
                                                <div className="p-2 bg-blue-100 rounded border-l-4 border-blue-400">
                                                    <strong className="text-blue-800">Estabilidad Social:</strong>
                                                    <ul className="mt-1 space-y-1 text-blue-700">
                                                        <li>• <strong>Postulante/Candidato:</strong> 12 meses de salario</li>
                                                        <li>• <strong>Electo:</strong> 24 meses de salario</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
