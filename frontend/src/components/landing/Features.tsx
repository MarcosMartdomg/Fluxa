import React from 'react';

const features = [
  {
    title: "Punto de entrada: Webhooks",
    description: "Configura una URL única para recibir eventos en tiempo real desde cualquier servicio externo mediante peticiones HTTP.",
    icon: (
      <svg className="w-10 h-10 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 11l5-5-5-5M17 13l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 11h11M10 13h12" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Automatización Programada",
    description: "Define ejecuciones automáticas basadas en intervalos de tiempo (diarios, horarios) para realizar tareas recurrentes sin intervención manual.",
    icon: (
      <svg className="w-10 h-10 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Integración con APIs Externas",
    description: "Realiza llamadas automáticas a servicios de terceros para enviar información procesada o sincronizar datos entre plataformas.",
    icon: (
      <svg className="w-10 h-10 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.5 19L22 14.5L17.5 10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 5L2 9.5L6.5 14" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 19L14.5 5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Persistencia en Base de Datos",
    description: "Almacena el resultado de tus flujos de trabajo directamente en la base de datos de Fluxa de forma estructurada para su posterior análisis.",
    icon: (
      <svg className="w-10 h-10 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 21c-4.418 0-8-1.567-8-3.5S7.582 14 12 14s8 1.567 8 3.5-3.582 3.5-8 3.5z" />
        <path d="M4 17.5V14c0-1.933 3.582-3.5 8-3.5s8 1.567 8 3.5v3.5" />
        <path d="M4 10.5V7c0-1.933 3.582-3.5 8-3.5s8 1.567 8 3.5v3.5" />
      </svg>
    ),
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900">
            Conecta y <span className="text-brand-600">Automatiza</span> tu Ecosistema
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="mb-2">{feature.icon}</div>
              <h3 className="text-lg font-bold text-brand-500">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
