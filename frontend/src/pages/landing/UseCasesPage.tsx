import React from 'react';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import './UseCasesPage.css';

const HeroSection: React.FC = () => (
  <section className="uc-hero">
    <div className="container-xl">
      <div className="flex flex-col items-center text-center">
        <span className="brand-badge">USE CASES</span>
        <h1 className="uc-title">
          Soluciones para cada desafío <br />
          de automatización.
        </h1>
        <p className="uc-desc">
          Explora cómo Fluxa puede transformar la operativa de tu equipo mediante 
          conectividad inteligente y flujos de trabajo sin fricciones.
        </p>
        <button className="cta-button-primary mt-8">
          Descubre
        </button>
      </div>
    </div>
  </section>
);

const ValueSection: React.FC = () => (
  <section className="uc-value-section">
    <div className="container-xl">
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
      <div className="container-xl">
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
    <div className="container-xl">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="uc-featured-visual rounded-2xl bg-white/10 flex items-center justify-center min-h-[450px]">
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
      <main>
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
