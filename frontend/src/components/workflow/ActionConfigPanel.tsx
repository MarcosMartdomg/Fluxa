import React, { useState } from 'react';
import { 
  Settings2, Link2, Database, Play, 
  AlertCircle, CheckCircle2, ChevronRight, Sparkles, Terminal, Code
} from 'lucide-react';
import { Provider, ActionMetadata, ActionField } from '../../types/integration';
import { GOOGLE_SPREADSHEET_RESOURCE } from '../../integrations/google/spreadsheet';
import { GOOGLE_DOCUMENT_RESOURCE } from '../../integrations/google/document';
import { MICROSOFT_EXCEL_RESOURCE } from '../../integrations/microsoft/excel';
import { MICROSOFT_OUTLOOK_RESOURCE } from '../../integrations/microsoft/outlook';
import { SLACK_RESOURCE } from '../../integrations/chat/slack';
import { DISCORD_RESOURCE } from '../../integrations/chat/discord';
import { SHOPIFY_RESOURCE } from '../../integrations/ecommerce/shopify';
import VariablePicker from './VariablePicker';
import { useConnections } from '../../context/ConnectionContext';

interface ActionConfigPanelProps {
  provider: Provider;
  actionKey: string;
  config: Record<string, any>;
  onUpdate: (config: Record<string, any>) => void;
}

