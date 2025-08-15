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
} from 'lucide-react';

interface IndemnizacionResult {
    indemnizacionBasica: number;
    indemnizacionAntiguedad: number;
    indemnizacionVacaciones: number;
    indemnizacionSAC: number;
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

        const total =
            indemnizacionBasica +
            indemnizacionAntiguedad +
            indemnizacionVacaciones +
            indemnizacionSAC;

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

        setResultado({
            indemnizacionBasica,
            indemnizacionAntiguedad,
            indemnizacionVacaciones,
            indemnizacionSAC,
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
                                    <Input
                                        id="telefono"
                                        type="tel"
                                        placeholder="Ej: +54 11 1234-5678"
                                        value={contactData.telefono}
                                        onChange={(e) =>
                                            setContactData({
                                                ...contactData,
                                                telefono: e.target.value,
                                            })
                                        }
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
