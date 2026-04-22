import React, { useState } from 'react';
import { 
  Zap, Play, Split, Clock, Plus, Info, 
  Database, Settings, List, LayoutGrid,
  CheckCircle2, AlertCircle, Search
} from 'lucide-react';
import { NodeType } from '../../types/workflow';

// --- Sub-components ---

interface SidebarItemProps {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  onAdd: (type: NodeType) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label, description, icon, colorClass, onAdd }) => (
  <button 
    onClick={() => onAdd(type)}
    className="w-full text-left group relative p-3 mb-2 bg-white border border-gray-100 rounded-xl transition-all duration-200 hover:border-indigo-200 hover:shadow-[0_4px_12px_rgba(99,102,241,0.08)] hover:-translate-y-0.5"
  >
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0 pr-6">
        <h3 className="text-[13px] font-bold text-gray-900 mb-0.5 group-hover:text-indigo-600 transition-colors">
          {label}
        </h3>
        <p className="text-[11px] text-gray-500 leading-snug line-clamp-2 italic">
          {description}
        </p>
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
          <Plus size={10} strokeWidth={3} />
        </div>
      </div>
    </div>
  </button>
);

// --- Main Sidebar Component ---

interface WorkflowSidebarProps {
  onAddNode: (type: NodeType) => void;
}

