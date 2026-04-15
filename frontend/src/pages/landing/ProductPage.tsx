import React from 'react';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import './ProductPage.css';

const HeroSection: React.FC = () => (
  <section className="product-hero">
    <div className="container-xl">
      <div className="flex flex-col items-center text-center">
        <span className="product-badge">PRODUCT</span>
        <h1 className="product-title">
          Automatización inteligente <br /> 
          para el mundo real.
        </h1>
        <p className="product-subtitle">
          Fluxa permite que tus sistemas hablen entre sí sin fricciones. <br />
          Una arquitectura robusta diseñada para desarrolladores.
        </p>
      </div>
    </div>
  </section>
);

const EventSection: React.FC = () => (
  <section className="event-section">
    <div className="container-xl">
      <div className="flex flex-col items-center text-center">
        <h2 className="event-title">Arquitectura basada en eventos</h2>
        <p className="event-description">
          Reacciona a lo que importa. Fluxa procesa eventos en tiempo real mediante webhooks 
          y tareas programadas, garantizando una respuesta inmediata y escalable.
        </p>
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
      <div className="container-xl">
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
    { title: 'Webhooks', desc: 'Entrada de datos HTTP instantánea.' },
    { title: 'Cron Jobs', desc: 'Tareas recurrentes programadas.' },
    { title: 'BullMQ', desc: 'Gestión de colas asíncronas.' },
    { title: 'Prisma ORM', desc: 'Persistencia de datos segura.' },
    { title: 'Redis', desc: 'Memoria caché de alta velocidad.' },
    { title: 'NextJS', desc: 'Interfaz de usuario reactiva.' }
  ];

  return (
    <section className="components-section">
      <div className="container-xl">
        <h2 className="section-label">Los componentes de Fluxa</h2>
        <div className="components-grid">
          {components.map((comp, index) => (
            <div key={index} className="comp-card">
              <h3 className="comp-title">{comp.title}</h3>
              <p className="comp-desc">{comp.desc}</p>
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
