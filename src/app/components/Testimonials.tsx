"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface Testimonial {
  id: number;
  name: string;
  age: number;
  location: string;
  service: string;
  content: string;
  rating: number;
  image?: string;
  verified?: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "María González",
    age: 62,
    location: "Buenos Aires",
    service: "Jubilación",
    content: "Gracias al Dr. Rampazzo pude jubilarme sin problemas. Su asesoramiento fue fundamental para entender todos los requisitos y preparar la documentación correctamente. El proceso fue mucho más rápido de lo esperado.",
    rating: 5,
    verified: true
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    age: 58,
    location: "Córdoba",
    service: "Reajuste de haberes",
    content: "Después de años de espera, el Dr. Rampazzo logró que me reconocieran mis años de aportes no registrados. Ahora recibo un haber mucho más justo. Su dedicación y conocimiento son excepcionales.",
    rating: 5,
    verified: true
  },
  {
    id: 3,
    name: "Ana Martínez",
    age: 65,
    location: "Rosario",
    service: "Pensión por fallecimiento",
    content: "Cuando falleció mi esposo, no sabía qué hacer. El Dr. Rampazzo me guió en todo el proceso de la pensión por fallecimiento. Fue muy paciente y me explicó cada paso. Ahora tengo la tranquilidad económica que necesitaba.",
    rating: 5,
    verified: true
  },
  {
    id: 4,
    name: "Roberto Silva",
    age: 60,
    location: "Mendoza",
    service: "Jubilación por invalidez",
    content: "Por mi discapacidad no podía trabajar, pero no sabía cómo tramitar la jubilación por invalidez. El Dr. Rampazzo me ayudó con todo el proceso y logré obtener mi jubilación. Muy profesional y humano.",
    rating: 5,
    verified: true
  },
  {
    id: 5,
    name: "Elena Fernández",
    age: 67,
    location: "La Plata",
    service: "Rentas vitalicias",
    content: "Tenía dudas sobre las rentas vitalicias y cómo afectaban mi jubilación. El Dr. Rampazzo me explicó todo claramente y me ayudó a tomar la mejor decisión. Su experiencia se nota en cada consulta.",
    rating: 5,
    verified: true
  },
  {
    id: 6,
    name: "José López",
    age: 63,
    location: "Tucumán",
    service: "Reconocimiento de servicios",
    content: "Trabajé muchos años en el campo y no tenía todos mis aportes registrados. El Dr. Rampazzo logró que me reconocieran esos años y ahora mi jubilación es mucho mejor. Un verdadero profesional.",
    rating: 5,
    verified: true
  }
];

interface TestimonialsProps {
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  interval?: number;
  maxTestimonials?: number;
}

const Testimonials: React.FC<TestimonialsProps> = ({
  className = "",
  showControls = true,
  autoPlay = true,
  interval = 5000,
  maxTestimonials = 3
}) => {
  const { trackEvent } = useAnalytics();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const displayedTestimonials = testimonials.slice(0, maxTestimonials);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === displayedTestimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval, displayedTestimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? displayedTestimonials.length - 1 : currentIndex - 1);
    trackEvent('testimonial_navigation', { direction: 'previous' });
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === displayedTestimonials.length - 1 ? 0 : currentIndex + 1);
    trackEvent('testimonial_navigation', { direction: 'next' });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    trackEvent('testimonial_dot_click', { index });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    trackEvent('testimonial_autoplay_toggle', { isPlaying: !isPlaying });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="text-center mb-8 px-4 md:px-0">
        <h2 className="text-3xl font-bold text-[#1B1743] mb-4">
          Lo que dicen nuestros clientes
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Más de 15 años ayudando a argentinos a acceder a sus derechos previsionales
        </p>
      </div>

      {/* Testimonials - Mobile (stacked) */}
      <div className="space-y-6 px-3 sm:px-4 md:hidden">
        {displayedTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white border-2 border-gray-100 rounded-xl p-6 shadow-lg">
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <Quote className="w-12 h-12 text-[#962C52] opacity-20" />
            </div>

            {/* Content */}
            <blockquote className="text-lg text-gray-700 italic text-center mb-6 leading-relaxed">
              &ldquo;{testimonial.content}&rdquo;
            </blockquote>

            {/* Rating */}
            <div className="flex justify-center mb-4">
              <div className="flex space-x-1">
                {renderStars(testimonial.rating)}
              </div>
            </div>

            {/* Author Info */}
            <div className="text-center">
              <div className="flex flex-col items-center justify-center space-y-2 mb-2">
                <h4 className="font-semibold text-[#1B1743] text-lg">
                  {testimonial.name}
                </h4>
                {testimonial.verified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    ✓ Verificado
                  </span>
                )}
              </div>
              <p className="text-gray-600">
                {testimonial.age} años • {testimonial.location}
              </p>
              <p className="text-[#962C52] font-medium">
                {testimonial.service}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials Container - Desktop */}
      <div className="hidden md:block relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayedTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-3 sm:px-4">
              <div className="bg-white border-2 border-gray-100 rounded-xl p-6 md:p-8 shadow-lg max-w-full md:max-w-4xl mx-auto">
                {/* Quote Icon */}
                <div className="flex justify-center mb-6">
                  <Quote className="w-12 h-12 text-[#962C52] opacity-20" />
                </div>

                {/* Content */}
                <blockquote className="text-lg text-gray-700 italic text-center mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                {/* Rating */}
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                {/* Author Info */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <h4 className="font-semibold text-[#1B1743] text-lg">
                      {testimonial.name}
                    </h4>
                    {testimonial.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        ✓ Verificado
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {testimonial.age} años • {testimonial.location}
                  </p>
                  <p className="text-[#962C52] font-medium">
                    {testimonial.service}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        {showControls && displayedTestimonials.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white border-2 border-gray-200 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white border-2 border-gray-200 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {displayedTestimonials.length > 1 && (
        <div className="hidden md:flex justify-center space-x-2 mt-8 px-4 md:px-0">
          {displayedTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-[#962C52]'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      {autoPlay && displayedTestimonials.length > 1 && (
        <div className="hidden md:flex justify-center mt-4">
          <button
            onClick={togglePlayPause}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? '⏸️ Pausar' : '▶️ Reproducir'}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 px-4 md:px-0">
        <div className="text-center">
          <div className="text-3xl font-bold text-[#962C52] mb-2">500+</div>
          <div className="text-gray-600">Clientes satisfechos</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#962C52] mb-2">15+</div>
          <div className="text-gray-600">Años de experiencia</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#962C52] mb-2">95%</div>
          <div className="text-gray-600">Casos exitosos</div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
