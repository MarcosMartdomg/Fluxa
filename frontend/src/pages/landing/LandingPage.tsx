import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import './LandingPage.css';

// --- Internal Components for Landing Sections ---

const Hero: React.FC = () => (
  <section className="pt-32 pb-20 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
        <div className="mb-12 lg:mb-0">
          <span className="brand-badge">
            PLATAFORMA DE AUTOMATIZACIÓN INTELIGENTE
          </span>
          <h1 className="hero-title">
            Automatiza procesos <br />
            y conecta sistemas <br />
            sin esfuerzo
          </h1>
          <p className="hero-description">
            Fluxa es una plataforma que permite crear automatizaciones, conectar APIs y ejecutar flujos de trabajo automáticamente. Diseñada para desarrolladores que quieren optimizar procesos, reducir tareas repetitivas y escalar sus sistemas mediante automatización inteligente.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="cta-button-secondary">
              Contacta con nosotros
            </button>
            <button className="cta-button-primary">
              Empieza ahora con Fluxa
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            <img 
              src="/images/hero-mockup.png" 
              alt="Fluxa Dashboard Mockup" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

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

const Features: React.FC = () => (
  <section className="py-20 bg-gray-50/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-16">
        <h2 className="section-heading-sm">
          Conecta y <span className="text-brand-600">Automatiza</span> tu Ecosistema
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="mb-2">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const MonitorSection: React.FC = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="brand-badge">
          MONITORIZACIÓN Y ESTADOS EN TIEMPO REAL
        </span>
        <h2 className="section-heading-lg mb-6">
          Monitoriza cada <br />
          ejecución al detalle.
        </h2>
        <p className="text-lg text-gray-500 mb-12 leading-relaxed max-w-2xl">
          Supervisa el estado de tus flujos en tiempo real con un historial completo de logs y métricas de rendimiento.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-brand-500">100%</span>
              <span className="text-lg font-bold text-gray-900">Trazabilidad.</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Cada evento es registrado y auditado para un control total.
            </p>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-brand-500">0ms</span>
              <span className="text-lg font-bold text-gray-900">de Bloqueo.</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Procesamiento asíncrono mediante BullMQ para una respuesta inmediata del sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

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

const Architecture: React.FC = () => (
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

// --- Main Page Component ---

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <MonitorSection />
        <Architecture />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
