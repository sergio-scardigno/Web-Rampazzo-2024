'use client';

import { useState, useEffect, useRef } from 'react';
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
import { getClientTrackingData } from '@/lib/tracking';
import { useAnalytics } from '@/hooks/useAnalytics';
import { calcularIndemnizacion as calcularIndemnizacionAPI } from '@/lib/calcApi';

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

// Hook personalizado para el efecto de contador animado
function useCountUp(end: number, duration: number = 4000) {
    const [count, setCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (end === 0) {
            setCount(0);
            return;
        }

        setIsAnimating(true);
        const startTime = Date.now();
        const startValue = 0;

        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Función de easing para un efecto más suave
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (end - startValue) * easeOutQuart;
            
            setCount(Math.floor(currentValue));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration]);

    return { count, isAnimating };
}

// Componente para mostrar resultados con contador animado
function ResultadoCard({ 
    resultado, 
    formatearMoneda, 
    paso, 
    quiereContacto, 
    limpiarFormulario 
}: { 
    resultado: IndemnizacionResult; 
    formatearMoneda: (monto: number) => string;
    paso: string;
    quiereContacto: boolean;
    limpiarFormulario: () => void;
}) {
    const { count: totalCount, isAnimating: totalAnimating } = useCountUp(resultado.total, 4000);
    
    // Referencia para hacer scroll automático
    const resultadoRef = useRef<HTMLDivElement>(null);
    
    // Hacer scroll automático cuando aparezca el resultado
    useEffect(() => {
        if (resultadoRef.current && totalAnimating) {
            // Detectar si es móvil de manera más robusta
            const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // En móvil: hacer scroll simple y directo al resultado
                setTimeout(() => {
                    if (resultadoRef.current) {
                        resultadoRef.current.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 100);
                
                // Después de que termine la animación, permitir scroll libre
                setTimeout(() => {
                    // No hacer nada - dejar que el usuario pueda hacer scroll libremente
                }, 4000);
                
            } else {
                // En desktop: hacer scroll completo hacia arriba (como al inicio de la página)
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 100);
                
                // Después de que termine la animación
                setTimeout(() => {
                    // En desktop: asegurar que esté completamente arriba
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    
                    // Scrolls adicionales para garantizar que esté arriba del todo
                    setTimeout(() => {
                        window.scrollTo(0, 0);
                        document.documentElement.scrollTop = 0;
                        document.body.scrollTop = 0;
                    }, 200);
                    
                    setTimeout(() => {
                        window.scrollTo(0, 0);
                        document.documentElement.scrollTop = 0;
                        document.body.scrollTop = 0;
                    }, 500);
                }, 4500); // 4 segundos de animación + 0.5 segundos extra
            }
        }
    }, [totalAnimating]);
    
    // Efecto adicional para asegurar que el formulario de contacto sea visible en móvil
    useEffect(() => {
        if (paso === 'contacto') {
            const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // En móvil: hacer scroll suave hacia arriba pero manteniendo visible el resultado
                setTimeout(() => {
                    // Calcular una posición que permita ver tanto el resultado como el formulario
                    const scrollPosition = window.innerHeight * 0.25; // 25% de la altura de la pantalla para mejor visibilidad
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }, 200);
            }
        }
    }, [paso]);
    
    return (
        <Card 
            className={`shadow-lg border-green-200 transition-all duration-700 ${
                totalAnimating ? 'animate-in fade-in slide-in-from-bottom-4' : ''
            }`} 
            ref={resultadoRef}
        >
            <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800 flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    {paso === 'contacto' ? 'Resultado del Cálculo' : 'Resultado Final'}
                </CardTitle>
                <CardDescription className="text-green-700">
                    {paso === 'contacto' ? 'Indemnización total a percibir' : 'Su indemnización calculada'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center mb-6">
                    <div 
                        className={`text-3xl font-bold text-green-800 mb-2 transition-all duration-500 ${
                            totalAnimating ? 'scale-105 text-green-700' : 'scale-100'
                        } ${
                            !totalAnimating && totalCount === resultado.total ? 'animate-pulse scale-110' : ''
                        }`}
                    >
                        {formatearMoneda(totalCount)}
                        {totalAnimating && (
                            <span className="inline-block ml-2 text-green-600 animate-pulse">
                                ⚡
                            </span>
                        )}
                        {!totalAnimating && totalCount === resultado.total && (
                            <span className="inline-block ml-2 text-green-600 animate-bounce">
                                🎯
                            </span>
                        )}
                    </div>
                    <Badge variant="outline" className="text-green-700">
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
                                    <Badge variant="secondary" className="text-orange-700 bg-orange-100 text-xs">
                                        <span className="hidden sm:inline">Trabajo no registrado: </span>
                                        <span className="sm:hidden">TNR: </span>
                                        {formatearMoneda(resultado.agravantes.trabajoNoRegistrado)}
                                    </Badge>
                                )}
                                {resultado.agravantes.otrasInfracciones > 0 && (
                                    <Badge variant="secondary" className="text-red-700 bg-red-100 text-xs">
                                        <span className="hidden sm:inline">Otras infracciones: </span>
                                        <span className="sm:hidden">Infracciones: </span>
                                        {formatearMoneda(resultado.agravantes.otrasInfracciones)}
                                    </Badge>
                                )}
                                {resultado.agravantes.indemnizacionesAgravadas > 0 && (
                                    <Badge variant="secondary" className="text-pink-700 bg-pink-100 text-xs">
                                        <span className="hidden sm:inline">Protecciones especiales: </span>
                                        <span className="sm:hidden">Protecciones: </span>
                                        {formatearMoneda(resultado.agravantes.indemnizacionesAgravadas)}
                                    </Badge>
                                )}
                                {resultado.agravantes.estabilidadSocial > 0 && (
                                    <Badge variant="secondary" className="text-blue-700 bg-blue-100 text-xs">
                                        <span className="hidden sm:inline">Estabilidad social: </span>
                                        <span className="sm:hidden">Estabilidad: </span>
                                        {formatearMoneda(resultado.agravantes.estabilidadSocial)}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                    {resultado.desglose.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded-lg gap-2"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 text-sm sm:text-base">
                                    {item.concepto}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                    {item.descripcion}
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="font-bold text-gray-900 text-sm sm:text-base">
                                    {formatearMoneda(item.monto)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {paso === 'resultado' && (
                    <>
                        {quiereContacto && (
                            <Alert className="border-blue-200 bg-blue-50 mt-4">
                                <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <AlertDescription className="text-blue-800 text-sm leading-relaxed">
                                    Nos pondremos en contacto contigo pronto para brindarte asesoramiento personalizado.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <Button onClick={limpiarFormulario} className="flex-1 min-w-0">
                                Nueva Consulta
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default function IndemnizacionPage() {
    const { trackCalculation, trackFormSubmission, trackServiceView } = useAnalytics();
    
    // Trackear vista de la página de indemnización
    useEffect(() => {
        trackServiceView('indemnizacion');
    }, [trackServiceView]);

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
    const [quiereContacto, setQuiereContacto] = useState<boolean>(true);
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState<{
        tipo: 'success' | 'error';
        texto: string;
    } | null>(null);

    const calcularIndemnizacion = async () => {
        const salario = parseFloat(formData.salario);
        const fechaIngreso = formData.fechaIngreso;
        const fechaEgreso = formData.fechaEgreso;
        const preaviso = formData.preaviso;

        if (!formData.salario || !formData.fechaIngreso || !formData.fechaEgreso) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        if (!salario || salario < 100000 || salario > 50000000) {
            alert('Por favor ingrese un sueldo válido entre $100,000 y $50,000,000 pesos');
            return;
        }

        try {
            const resp = await calcularIndemnizacionAPI({
                salario,
                fechaIngreso,
                fechaEgreso,
                preaviso,
                agravantes,
            });

            const resultadoCalculado: IndemnizacionResult = resp;
            setResultado(resultadoCalculado);

            // Trackear cálculo completado
            const yearsWorked = Math.floor((new Date(fechaEgreso).getTime() - new Date(fechaIngreso).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
            trackCalculation('indemnizacion', {
                total_amount: resultadoCalculado.total,
                salary: salario,
                years_worked: yearsWorked,
                months_worked: undefined,
                has_preaviso: preaviso,
                has_agravantes: Object.values(agravantes).some(v => v),
                agravantes_count: Object.values(agravantes).filter(v => v).length,
            });

            // Pasar al paso de contacto
            setPaso('contacto');
        } catch (e: any) {
            console.error('Error cálculo API:', e?.message || e);
            alert('No se pudo calcular. Verificá la conexión con la API.');
        }
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
        setQuiereContacto(true);
        setMensaje(null);
    };

    const guardarDatos = async () => {
        if (!resultado) return;

        setGuardando(true);
        setMensaje(null);

        try {
            // Trackear envío de formulario de indemnización
            trackFormSubmission('indemnizacion', {
                indemnization_amount: resultado.total,
                salary: parseFloat(formData.salario),
                years_worked: Math.floor((new Date(formData.fechaEgreso).getTime() - new Date(formData.fechaIngreso).getTime()) / (1000 * 60 * 60 * 24 * 365.25)),
                wants_contact: quiereContacto,
            });

            // Obtener información de tracking del cliente
            const trackingData = getClientTrackingData();
            
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
                tracking: trackingData,
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
                 <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-8 ">
            <div className="container mx-auto px-4 max-w-4xl">
                                 <div className="text-center mb-6 sm:mb-8 mt-20 sm:mt-20">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Calculadora de Indemnización por Despido
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 px-2">
                        Calcula tu indemnización según la Ley de Contrato de
                        Trabajo Argentina
                    </p>
                    <Badge variant="secondary" className="mt-2">
                        Ley 20.744 - Art. 245
                    </Badge>

                    {/* Indicador de progreso */}
                    <div className="flex justify-center mt-4 sm:mt-6 px-2">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div
                                className={`flex items-center ${
                                    paso === 'calculadora'
                                        ? 'text-blue-600'
                                        : 'text-gray-400'
                                }`}
                            >
                                <div
                                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
                                        paso === 'calculadora'
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-gray-300 bg-white'
                                    }`}
                                >
                                    1
                                </div>
                                <span className="ml-1 sm:ml-2 font-medium text-sm sm:text-base">Datos</span>
                            </div>
                            <div
                                className={`w-8 sm:w-12 h-0.5 ${
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
                                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
                                        paso === 'contacto'
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-green-600 bg-green-600 text-white'
                                    }`}
                                >
                                    2
                                </div>
                                <span className="ml-1 sm:ml-2 font-medium text-sm sm:text-base">
                                    {paso === 'resultado' ? 'Resultado' : 'Contacto'}
                                </span>
                            </div>
                            <div
                                className={`w-8 sm:w-12 h-0.5 ${
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
                                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
                                        paso === 'resultado'
                                            ? 'border-green-600 bg-green-600 text-white'
                                            : 'border-gray-300 bg-white'
                                    }`}
                                >
                                    3
                                </div>
                                <span className="ml-1 sm:ml-2 font-medium text-sm sm:text-base">
                                    Resultado
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-6 lg:gap-8">
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
                                    <Label htmlFor="salario" className="flex items-center gap-2">
                                        Mejor Sueldo Bruto (en pesos)
                                        <span className="text-red-500 text-sm">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="salario"
                                            type="number"
                                            placeholder="Ej: 150000"
                                            value={formData.salario}
                                            onChange={(e) => {
                                                const valor = e.target.value;
                                                if (valor === '') {
                                                    setFormData({
                                                        ...formData,
                                                        salario: '',
                                                    });
                                                } else {
                                                    const valorNumerico = parseFloat(valor);
                                                    if (!isNaN(valorNumerico) && valorNumerico > 0) {
                                                        setFormData({
                                                            ...formData,
                                                            salario: valor,
                                                        });
                                                    }
                                                }
                                            }}
                                            onBlur={(e) => {
                                                // Validar límites al perder el foco
                                                const valor = e.target.value;
                                                if (valor) {
                                                    const valorNumerico = parseFloat(valor);
                                                    if (valorNumerico < 100000) {
                                                        alert('El sueldo mínimo es $100,000 pesos');
                                                        e.target.value = '';
                                                        setFormData({
                                                            ...formData,
                                                            salario: '',
                                                        });
                                                    } else if (valorNumerico > 50000000) {
                                                        alert('El sueldo máximo es $50,000,000 pesos');
                                                        e.target.value = '';
                                                        setFormData({
                                                            ...formData,
                                                            salario: '',
                                                        });
                                                    }
                                                }
                                            }}
                                            min="100000"
                                            max="50000000"
                                            step="1000"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span className="text-sm text-gray-500">ARS</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        💰 Ingrese el sueldo completo (ej: 150000 para $150,000)
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        📊 Rango permitido: $100,000 a $50,000,000 pesos
                                    </p>
                                    {formData.salario && (
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-800 font-medium">
                                                💡 Sueldo ingresado: {formatearMoneda(parseFloat(formData.salario))}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaIngreso" className="flex items-center gap-2">
                                        Fecha de Ingreso
                                        <span className="text-red-500 text-sm">*</span>
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
                                    <Label htmlFor="fechaEgreso" className="flex items-center gap-2">
                                        Fecha de Despido
                                        <span className="text-red-500 text-sm">*</span>
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
                                    <div className="flex flex-col sm:flex-row gap-3">
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
                                            className="flex-1 min-w-0"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">Sí, hubo preaviso</span>
                                            <span className="sm:hidden">Sí</span>
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
                                            className="flex-1 min-w-0"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">No, no hubo preaviso</span>
                                            <span className="sm:hidden">No</span>
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
                                        <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                        <AlertDescription className="text-blue-800 text-xs leading-relaxed">
                                            <strong>Importante:</strong> Los agravantes se aplican según la normativa vigente. 
                                            Consulte con un abogado laboral para casos específicos.
                                        </AlertDescription>
                                    </Alert>
                                    
                                    {/* Indemnizaciones agravadas - Solo embarazo/maternidad */}
                                    <div className="space-y-3 p-3 sm:p-4 bg-pink-50 rounded-lg border border-pink-200">
                                        <div className="flex items-center gap-2">
                                            <Heart className="h-4 w-4 text-pink-600 flex-shrink-0" />
                                            <Label className="text-sm font-medium text-pink-800">
                                                Indemnizaciones agravadas
                                            </Label>
                                        </div>
                                        <div className="space-y-2 text-xs text-pink-700">
                                            <div className="flex items-start gap-2">
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
                                                    className="rounded border-pink-300 text-pink-600 focus:ring-pink-500 mt-0.5 flex-shrink-0"
                                                />
                                                <label htmlFor="embarazoMaternidad" className="leading-relaxed">
                                                    Embarazo / Maternidad - Art. 2 LCT
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Otras infracciones - Solo Art. 80 */}
                                    <div className="space-y-3 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                            <Label className="text-sm font-medium text-red-800">
                                                Otras infracciones
                                            </Label>
                                        </div>
                                        <div className="space-y-2 text-xs text-red-700">
                                            <div className="flex items-start gap-2">
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
                                                    className="rounded border-red-300 text-red-600 focus:ring-pink-500 mt-0.5 flex-shrink-0"
                                                />
                                                <label htmlFor="certificadosArt80" className="leading-relaxed">
                                                    Intimación y falta de entrega de los certificados del art. 80, LCT - Art. 45, Ley 25345
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                                    <Button
                                        onClick={calcularIndemnizacion}
                                        className="flex-1 min-w-0"
                                    >
                                        Calcular Indemnización
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={limpiarFormulario}
                                        className="flex-1 min-w-0"
                                    >
                                        Limpiar
                                    </Button>
                                </div>
                                
                                {/* Explicación del campo de salario */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-start gap-2">
                                        <div className="text-blue-600 text-sm mt-0.5">💡</div>
                                        <div className="text-xs text-gray-700">
                                            <p className="font-medium mb-1">¿Cómo funciona el campo de salario?</p>
                                            <ul className="space-y-1 text-gray-600">
                                                <li>• <strong>Ingrese 150000</strong> si su sueldo es $150,000</li>
                                                <li>• <strong>Ingrese 200000</strong> si su sueldo es $200,000</li>
                                                <li>• <strong>Ingrese 50000000</strong> si su sueldo es $50,000,000</li>
                                            </ul>
                                            <p className="mt-2 text-gray-500">Ingrese el sueldo completo con todos los ceros. El sistema valida que esté entre $100,000 y $50,000,000 pesos.</p>
                                        </div>
                                    </div>
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
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button
                                            variant={
                                                quiereContacto === true
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            onClick={() =>
                                                setQuiereContacto(true)
                                            }
                                            className="flex-1 min-w-0"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">Sí, contactenme</span>
                                            <span className="sm:hidden">Sí</span>
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
                                            className="flex-1 min-w-0"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">No, gracias</span>
                                            <span className="sm:hidden">No</span>
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

                                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                                    <Button
                                        onClick={guardarDatos}
                                        className="flex-1 min-w-0"
                                        disabled={
                                            guardando ||
                                            !contactData.nombre ||
                                            !contactData.telefono
                                        }
                                    >
                                        {guardando
                                            ? 'Guardando...'
                                            : 'Continuar'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPaso('calculadora')}
                                        className="flex-1 min-w-0"
                                    >
                                        Volver
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                                                              {/* Resultados */}
                      <div className="space-y-2 sm:space-y-6">
                          {/* Mostrar resultado en paso de contacto */}
                          {paso === 'contacto' && resultado && (
                              <ResultadoCard 
                                  resultado={resultado} 
                                  formatearMoneda={formatearMoneda}
                                  paso="contacto"
                                  quiereContacto={quiereContacto}
                                  limpiarFormulario={limpiarFormulario}
                              />
                          )}

                        {/* Mostrar resultado final en paso de resultado */}
                        {paso === 'resultado' && resultado && (
                            <ResultadoCard 
                                resultado={resultado} 
                                formatearMoneda={formatearMoneda}
                                paso="resultado"
                                quiereContacto={quiereContacto}
                                limpiarFormulario={limpiarFormulario}
                            />
                        )}

                        {/* Advertencia - Mostrar en todos los pasos */}
                        {(paso === 'calculadora' || paso === 'contacto') && (
                            <Alert className="border-orange-200 bg-orange-50">
                                <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                                <AlertDescription className="text-orange-800 text-sm leading-relaxed">
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
