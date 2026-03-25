import React from 'react';

const cards = [
  {
    title: "Arquitectura Modular NestJS",
    description: "Construido bajo un diseño modular que separa responsabilidades por dominios, facilitando el mantenimiento y la escalabilidad del sistema",
    icon: (
      <svg className="w-8 h-8 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    points: [
      "Estructura escalable por módulos (Auth, Workflows, Logs).",
      "Integración robusta con PostgreSQL mediante Prisma ORM."
    ]
  },
  {
    title: "Motor de Tareas Asíncronas",
    description: "Gestión eficiente de procesos pesados en segundo plano para garantizar que la interfaz de usuario nunca se bloquee",
    icon: (
      <svg className="w-8 h-8 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    points: [
      "Procesamiento basado en colas con Redis y BullMQ.",
      "Gestión Inteligente de estados: de Pending a Success o Failed."
    ]
  },
  {
    title: "Ecosistema para Desarrolladores",
    description: "Diseñado para ser integrado y auditado fácilmente, con herramientas que facilitan la conexión con servicios externos",
    icon: (
      <svg className="w-8 h-8 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    points: [
      "Documentación técnica profesional generada con Swagger.",
      "Contenerización completa mediante Docker y Docker Compose."
    ]
  }
];

const Architecture: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:justify-between lg:items-end mb-16 gap-12">
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight lg:w-1/2">
            Arquitectura diseñada para <br />
            automatización a gran escala
          </h2>
          <p className="text-gray-500 lg:w-1/2 mt-6 lg:mt-0 leading-relaxed">
            Fluxa está construido sobre una arquitectura modular orientada a eventos que permite procesar workflows de forma eficiente y escalable. Cada componente del sistema está diseñado para integrarse fácilmente con servicios externos y soportar cargas de trabajo complejas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-6">
              <div className="w-16 h-16 rounded-xl bg-brand-50 flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {card.description}
              </p>
              <ul className="space-y-4">
                {card.points.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-gray-600 leading-snug">
                    <span className="text-brand-500 font-bold block mt-1">▶</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Architecture;
