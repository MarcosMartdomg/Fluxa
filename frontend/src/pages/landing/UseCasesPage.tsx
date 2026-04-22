import React from 'react';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import './UseCasesPage.css';

const HeroSection: React.FC = () => (
  <section className="uc-hero">
    <div className="f-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 items-center">
        <div className="flex flex-col items-start text-left">
          <span className="brand-badge">USE CASES</span>
          <h1 className="uc-title">
            Soluciones para cada desafío <br />
            de automatización.
          </h1>
          <p className="uc-desc">
            Explora cómo Fluxa puede transformar la operativa de tu equipo mediante 
            conectividad inteligente y flujos de trabajo sin fricciones.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="w-full h-auto min-h-[350px] bg-zinc-50 border border-dashed border-zinc-300 rounded-xl flex items-center justify-center">
            <span className="text-zinc-400 font-medium text-sm">Visual de Casos de Uso</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ValueSection: React.FC = () => (
  <section className="uc-value-section">
    <div className="f-container">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="uc-value-text">
          Diseñado para <span className="text-highlight">automatizaciones</span> basadas en <span className="text-highlight">eventos</span>, 
          permitiendo <span className="text-highlight">conectar sistemas</span> complejos y <span className="text-highlight">simplificar procesos</span> críticos.
        </h2>
      </div>
    </div>
  </section>
);

const UseCaseGrid: React.FC = () => {
  const cases = [
    { title: 'Integración de sistemas', desc: 'Conecta APIs dispares y servicios en una sola plataforma unificada.' },
    { title: 'Procesamiento de eventos', desc: 'Gestiona flujos de datos masivos en tiempo real con total trazabilidad.' },
    { title: 'Automatizaciones programadas', desc: 'Ejecuta tareas recurrentes sin necesidad de intervención manual constante.' },
    { title: 'Sincronización de datos', desc: 'Mantén la coherencia de tu información entre múltiples bases de datos y servicios.' }
  ];

  return (
    <section className="uc-grid-section">
      <div className="f-container">
        <div className="uc-grid">
          {cases.map((uc, index) => (
            <div key={index} className="uc-card">
              <h3 className="uc-card-title">{uc.title}</h3>
              <p className="uc-card-desc">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedBottomSection: React.FC = () => (
  <section className="uc-featured-bottom">
    <div className="f-container">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="uc-featured-visual">
          <span className="text-white/40">Visualización de impacto</span>
        </div>
        <div className="uc-featured-text text-white">
          <h2 className="uc-featured-title">Potencia sin límites.</h2>
          <p className="uc-featured-desc">
            Fluxa se adapta a las necesidades de tu arquitectura, ofreciendo una 
            plataforma robusta que crece con tu negocio y simplifica la gestión 
            de eventos a gran escala.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const UseCasesPage: React.FC = () => {
  return (
    <div className="uc-container">
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <ValueSection />
        <UseCaseGrid />
        <FeaturedBottomSection />
      </main>
      <Footer />
    </div>
  );
};

export default UseCasesPage;
