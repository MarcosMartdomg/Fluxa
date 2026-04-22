import React, { useState, useMemo } from 'react';
import { 
  X, Search, Zap, Globe, Play, Split, 
  Clock, Code, MessageSquare, Database 
} from 'lucide-react';
import { NodeType } from '../../types/workflow';

interface ActionOption {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
}

const ACTIONS: ActionOption[] = [
  { id: 'webhook', type: 'trigger', label: 'Webhook Trigger', description: 'Inicia el flujo con una petición HTTP', category: 'Inicio', icon: <Zap size={18} />, color: 'bg-indigo-500' },
  { id: 'http_request', type: 'action', label: 'HTTP Request', description: 'Llamada API a cualquier servicio', category: 'Integraciones', icon: <Globe size={18} />, color: 'bg-gray-800' },
  { id: 'slack', type: 'action', label: 'Slack Notification', description: 'Envía un mensaje a un canal', category: 'Integraciones', icon: <MessageSquare size={18} />, color: 'bg-emerald-500' },
  { id: 'condition', type: 'condition', label: 'Condición Lógica', description: 'Divide el flujo (Sí/No)', category: 'Lógica', icon: <Split size={18} />, color: 'bg-amber-500' },
  { id: 'delay', type: 'delay', label: 'Pausa (Delay)', description: 'Espera un tiempo determinado', category: 'Control', icon: <Clock size={18} />, color: 'bg-zinc-400' },
  { id: 'js_code', type: 'action', label: 'Custom Code', description: 'Ejecuta JavaScript personalizado', category: 'Custom', icon: <Code size={18} />, color: 'bg-rose-500' },
  { id: 'db_query', type: 'action', label: 'Database Query', description: 'Consulta tu base de datos', category: 'Integraciones', icon: <Database size={18} />, color: 'bg-blue-600' },
];

interface ActionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: NodeType, label: string) => void;
}

const ActionSelectorModal: React.FC<ActionSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

  const categories = ['Todas', 'Inicio', 'Integraciones', 'Lógica', 'Control', 'Custom'];

  const filteredActions = useMemo(() => {
    return ACTIONS.filter(action => {
      const matchesSearch = action.label.toLowerCase().includes(search.toLowerCase()) || 
                           action.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'Todas' || action.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Añadir nuevo paso</h2>
            <p className="text-sm text-gray-500">Selecciona la acción que deseas integrar en tu flujo</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-8 py-4 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Busca una app o acción (ej: Slack, Webhook...)"
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex min-h-0">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-100 p-4 space-y-1 overflow-y-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredActions.length > 0 ? (
              filteredActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => onSelect(action.type, action.label)}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${action.color}`}>
                    {action.icon}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-gray-900 mb-0.5 group-hover:text-indigo-600 transition-colors">
                      {action.label}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-tight">
                      {action.description}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-2 py-12 flex flex-col items-center text-center">
                <Search size={40} className="text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium italic">No encontramos nada que coincida con tu búsqueda</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center">
           <p className="text-[11px] text-gray-400 font-medium">¿No encuentras lo que buscas? Sugiere una integración.</p>
           <div className="flex gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ActionSelectorModal;
