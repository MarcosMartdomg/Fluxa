import React, { useState } from 'react';
import { 
  Zap, Database, ChevronRight, Search, 
  Layers, Package, Mail, User, Tag 
} from 'lucide-react';

interface VariablePickerProps {
  onSelect: (path: string) => void;
  onClose: () => void;
}

const VariablePicker: React.FC<VariablePickerProps> = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState('');

  // Mock available variables from context
  // In a real app, this would be computed from the workflow state
  const AVAILABLE_DATA = [
    {
      source: 'Trigger (Webhook)',
      icon: <Zap size={14} className="text-indigo-500" />,
      variables: [
        { path: 'trigger.body.email', label: 'Email del Cliente', example: 'marcos@example.com', icon: <Mail size={12} /> },
        { path: 'trigger.body.name', label: 'Nombre Completo', example: 'Marcos Mart', icon: <User size={12} /> },
        { path: 'trigger.body.order_id', label: 'ID de Pedido', example: 'ORD-123', icon: <Tag size={12} /> },
        { path: 'trigger.headers.host', label: 'Host de Origen', example: 'api.fluxa.io', icon: <Database size={12} /> },
      ]
    },
    {
      source: 'Paso 1: Google Sheets',
      icon: <Database size={14} className="text-emerald-500" />,
      variables: [
        { path: 'node_1.output.rowCount', label: 'Total de Filas', example: 124, icon: <Layers size={12} /> },
        { path: 'node_1.output.updatedRange', label: 'Rango Actualizado', example: 'Sheet1!A1:Z10', icon: <Package size={12} /> },
      ]
    }
  ];

  return (
    <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[110] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2">
      {/* Search Header */}
      <div className="p-3 border-b border-gray-100 bg-gray-50/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input 
            type="text" 
            placeholder="Busca un dato..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Variables List */}
      <div className="max-h-64 overflow-y-auto p-2">
        {AVAILABLE_DATA.map((group, gIdx) => (
          <div key={gIdx} className="mb-4 last:mb-0">
            <h4 className="flex items-center gap-2 px-2 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              {group.icon}
              {group.source}
            </h4>
            <div className="space-y-0.5">
              {group.variables.map((v, vIdx) => (
                <button
                  key={vIdx}
                  onClick={() => onSelect(v.path)}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50 group transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                      {v.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-700 group-hover:text-indigo-900 transition-colors">
                        {v.label}
                      </p>
                      <p className="text-[9px] text-gray-400 font-mono">
                        Ej: {v.example}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={12} className="text-gray-200 group-hover:text-indigo-300" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Fluxa Data Bridge</span>
         <button onClick={onClose} className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">Cerrar</button>
      </div>
    </div>
  );
};

export default VariablePicker;