const ActionConfigPanel: React.FC<ActionConfigPanelProps> = ({ 
  provider, 
  actionKey, 
  config, 
  onUpdate 
}) => {
  const { connections, connect, disconnect } = useConnections();
  const [isConnecting, setIsConnecting] = useState(false);
  const [pickingField, setPickingField] = useState<string | null>(null);

  const activeConnection = connections[provider];

  // Find action in any available resource
  const allActions = [
    ...GOOGLE_SPREADSHEET_RESOURCE.actions, 
    ...GOOGLE_DOCUMENT_RESOURCE.actions,
    ...MICROSOFT_EXCEL_RESOURCE.actions,
    ...MICROSOFT_OUTLOOK_RESOURCE.actions,
    ...SLACK_RESOURCE.actions,
    ...DISCORD_RESOURCE.actions,
    ...SHOPIFY_RESOURCE.actions
  ];
  
  // Special case for core actions
  const isCodeNode = actionKey === 'js_code';
  const isCore = isCodeNode || actionKey === 'condition' || actionKey === 'delay';
  
  const action = isCore ? { 
    key: actionKey, 
    label: isCodeNode ? 'Custom Code' : 'Core Action', 
    inputSchema: { fields: [] } 
  } : allActions.find(a => a.key === actionKey);

  if (!action) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="mx-auto text-amber-500 mb-4" size={32} />
        <p className="text-sm text-gray-500 italic">Acción no encontrada o pendiente de implementación.</p>
      </div>
    );
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    onUpdate({ ...config, [fieldId]: value });
  };

  const handleVariableSelect = (fieldId: string, path: string) => {
    const currentValue = config[fieldId] || '';
    const newValue = `${currentValue}{{${path}}}`;
    handleFieldChange(fieldId, newValue);
    setPickingField(null);
  };

  const renderField = (field: ActionField) => {
    const value = config[field.id] || '';

    return (
      <div key={field.id} className="mb-6 last:mb-0 relative">
        <label className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
          {field.label}
          {field.required && <span className="text-rose-500">*</span>}
        </label>

        <div className="relative group">
          {field.type === 'file_picker' ? (
            <div className="group relative">
              <input 
                type="text"
                readOnly
                value={value}
                placeholder="Haz clic para seleccionar un archivo..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm cursor-pointer hover:border-indigo-400 transition-all focus:outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg shadow-sm text-gray-400 group-hover:text-indigo-600 transition-colors">
                <Database size={16} />
              </div>
            </div>
          ) : field.type === 'mapping' ? (
            <div className="space-y-3">
               <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <Link2 size={20} className="text-gray-300" />
                  <p className="text-[10px] text-gray-400 font-medium">Configura el mapeo de columnas</p>
                  <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm">
                    Abrir Editor
                  </button>
               </div>
            </div>
          ) : (
            <div className="relative">
              <input 
                type="text"
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
              <button 
                onClick={() => setPickingField(pickingField === field.id ? null : field.id)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg shadow-sm transition-all
                  ${pickingField === field.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400 hover:text-indigo-600'}
                `}
              >
                <Sparkles size={14} />
              </button>
            </div>
          )}

          {pickingField === field.id && (
            <VariablePicker 
              onSelect={(path) => handleVariableSelect(field.id, path)}
              onClose={() => setPickingField(null)}
            />
          )}
        </div>
      </div>
    );
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    await connect(provider);
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    disconnect(provider);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Dynamic Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">
            {isCodeNode ? 'Entorno de Código' : 'Conexión'}
          </h3>
          {!isCodeNode && (
            activeConnection ? (
              <div className="flex items-center gap-2">
                 <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-[10px] font-bold text-emerald-600 rounded-full">
                    <CheckCircle2 size={10} /> Conectado
                 </span>
                 <button onClick={handleDisconnect} className="text-[10px] font-bold text-gray-400 hover:text-rose-500 underline uppercase tracking-tighter transition-colors">Desconectar</button>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-rose-500 uppercase">Sin Cuenta</span>
            )
          )}
        </div>

        {isCodeNode ? (
          <div className="flex items-center gap-3 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl">
             <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-rose-500">
                <Code size={16} />
             </div>
             <div>
                <p className="text-[11px] font-bold text-white leading-none mb-0.5 tracking-wide">JavaScript Runtime</p>
                <p className="text-[10px] text-zinc-500 font-medium tracking-tight whitespace-nowrap">V8 Engine • Sandbox Active</p>
             </div>
          </div>
        ) : (
          <button 
            onClick={handleConnect}
            disabled={isConnecting || !!activeConnection}
            className={`w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm transition-all group ${!activeConnection ? 'hover:border-indigo-400' : 'opacity-100'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-[10px] ${provider === 'google' ? 'bg-red-500' : 'bg-blue-600'}`}>
                {provider.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-gray-900 leading-none mb-0.5">
                  {isConnecting ? 'Conectando...' : activeConnection ? activeConnection.email : `Conectar ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
                </p>
                <p className="text-[10px] text-gray-400">
                  {isConnecting ? 'Por favor espera' : activeConnection ? 'Cuenta Autorizada' : 'Pulsa para autenticar'}
                </p>
              </div>
            </div>
            {!activeConnection && !isConnecting && (
              <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-400 transition-all" />
            )}
            {isConnecting && (
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            )}
          </button>
        )}
      </div>

      {/* Action Settings - Conditional for Code or Standard */}
      <div className="flex-1 overflow-y-auto">
        {isCodeNode ? (
          <div className="h-full flex flex-col">
            <div className="p-4 bg-zinc-900/95 flex-1 font-mono text-[11px] text-zinc-300 overflow-hidden flex flex-col">
               <div className="flex items-center gap-2 mb-3 text-zinc-500 border-b border-zinc-800 pb-2">
                  <Terminal size={12} />
                  <span>index.js</span>
               </div>
               <textarea 
                 value={config.code || '// Escribe tu código aquí...\n\nasync function run(input) {\n  const name = input.trigger.body.name;\n  return { \n    message: `Hola ${name}, bienvenido a Fluxa!` \n  };\n}'}
                 onChange={(e) => handleFieldChange('code', e.target.value)}
                 className="flex-1 bg-transparent border-none outline-none resize-none leading-relaxed text-indigo-300 placeholder-zinc-700"
                 spellCheck={false}
               />
               <div className="mt-auto pt-4 border-t border-zinc-800 text-[10px] flex justify-between text-zinc-600">
                  <span>UTF-8</span>
                  <span>LN 1, COL 1</span>
               </div>
            </div>
          </div>
        ) : !activeConnection ? (
          <div className="p-8 flex flex-col items-center justify-center h-full text-center opacity-40 grayscale">
            <Database size={48} className="text-gray-200 mb-4" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Configuración Bloqueada</p>
            <p className="text-[11px] text-gray-400 max-w-[200px]">Conecta tu cuenta para configurar los parámetros de este bloque.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 size={16} className="text-indigo-600" />
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Parámetros</h3>
            </div>

            <div className="pb-12">
              {action.inputSchema.fields.map(renderField)}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Status */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Listo para Probar</span>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
              <Play size={14} fill="currentColor" />
              <span className="text-[11px] font-black uppercase tracking-wider">Test Step</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default ActionConfigPanel;
