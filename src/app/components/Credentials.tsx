"use client";

import React from "react";
import { Award, Shield, Users, Clock, CheckCircle } from "lucide-react";

interface Credential {
  icon: React.ReactNode;
  title: string;
  description: string;
  verified?: boolean;
}

const credentials: Credential[] = [
  {
    icon: <Award className="w-8 h-8 text-[#962C52]" />,
    title: "Colegio de Abogados de Buenos Aires",
    description: "Matriculado y habilitado para el ejercicio profesional",
    verified: true
  },
  {
    icon: <Shield className="w-8 h-8 text-[#962C52]" />,
    title: "Especialista en Derecho Previsional",
    description: "Más de 15 años de experiencia en jubilaciones y pensiones",
    verified: true
  },
  {
    icon: <Users className="w-8 h-8 text-[#962C52]" />,
    title: "500+ Clientes Satisfechos",
    description: "Casos exitosos en todo el territorio argentino",
    verified: true
  },
  {
    icon: <Clock className="w-8 h-8 text-[#962C52]" />,
    title: "Atención Personalizada",
    description: "Respuesta en menos de 24 horas a todas las consultas",
    verified: true
  }
];

const stats = [
  { number: "95%", label: "Casos Exitosos" },
  { number: "15+", label: "Años de Experiencia" },
  { number: "500+", label: "Clientes Atendidos" },
  { number: "24h", label: "Tiempo de Respuesta" }
];

interface CredentialsProps {
  className?: string;
  showStats?: boolean;
  variant?: 'grid' | 'list' | 'compact';
}

const Credentials: React.FC<CredentialsProps> = ({
  className = "",
  showStats = true,
  variant = 'grid'
}) => {
  if (variant === 'compact') {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#1B1743]">Credenciales Profesionales</h3>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {credentials.slice(0, 4).map((credential, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-4 h-4 text-[#962C52]">✓</div>
              <span className="text-gray-700">{credential.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-xl font-semibold text-[#1B1743] mb-4">
          Credenciales y Certificaciones
        </h3>
        {credentials.map((credential, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
            <div className="flex-shrink-0">
              {credential.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-[#1B1743]">{credential.title}</h4>
                {credential.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              <p className="text-gray-600 text-sm">{credential.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Variant 'grid' (default)
  return (
    <div className={`${className}`}>
      <div className="text-center mb-8 px-4 md:px-0">
        <h3 className="text-2xl font-bold text-[#1B1743] mb-4">
          Credenciales Profesionales
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Más de 15 años de experiencia especializada en derecho previsional y laboral
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4 md:px-0">
        {credentials.map((credential, index) => (
          <div key={index} className="text-center p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              {credential.icon}
            </div>
            <h4 className="font-semibold text-[#1B1743] mb-2 flex items-center justify-center space-x-1">
              <span>{credential.title}</span>
              {credential.verified && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </h4>
            <p className="text-sm text-gray-600">{credential.description}</p>
          </div>
        ))}
      </div>

      {showStats && (
        <div className="bg-gradient-to-r from-[#962C52] to-[#7a2342] text-white rounded-lg p-6 md:p-8 mx-4 md:mx-0">
          <h4 className="text-xl font-semibold text-center mb-6">
            Nuestros Números
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Credentials;
