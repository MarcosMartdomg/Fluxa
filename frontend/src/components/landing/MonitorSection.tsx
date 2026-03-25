import React from 'react';

const MonitorSection: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-brand-600 font-bold text-xs tracking-widest uppercase mb-4 block">
            MONITORIZACIÓN Y ESTADOS EN TIEMPO REAL
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
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
};

export default MonitorSection;
