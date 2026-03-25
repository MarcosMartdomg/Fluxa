import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="mb-12 lg:mb-0">
            <span className="text-brand-600 font-bold text-xs tracking-widest uppercase mb-4 block">
              PLATAFORMA DE AUTOMATIZACIÓN INTELIGENTE
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Automatiza procesos <br />
              y conecta sistemas <br />
              sin esfuerzo
            </h1>
            <p className="text-lg text-gray-500 max-w-lg mb-10 leading-relaxed">
              Fluxa es una plataforma que permite crear automatizaciones, conectar APIs y ejecutar flujos de trabajo automáticamente. Diseñada para desarrolladores que quieren optimizar procesos, reducir tareas repetitivas y escalar sus sistemas mediante automatización inteligente.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 rounded-md border-2 border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-colors">
                Contacta con nosotros
              </button>
              <button className="px-8 py-3 rounded-md bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors">
                Empieza ahora con Fluxa
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <img 
                src="/src/assets/landing/hero-mockup.png" 
                alt="Fluxa Dashboard Mockup" 
                className="w-full h-auto"
              />
              {/* Optional overlay to show it's a placeholder if image doesn't exist yet */}
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 font-medium">
                Reserva de imagen: Dashboard Mockup
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
