import React from 'react';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import './FeaturesPage.css';

const HeroSection: React.FC = () => (
  <section className="features-hero">
    <div className="container-xl">
      <div className="flex flex-col items-center text-center">
        <span className="brand-badge">FEATURES</span>
        <h1 className="hero-title-main">
          Potencia tu flujo de trabajo <br />
          con herramientas avanzadas.
        </h1>
        <p className="hero-desc-main">
          Fluxa ofrece un conjunto de funcionalidades diseñadas para automatizar 
          cada aspecto de tu ecosistema tecnológico, desde webhooks hasta procesos programados.
        </p>
      </div>
    </div>
  </section>
);

const FunctionalBlocks: React.FC = () => {
  const features = [
    { title: 'Webhooks', desc: 'Recibe eventos en tiempo real.' },
    { title: 'Scheduling', desc: 'Tareas automáticas por tiempo.' },
    { title: 'API Integration', desc: 'Conecta con cualquier servicio.' },
    { title: 'Persistence', desc: 'Guarda cada resultado en DB.' }
  ];

  return (
    <section className="functional-blocks">
      <div className="container-xl">
        <div className="blocks-grid">
          {features.map((feat, index) => (
            <div key={index} className="block-item">
              <div className="block-icon">★</div>
              <h3 className="block-title">{feat.title}</h3>
              <p className="block-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MonitorSection: React.FC = () => (
  <section className="f-monitor-section">
    <div className="container-xl">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="f-monitor-text">
          <h2 className="section-title-f text-left">Monitorización <br /> de estados.</h2>
          <p className="section-desc-f">
            Controla el ciclo de vida de cada ejecución. Fluxa registra cada cambio de estado, 
            permitiendo detectar errores y optimizar el rendimiento de forma proactiva.
          </p>
          <div className="f-stat-item">
            <span className="stat-v">99.9%</span>
            <p className="stat-l">de fiabilidad en el procesamiento de eventos.</p>
          </div>
        </div>
        <div className="f-placeholder-visual rounded-2xl bg-gray-100 flex items-center justify-center min-h-[400px]">
          <span className="text-gray-400">Visualización de estados</span>
        </div>
      </div>
    </div>
  </section>
);

const BreakdownSection: React.FC = () => (
  <section className="f-breakdown-section">
    <div className="container-xl">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="f-placeholder-visual order-2 lg:order-1 rounded-2xl bg-[#6366F1]/5 flex items-center justify-center min-h-[400px]">
          <span className="text-[#6366F1]/40">Detalle de componentes</span>
        </div>
        <div className="f-breakdown-text order-1 lg:order-2">
          <h2 className="section-title-f text-left">Todo lo que <br /> necesitas en uno.</h2>
          <p className="section-desc-f">
            Nuestra plataforma integra las mejores tecnologías para garantizar que 
            tus workflows se ejecuten sin problemas.
          </p>
          <ul className="f-bullet-list">
            <li><span>✓</span> Colas de trabajo asíncronas con BullMQ</li>
            <li><span>✓</span> Almacenamiento rápido en Redis</li>
            <li><span>✓</span> Base de datos relacional PostgreSQL</li>
            <li><span>✓</span> Logs detallados por cada acción</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesPage: React.FC = () => {
  return (
    <div className="features-container">
      <Navbar />
      <main>
        <HeroSection />
        <FunctionalBlocks />
        <MonitorSection />
        <BreakdownSection />
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