type TabType = 'blocks' | 'data' | 'config' | 'logs';

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ onAddNode }) => {
  const [activeTab, setActiveTab] = useState<TabType>('blocks');

  const renderBlocks = () => (
    <div className="flex-1 overflow-y-auto px-6 pt-6 pb-12">
      <div className="mb-8 px-1">
        <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1">Librería de Bloques</h2>
        <p className="text-[11px] text-gray-400 font-medium italic">Componentes disponibles para tu flujo</p>
      </div>

      {/* DISPARADORES */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 px-1">
          <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Disparadores</p>
        </div>
        <SidebarItem 
          type="trigger"
          label="Webhook Trigger"
          description="Escucha peticiones HTTP externas."
          icon={<Zap size={14} />}
          colorClass="bg-indigo-500"
          onAdd={onAddNode}
        />
      </div>

      {/* ACCIONES */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 px-1">
          <span className="w-1 h-1 rounded-full bg-gray-800"></span>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Acciones</p>
        </div>
        <div className="space-y-1">
          <SidebarItem 
            type="action"
            label="API Action"
            description="Llamadas a servicios externos."
            icon={<Play size={14} />}
            colorClass="bg-gray-800"
            onAdd={onAddNode}
          />
          <SidebarItem 
            type="delay"
            label="Wait / Delay"
            description="Pausa el flujo de ejecución."
            icon={<Clock size={14} />}
            colorClass="bg-zinc-400"
            onAdd={onAddNode}
          />
        </div>
      </div>

      {/* LÓGICA */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 px-1">
          <span className="w-1 h-1 rounded-full bg-amber-500"></span>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Lógica</p>
        </div>
        <SidebarItem 
          type="condition"
          label="Router / Condición"
          description="Bifurca el camino (Sí/No)."
          icon={<Split size={14} />}
          colorClass="bg-amber-500"
          onAdd={onAddNode}
        />
      </div>
    </div>
  );

  const DataRow = ({ label, path, value }: { label: string, path: string, value: string }) => (
    <button 
      onClick={() => {
        const event = new CustomEvent('fluxa:insert-variable', { detail: { path } });
        window.dispatchEvent(event);
      }}
      className="w-full flex justify-between items-center py-1.5 px-2 hover:bg-indigo-50 rounded-md group transition-colors text-left"
      title={`Haz clic para insertar {{${path}}}`}
    >
      <span className="text-gray-900 font-bold group-hover:text-indigo-600 transition-colors">{label}</span>
      <span className="text-gray-400 group-hover:text-indigo-400 italic flex items-center gap-2">
        {value}
        <Plus size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </span>
    </button>
  );

  const renderData = () => (
    <div className="flex-1 overflow-y-auto px-6 pt-6">
      <div className="mb-8 px-1">
        <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1">Inspector de Datos</h2>
        <p className="text-[11px] text-gray-400 font-medium italic">Haz clic en un dato para insertarlo</p>
      </div>

      <div className="space-y-8 pb-12">
        {/* Trigger Data */}
        <div>
          <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Zap size={12} />
            Webhook Trigger
          </h4>
          <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 font-mono text-[10px] space-y-1">
             <DataRow label="event_type" path="trigger.event_type" value="checkout.completed" />
             <DataRow label="customer_email" path="trigger.customer_email" value="marcos@fluxa.io" />
             <DataRow label="amount" path="trigger.amount" value="29.99" />
             <DataRow label="currency" path="trigger.currency" value="EUR" />
          </div>
        </div>

        {/* Node Outputs */}
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <LayoutGrid size={12} />
            Node Outputs
          </h4>
          <div className="space-y-3">
             <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase mb-2 px-2">API Response 1</p>
                <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 font-mono text-[10px] space-y-1">
                   <DataRow label="status" path="node_1.status" value="200" />
                   <DataRow label="body.id" path="node_1.body.id" value="user_882" />
                </div>
             </div>
             <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase mb-2 px-2">Condition Result</p>
                <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 font-mono text-[10px] space-y-1">
                   <DataRow label="matched" path="node_2.matched" value="true" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfig = () => (
    <div className="flex-1 overflow-y-auto px-6 pt-6">
       <div className="mb-8 px-1">
        <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1">Ajustes</h2>
        <p className="text-[11px] text-gray-400 font-medium italic">Configuración del workflow</p>
      </div>

       <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Nombre</label>
            <input type="text" defaultValue="Flujo Principal" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Estado</label>
            <div className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
               <span className="text-xs font-bold text-indigo-900">Workflow Activo</span>
               <div className="w-8 h-4 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
               </div>
            </div>
          </div>
       </div>
    </div>
  );

  const renderLogs = () => (
    <div className="flex-1 overflow-y-auto px-6 pt-6">
       <div className="mb-8 px-1">
        <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-1">Ejecuciones</h2>
        <p className="text-[11px] text-gray-400 font-medium italic">Historial de procesamiento</p>
      </div>

       <div className="space-y-2">
          {[
            { id: '#012', status: 'ok', time: '12m ago' },
            { id: '#011', status: 'err', time: '1h ago' },
            { id: '#010', status: 'ok', time: '2h ago' },
          ].map((log) => (
            <div key={log.id} className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-50">
               <div className="flex items-center gap-3">
                  {log.status === 'ok' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertCircle size={12} className="text-rose-500" />}
                  <span className="text-[11px] font-bold text-gray-900">{log.id}</span>
               </div>
               <span className="text-[10px] text-gray-400">{log.time}</span>
            </div>
          ))}
       </div>
    </div>
  );

  return (
    <aside className="flex h-full bg-white border-r border-gray-200 shadow-[4px_0_10px_rgba(0,0,0,0.02)]">
      {/* Icon Bar (Left) */}
      <div className="w-[52px] bg-gray-50/50 border-r border-gray-100 flex flex-col items-center py-5 gap-4 shrink-0">
        {[
          { id: 'blocks', icon: <LayoutGrid size={18} />, label: 'Bloques' },
          { id: 'data', icon: <Database size={18} />, label: 'Datos' },
          { id: 'config', icon: <Settings size={18} />, label: 'Config' },
          { id: 'logs', icon: <List size={18} />, label: 'Logs' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            title={tab.label}
            className={`group relative p-2 rounded-lg transition-all ${
              activeTab === tab.id 
              ? 'bg-indigo-600 text-white shadow-[0_4px_10px_rgba(79,70,229,0.25)]' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-white'
            }`}
          >
            {tab.icon}
          </button>
        ))}
        
        <div className="mt-auto pt-4 border-t border-gray-200/50 w-full flex justify-center">
           <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-[9px] cursor-pointer hover:ring-2 hover:ring-indigo-200 transition-all">
              MM
           </div>
        </div>
      </div>

      {/* Content Panel (Right) */}
      <div className="w-[300px] flex flex-col min-h-0 bg-white">
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'blocks' && renderBlocks()}
          {activeTab === 'data' && renderData()}
          {activeTab === 'config' && renderConfig()}
          {activeTab === 'logs' && renderLogs()}
        </div>

        {activeTab === 'blocks' && (
          <div className="p-6 border-t border-gray-50 bg-gray-50/30">
            <div className="p-4 bg-white border border-gray-100 rounded-2xl flex gap-3 items-start shadow-sm">
              <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-500 leading-relaxed italic">
                <span className="font-bold text-indigo-600 not-italic">Tip:</span> Selecciona un componente para integrarlo en tu flujo de trabajo.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default WorkflowSidebar;
