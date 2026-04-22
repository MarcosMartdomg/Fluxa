import React, { useState, useMemo } from 'react';
import { 
  X, Search, Zap, Globe, Play, Split, 
  Clock, Code, MessageSquare, Database, ArrowRight, ChevronLeft
} from 'lucide-react';
import { NodeType } from '../../types/workflow';
import { INTEGRATION_REGISTRY, Provider, ActionMetadata } from '../../types/integration';
import { GOOGLE_SPREADSHEET_RESOURCE } from '../../integrations/google/spreadsheet';

// Simplified internal actions for core logic
const CORE_ACTIONS = [
  { id: 'condition', type: 'condition' as NodeType, label: 'Condición Lógica', description: 'Divide el flujo (Sí/No)', category: 'Lógica', icon: <Split size={18} />, color: 'bg-amber-500' },
  { id: 'delay', type: 'delay' as NodeType, label: 'Pausa (Delay)', description: 'Espera un tiempo determinado', category: 'Control', icon: <Clock size={18} />, color: 'bg-zinc-400' },
  { id: 'js_code', type: 'action' as NodeType, label: 'Custom Code', description: 'Ejecuta JavaScript personalizado', category: 'Custom', icon: <Code size={18} />, color: 'bg-rose-500' },
];

interface ActionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: NodeType, label: string, metadata?: any) => void;
}

const ActionSelectorModal: React.FC<ActionSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const categories = ['Todas', 'Integraciones', 'Lógica', 'Control', 'Custom'];

  const providers = Object.values(INTEGRATION_REGISTRY);

  const handleActionSelect = (action: ActionMetadata) => {
    onSelect('action', action.label, { 
      provider: selectedProvider,
      actionKey: action.key 
    });
    onClose();
  };

  const renderIntegrations = () => (
    <div className="grid grid-cols-2 gap-4 p-6">
      {providers.map(p => (
        <button
          key={p.id}
          onClick={() => setSelectedProvider(p.id)}
          className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left group"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${p.color}`}>
            <Globe size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-[13px] font-bold text-gray-900 mb-0.5 group-hover:text-indigo-600 transition-colors">
              {p.label}
            </h4>
            <p className="text-[10px] text-gray-500 italic">
              {p.resources.length} recursos disponibles
            </p>
          </div>
          <ArrowRight size={14} className="text-gray-300 group-hover:text-indigo-400 transition-all" />
        </button>
      ))}
    </div>
  );

  const renderProviderActions = () => {
    if (!selectedProvider) return null;
    const provider = INTEGRATION_REGISTRY[selectedProvider];
    // For MVP, we only have Google Spreadsheet real data
    const actions = selectedProvider === 'google' ? GOOGLE_SPREADSHEET_RESOURCE.actions : [];

    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
          <button 
            onClick={() => setSelectedProvider(null)}
            className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-gray-600 shadow-sm transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <div className={`w-6 h-6 rounded-md ${provider.color} flex items-center justify-center text-white`}>
            <Globe size={12} />
          </div>
          <span className="text-xs font-bold text-gray-900">{provider.label}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 gap-3">
          {actions.length > 0 ? actions.map(action => (
            <button
              key={action.key}
              onClick={() => handleActionSelect(action)}
              className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                <Play size={18} />
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
          )) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
              <Database size={40} className="text-gray-200 mb-4" />
              <p className="text-xs text-gray-400 font-medium">Próximamente: Acciones para {provider.label}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {selectedProvider ? 'Configurar Acción' : 'Añadir nuevo paso'}
            </h2>
            <p className="text-sm text-gray-500">
              {selectedProvider ? 'Selecciona una operación específica' : 'Selecciona la acción que deseas integrar en tu flujo'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        {/* Search Bar - Only show in root or adapt */}
        {!selectedProvider && (
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
        )}

        {/* Content */}
        <div className="flex-1 flex min-h-0">
          {!selectedProvider && (
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
          )}

          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
            {selectedProvider ? (
              renderProviderActions()
            ) : (
              activeCategory === 'Integraciones' || activeCategory === 'Todas' ? renderIntegrations() : (
                <div className="p-6 grid grid-cols-1 gap-4">
                   {CORE_ACTIONS.filter(a => activeCategory === 'Todas' || a.category === activeCategory).map(action => (
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
                   ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center">
           <p className="text-[11px] text-gray-400 font-medium">¿No encuentras lo que buscas? Sugiere una integración.</p>
           <div className="flex gap-2 text-indigo-300">
              <Zap size={14} className="animate-pulse" />
              <Zap size={14} className="animate-pulse delay-75" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default ActionSelectorModal;
