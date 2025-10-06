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
    CheckCircle,
    XCircle,
} from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { calculateIncapacidad } from '@/lib/calculators';

interface IncapacidadResult {
    prestacionBasica: number;
    pisoMinimo: number;
    compensacionAdicional: number;
    indemnizacionAdicional: number;
    total: number;
    desglose: {
        concepto: string;
        monto: number;
        descripcion: string;
    }[];
}

export default function IncapacidadPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        ingresoBase: '',
        porcentajeIncapacidad: '',
        edad: '',
        tipoContingencia: 'accidente_trabajo',
        fechaContingencia: '',
        fechaPMI: '',
    });

    const [resultado, setResultado] = useState<IncapacidadResult | null>(null);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [paso, setPaso] = useState<'calculadora' | 'contacto' | 'resultado'>(
        'calculadora'
    );
    const [quiereContacto, setQuiereContacto] = useState<boolean>(true);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState<{
        tipo: 'success' | 'error';
        texto: string;
    } | null>(null);

    // Valores para mostrar en el desglose (las constantes ya se usan dentro del calculador compartido)
    const PISO_MINIMO = 55699217;

    const tiposContingencia = [
        { id: 'accidente_trabajo', nombre: 'Accidente de trabajo' },
        { id: 'enfermedad_profesional', nombre: 'Enfermedad profesional' },
        { id: 'accidente_in_itinere', nombre: 'Accidente in itinere' },
        { id: 'otro', nombre: 'Otro' },
    ];

    const calcularIncapacidad = () => {
        const ingresoBase = parseFloat(formData.ingresoBase);
        const porcentajeIncapacidad = parseFloat(formData.porcentajeIncapacidad);
        const edad = parseFloat(formData.edad);

        if (!ingresoBase || !porcentajeIncapacidad || !edad || !formData.fechaContingencia || !formData.fechaPMI) {
            alert('Por favor complete todos los campos');
            return;
        }

        const calc = calculateIncapacidad({
            ingresoBase,
            porcentajeIncapacidad,
            edad,
            tipoContingencia: formData.tipoContingencia as any,
        });

        const desglose = [
            {
                concepto: 'Prestación Básica',
                monto: calc.prestacionBasica,
                descripcion: `53 × $${ingresoBase.toLocaleString()} × ${porcentajeIncapacidad}% × (65/${edad})`,
            },
            {
                concepto: 'Piso Mínimo',
                monto: calc.pisoMinimo,
                descripcion: `$${PISO_MINIMO.toLocaleString()} × ${porcentajeIncapacidad}%`,
            },
        ];

        if (calc.compensacionAdicional > 0) {
            desglose.push({
                concepto: 'Compensación Adicional (CAPU)',
                monto: calc.compensacionAdicional,
                descripcion:
                    porcentajeIncapacidad >= 66 ? 'ILP Total' : 'ILP 50-66%',
            });
        }

        if (calc.indemnizacionAdicional > 0) {
            desglose.push({
                concepto: 'Indemnización Adicional (IAPU)',
                monto: calc.indemnizacionAdicional,
                descripcion:
                    '20% adicional por accidente/enfermedad profesional',
            });
        }

        setResultado({
            prestacionBasica: calc.prestacionBasica,
            pisoMinimo: calc.pisoMinimo,
            compensacionAdicional: calc.compensacionAdicional,
            indemnizacionAdicional: calc.indemnizacionAdicional,
            total: calc.total,
            desglose,
        });

        setPaso('contacto');
    };

    const limpiarFormulario = () => {
        setFormData({
            nombre: '',
            telefono: '',
            ingresoBase: '',
            porcentajeIncapacidad: '',
            edad: '',
            tipoContingencia: 'accidente_trabajo',
            fechaContingencia: '',
            fechaPMI: '',
        });
        setResultado(null);
        setPaso('calculadora');
        setQuiereContacto(true);
        setMensaje(null);
    };

    const guardarDatos = async () => {
        if (!resultado) return;

        setGuardando(true);
        setMensaje(null);

        try {
            const datosParaGuardar = {
                nombre: formData.nombre,
                telefono: formData.telefono,
                ingresoBase: parseFloat(formData.ingresoBase),
                porcentajeIncapacidad: parseFloat(
                    formData.porcentajeIncapacidad
                ),
                edad: parseFloat(formData.edad),
                tipoContingencia: formData.tipoContingencia,
                fechaContingencia: formData.fechaContingencia,
                fechaPMI: formData.fechaPMI,
                prestacionCalculada: resultado.total,
                quiereContacto: quiereContacto,
            };

            const response = await fetch('/api/incapacidad', {
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

    const formatearMoneda = (monto: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        }).format(monto);
    };

    const obtenerTipoIncapacidad = (porcentaje: number) => {
        if (porcentaje <= 50) return 'ILP Parcial ≤ 50%';
        if (porcentaje > 50 && porcentaje < 66) return 'ILP 50-66%';
        if (porcentaje >= 66) return 'ILP Total ≥ 66%';
        return 'ILP';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12 mt-20">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Calculadora de Incapacidad Laboral Permanente
                    </h1>
                    <p className="text-xl text-gray-600">
                        Calcula tu prestación según la Ley 26.773 y Decreto PEN
                        669/19
                    </p>
                    <Badge variant="secondary" className="mt-2">
                        Ley 26.773 - Decreto PEN 669/19
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
                                <span className="ml-2 font-medium">Contacto</span>
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
                                <span className="ml-2 font-medium">Resultado</span>
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
                                    prestación por incapacidad
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ingresoBase" className="flex items-center gap-2">
                                        Ingreso Base Mensual (VIB)
                                        <div className="relative group">
                                            <Info className="h-4 w-4 text-blue-500 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                                Valor del Ingreso Base - salario promedio sobre el cual se calcula la prestación
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                            </div>
                                        </div>
                                    </Label>
                                    <Input
                                        id="ingresoBase"
                                        type="number"
                                        placeholder="Ingrese su ingreso base mensual"
                                        value={formData.ingresoBase}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                ingresoBase: e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-xs text-gray-600">
                                        💰 <strong>VIB:</strong> Valor del Ingreso Base - salario promedio para el cálculo de la prestación
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="porcentajeIncapacidad" className="flex items-center gap-2">
                                        Porcentaje de Incapacidad (%)
                                        <div className="relative group">
                                            <Info className="h-4 w-4 text-blue-500 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                                Grado de limitación funcional evaluado por la Junta Médica (0-100%)
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                            </div>
                                        </div>
                                    </Label>
                                    <Input
                                        id="porcentajeIncapacidad"
                                        type="number"
                                        step="0.1"
                                        placeholder="Ej: 75.5"
                                        value={formData.porcentajeIncapacidad}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                porcentajeIncapacidad:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-xs text-gray-600">
                                        🏥 <strong>Porcentaje:</strong> Evaluado por la Junta Médica - determina el tipo de ILP (Parcial ≤50%, 50-66%, Total ≥66%)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edad" className="flex items-center gap-2">
                                        Edad a la PMI
                                        <div className="relative group">
                                            <Info className="h-4 w-4 text-blue-500 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                                Edad del trabajador en la fecha del PMI (Período de Mejoramiento de la Incapacidad)
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                            </div>
                                        </div>
                                    </Label>
                                    <Input
                                        id="edad"
                                        type="number"
                                        placeholder="Edad en años"
                                        value={formData.edad}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                edad: e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-xs text-gray-600">
                                        📋 <strong>PMI:</strong> Período de Mejoramiento de la Incapacidad - fecha en que se considera que la incapacidad se estabilizó
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipoContingencia" className="flex items-center gap-2">
                                        Tipo de Contingencia
                                        <div className="relative group">
                                            <Info className="h-4 w-4 text-blue-500 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                                Evento que causa la incapacidad (accidente laboral, enfermedad profesional, etc.)
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                            </div>
                                        </div>
                                    </Label>
                                    <Select
                                        value={formData.tipoContingencia}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                tipoContingencia: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione el tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tiposContingencia.map((tipo) => (
                                                <SelectItem
                                                    key={tipo.id}
                                                    value={tipo.id}
                                                >
                                                    {tipo.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-600">
                                        ⚠️ <strong>Contingencia:</strong> Causa de la incapacidad - determina si aplica indemnización adicional del 20%
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaContingencia" className="flex items-center gap-2">
                                        Fecha de Contingencia
                                        <div className="relative group">
                                            <Info className="h-4 w-4 text-blue-500 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                                Día en que ocurrió el accidente o se diagnosticó la enfermedad
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                            </div>
                                        </div>
                                    </Label>
                                    <Input
                                        id="fechaContingencia"
                                        type="date"
                                        value={formData.fechaContingencia}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                fechaContingencia: e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-xs text-gray-600">
                                        📅 <strong>Contingencia:</strong> Día del accidente o diagnóstico de la enfermedad
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaPMI" className="flex items-center gap-2">
                                        Fecha PMI
                                        <div className="relative group">
                                            <Info className="h-4 w-4 text-blue-500 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                                Período de Mejoramiento de la Incapacidad - fecha de estabilización
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                            </div>
                                        </div>
                                    </Label>
                                    <Input
                                        id="fechaPMI"
                                        type="date"
                                        value={formData.fechaPMI}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                fechaPMI: e.target.value,
                                            })
                                        }
                                    />
                                    <p className="text-xs text-gray-600">
                                        📋 <strong>PMI:</strong> Período de Mejoramiento de la Incapacidad - fecha desde la cual se considera que la incapacidad se estabilizó
                                    </p>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        onClick={calcularIncapacidad}
                                        className="flex-1"
                                        disabled={
                                            !formData.ingresoBase ||
                                            !formData.porcentajeIncapacidad ||
                                            !formData.edad ||
                                            !formData.fechaContingencia ||
                                            !formData.fechaPMI
                                        }
                                    >
                                        Calcular Prestación
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

                         {/* Mostrar resultado final en paso de resultado */}
                         {paso === 'resultado' && resultado && (
                             <Card className="shadow-lg border-green-200">
                                 <CardHeader className="bg-green-50">
                                     <CardTitle className="text-green-800 flex items-center gap-2">
                                         <Calculator className="h-5 w-5" />
                                         Resultado Final
                                     </CardTitle>
                                     <CardDescription className="text-green-700">
                                         Su prestación por incapacidad calculada
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
                                         <div className="mt-2">
                                             <Badge variant="secondary">
                                                 {obtenerTipoIncapacidad(
                                                     parseFloat(
                                                         formData.porcentajeIncapacidad
                                                     )
                                                 )}
                                             </Badge>
                                         </div>
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
                                                 Nos pondremos en contacto contigo pronto para brindarte asesoramiento personalizado.
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

                    {/* Paso 2: Formulario de Contacto */}
                    {paso === 'contacto' && (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Información de Contacto
                                </CardTitle>
                                <CardDescription>
                                    Complete sus datos para recibir el resultado y asesoramiento personalizado
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
                                        value={formData.nombre}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
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
                                            value={formData.telefono}
                                            onChange={(value) =>
                                                setFormData({
                                                    ...formData,
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
                                            !formData.nombre ||
                                            !formData.telefono
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
                                        Prestación por Incapacidad Laboral
                                        Permanente
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
                                        <div className="mt-2">
                                            <Badge variant="secondary">
                                                {obtenerTipoIncapacidad(
                                                    parseFloat(
                                                        formData.porcentajeIncapacidad
                                                    )
                                                )}
                                            </Badge>
                                        </div>
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

                        {/* Advertencia */}
                        <Alert className="border-orange-200 bg-orange-50">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-800">
                                Esta calculadora es informativa. Para casos
                                específicos o disputas legales, consulte con un
                                abogado laboral especializado.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </div>
    );
}
