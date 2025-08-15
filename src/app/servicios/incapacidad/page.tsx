'use client';
import React from 'react';
import Link from 'next/link';
import { montserrat } from '../../fonts';
import { evolventa } from '../../fonts';
import PageLayout from '../../components/PageLayout';
import { FaCalculator, FaArrowLeft, FaBalanceScale } from 'react-icons/fa';

const IncapacidadServicioPage = () => {
    return (
        <PageLayout
            title="Calculadora de Incapacidad Laboral Permanente"
            description="Calcula tu prestación por Incapacidad Laboral Permanente según la Ley 26.773 y Decreto PEN 669/19"
            breadcrumbText="volver a servicios"
            breadcrumbLink="/servicios"
        >
            <div className="grid md:grid-cols-6 md:gap-x-[1.25vw] text-[#1B1743]">
                <div className="md:col-span-6">
                    <div className="mb-[60px] md:mb-[5.55vh]">
                        <div className="flex items-center mb-4">
                            <div className="p-3 bg-[#F8F6F7] rounded-full mr-4">
                                <FaCalculator className="w-8 h-8 text-[#962C52]" />
                            </div>
                            <h1
                                className={`text-[24px] md:text-[3.33vh] leading-[26px] md:leading-[3.51vh] font-bold ${evolventa.className}`}
                            >
                                Calculadora de Incapacidad Laboral Permanente
                            </h1>
                        </div>
                        <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                            Calcula tu prestación por Incapacidad Laboral
                            Permanente (ILP) utilizando la fórmula oficial
                            establecida en la Ley 26.773 y actualizada por el
                            Decreto PEN 669/19. Nuestra calculadora te
                            proporciona un cálculo preciso y detallado de tu
                            prestación.
                        </p>
                    </div>

                    <div className="h-fit px-4 py-4 md:px-[1.25vw] md:py-[2.22vh] bg-[#F8F6F7] border-[0.09vh] border-[#F0F0F5] rounded-md shadow-md mb-[60px] md:mb-[5.55vh]">
                        <p className="font-medium text-[#962C52]">
                            <strong>Fórmula Oficial:</strong> 53 × (VIB) ×
                            porcentaje de Incapacidad × (65 / Edad a la PMI)
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-[60px] md:mb-[5.55vh]">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-[#1B1743] mb-4 flex items-center">
                                <FaCalculator className="w-5 h-5 text-[#962C52] mr-2" />
                                ¿Qué calcula?
                            </h4>
                            <ul className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium space-y-2">
                                <li>
                                    • Prestación básica según fórmula oficial
                                </li>
                                <li>
                                    • Piso mínimo según porcentaje de
                                    incapacidad
                                </li>
                                <li>
                                    • Compensación adicional (CAPU) para ILP
                                    50-66% y Total
                                </li>
                                <li>
                                    • Indemnización adicional del 20% para
                                    accidentes/enfermedades profesionales
                                </li>
                                <li>
                                    • Desglose detallado de todos los
                                    componentes
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-[#1B1743] mb-4 flex items-center">
                                <FaBalanceScale className="w-5 h-5 text-[#962C52] mr-2" />
                                Tipos de Incapacidad
                            </h4>
                            <ul className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium space-y-2">
                                <li>
                                    • <strong>ILP Parcial ≤ 50%:</strong> Solo
                                    prestación básica + piso mínimo
                                </li>
                                <li>
                                    • <strong>ILP 50-66%:</strong> +
                                    Compensación adicional de $24.755.211
                                </li>
                                <li>
                                    • <strong>ILP Total ≥ 66%:</strong> +
                                    Compensación adicional de $30.944.014
                                </li>
                                <li>
                                    • <strong>Gran Invalidez:</strong>{' '}
                                    Prestación mensual especial
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center mb-[60px] md:mb-[5.55vh]">
                        <Link
                            href="/incapacidad"
                            className="inline-flex items-center px-8 py-4 bg-[#962C52] text-white font-semibold rounded-lg hover:bg-[#7A2342] transition-colors duration-300 shadow-lg hover:shadow-xl"
                        >
                            <FaCalculator className="w-5 h-5 mr-3" />
                            Usar Calculadora de Incapacidad
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-[60px] md:mb-[5.55vh]">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-[#1B1743] mb-2">
                                Información Legal
                            </h4>
                            <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                                Base legal en Ley 26.773 y Decreto PEN 669/19.
                                Montos actualizados semestralmente por RIPTE.
                            </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-[#1B1743] mb-2">
                                Cálculo Preciso
                            </h4>
                            <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                                Utilizamos la fórmula oficial actualizada con
                                los valores vigentes para 2024-2025.
                            </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-[#1B1743] mb-2">
                                Asesoramiento
                            </h4>
                            <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium">
                                Después del cálculo, te ofrecemos asesoramiento
                                personalizado para tu caso específico.
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#F8F6F7] border border-[#F0F0F5] rounded-lg p-6">
                        <h3
                            className={`text-xl font-bold mb-4 ${evolventa.className}`}
                        >
                            ¿Necesitas ayuda con tu caso de incapacidad?
                        </h3>
                        <p className="text-sm md:text-[1.48vh] leading-5 md:leading-[2.22vh] font-medium mb-4">
                            Nuestro equipo de abogados especializados en derecho
                            laboral y seguridad social puede ayudarte a obtener
                            la máxima indemnización posible por tu incapacidad
                            laboral.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/incapacidad"
                                className="inline-flex items-center justify-center px-6 py-3 bg-[#962C52] text-white font-medium rounded-lg hover:bg-[#7A2342] transition-colors duration-300"
                            >
                                <FaCalculator className="w-4 h-4 mr-2" />
                                Calcular Ahora
                            </Link>
                            <Link
                                href="/#contact"
                                className="inline-flex items-center justify-center px-6 py-3 border border-[#962C52] text-[#962C52] font-medium rounded-lg hover:bg-[#962C52] hover:text-white transition-colors duration-300"
                            >
                                <FaArrowLeft className="w-4 h-4 mr-2" />
                                Consultar Abogado
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default IncapacidadServicioPage;
