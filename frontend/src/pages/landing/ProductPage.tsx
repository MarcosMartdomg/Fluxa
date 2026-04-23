import React from 'react';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import './ProductPage.css';

const HeroSection: React.FC = () => {
  return (
    <section className="product-hero">
      <div className="f-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="brand-badge">PRODUCT</span>
            <h1 className="hero-title">
              La pieza central de tu <br />
              stack tecnológico
            </h1>
            <p className="hero-description">
              Fluxa permite que tus sistemas hablen entre sí sin fricciones.
              Una arquitectura robusta diseñada para desarrolladores que buscan
              escalabilidad y eficiencia.
            </p>
          </div>

          {/* Right Column: Visual Placeholder */}
          <div className="hidden lg:block">
            <div className="hero-visual-placeholder">
              <span className="text-zinc-400 font-medium text-sm">Espacio para visual</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const EventSection: React.FC = () => (
  <section className="event-section">
    <div className="f-container">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="order-1">
          <span className="monitor-badge">
            ARQUITECTURA BASADA EN EVENTOS
          </span>
          <h2 className="section-heading-lg">
            Reacciona a lo que <br />
            importa en tiempo real.
          </h2>
          <p className="event-description">
            Fluxa procesa eventos mediante webhooks y tareas programadas,
            garantizando una respuesta inmediata y escalable para tus flujos de trabajo.
          </p>

          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-[35px] font-medium text-white mb-1">0ms</span>
              <span className="text-[18px] font-medium text-white opacity-80">Latencia.</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[35px] font-medium text-white mb-1">100%</span>
              <span className="text-[18px] font-medium text-white opacity-80">Seguro.</span>
            </div>
          </div>
        </div>

        <div className="order-2 flex justify-end">
          <div className="event-placeholder-visual">
            <span className="text-white/40 font-medium">Visualización de Arquitectura</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ProcessFlow: React.FC = () => {
  const steps = [
    { name: 'Trigger', desc: 'El origen del evento', color: '#6366F1' },
    { name: 'Workflow', desc: 'Lógica del flujo', color: '#818CF8' },
    { name: 'Actions', desc: 'Tareas a ejecutar', color: '#A5B4FC' },
    { name: 'Execution', desc: 'Procesado en tiempo real', color: '#C7D2FE' },
    { name: 'Logs', desc: 'Trazabilidad total', color: '#E0E7FF' }
  ];

  return (
    <section className="process-section">
      <div className="f-container">
        <div className="process-grid">
          {steps.map((step, index) => (
            <div key={index} className="process-card">
              <div className="process-num" style={{ backgroundColor: step.color }}>{index + 1}</div>
              <h3 className="process-name">{step.name}</h3>
              <p className="process-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ComponentsGrid: React.FC = () => {
  const components = [
    { 
      title: 'Webhooks', 
      desc: 'Entrada de datos HTTP instantánea.',
      features: ['Endpoint único', 'Eventos real-time', 'Seguridad JWT']
    },
    { 
      title: 'Cron Jobs', 
      desc: 'Tareas recurrentes programadas.',
      features: ['Sintaxis Cron', 'Múltiples zonas horarias', 'Auto-reintento']
    },
    { 
      title: 'BullMQ', 
      desc: 'Gestión de colas asíncronas.',
      features: ['Priorización', 'Manejo de fallos', 'Concurrency control']
    },
    { 
      title: 'Prisma ORM', 
      desc: 'Persistencia de datos segura.',
      features: ['Type-safe queries', 'Migrations automáticas', 'PostgreSQL']
    },
    { 
      title: 'Redis', 
      desc: 'Memoria caché de alta velocidad.',
      features: ['Broker de mensajes', 'Pub/Sub', 'Baja latencia']
    },
    { 
      title: 'NextJS', 
      desc: 'Interfaz de usuario reactiva.',
      features: ['Dashboard moderno', 'Server components', 'App Router']
    },
    { 
      title: 'NestJS', 
      desc: 'Core modular y escalable.',
      features: ['Inyección de dep.', 'Decoradores TS', 'Arquitectura limpia']
    },
    { 
      title: 'Docker', 
      desc: 'Despliegue e infraestructura.',
      features: ['Contenedores aislados', 'Orquestación fácil', 'Entorno consistente']
    }
  ];

  return (
    <section className="components-section">
      <div className="f-container">
        <h2 className="section-label">Los componentes de Fluxa</h2>
        <div className="components-grid">
          {components.map((comp, index) => (
            <div key={index} className="comp-card">
              <h3 className="comp-title">{comp.title}</h3>
              <p className="comp-desc">{comp.desc}</p>
              <ul className="comp-features">
                {comp.features.map((feat, idx) => (
                  <li key={idx} className="comp-feature-item">
                    {feat}
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

const ProductPage: React.FC = () => {
  return (
    <div className="product-container">
      <Navbar />
      <main>
        <HeroSection />
        <EventSection />
        <ProcessFlow />
        <ComponentsGrid />
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
