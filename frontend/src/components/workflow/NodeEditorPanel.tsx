import React from 'react';
import { X, Settings, Type, AlignLeft, Info } from 'lucide-react';
import { FluxaNode, WorkflowNodeData } from '../../types/workflow';

interface NodeEditorPanelProps {
  node: FluxaNode | null;
  onUpdate: (id: string, data: Partial<WorkflowNodeData>) => void;
  onClose: () => void;
}

const NodeEditorPanel: React.FC<NodeEditorPanelProps> = ({ node, onUpdate, onClose }) => {
  if (!node) return null;

  const handleChange = (field: keyof WorkflowNodeData, value: string) => {
    onUpdate(node.id, { [field]: value });
  };

  return (
    <aside className="w-80 h-full bg-white border-l border-gray-200 flex flex-col shadow-xl z-20">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">Configuración</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-400"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider
              ${node.type === 'trigger' ? 'bg-indigo-100 text-indigo-600' : 
                node.type === 'condition' ? 'bg-amber-100 text-amber-600' : 
                'bg-gray-100 text-gray-600'}`}
            >
              {node.type}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">{node.id}</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              <Type size={12} /> Título
            </label>
            <input 
              type="text" 
              value={node.data.label}
              onChange={(e) => handleChange('label', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Ej: Enviar Email"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              <AlignLeft size={12} /> Subtítulo / Descripción
            </label>
            <textarea 
              value={node.data.sublabel || ''}
              onChange={(e) => handleChange('sublabel', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              placeholder="Describe qué hace este bloque..."
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
             <div className="p-3 bg-indigo-50 rounded-lg flex gap-3">
                <Info size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-700 leading-relaxed">
                  Los cambios se aplican instantáneamente al lienzo. Fase 4 activa.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
        <p className="text-[10px] text-gray-400 text-center font-medium">
          Fluxa Visual Editor v1.0
        </p>
      </div>
    </aside>
  );
};

export default NodeEditorPanel;
