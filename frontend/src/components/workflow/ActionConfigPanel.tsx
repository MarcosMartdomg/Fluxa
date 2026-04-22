import { 
  Settings2, Link2, Database, Play, 
  AlertCircle, CheckCircle2, ChevronRight, Sparkles 
} from 'lucide-react';
import { Provider, ActionMetadata, ActionField } from '../../types/integration';
import { GOOGLE_SPREADSHEET_RESOURCE } from '../../integrations/google/spreadsheet';
import { GOOGLE_DOCUMENT_RESOURCE } from '../../integrations/google/document';
import VariablePicker from './VariablePicker';

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
  const [activeConnection, setActiveConnection] = useState<string | null>(null);
  const [pickingField, setPickingField] = useState<string | null>(null);

  // Find action in Google Spreadsheet or Document
  const allActions = [...GOOGLE_SPREADSHEET_RESOURCE.actions, ...GOOGLE_DOCUMENT_RESOURCE.actions];
  const action = allActions.find(a => a.key === actionKey);

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

  const renderField = (field: ActionField) => {
    const value = config[field.id] || '';

    return (
      <div key={field.id} className="mb-6 last:mb-0">
        <label className="flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
          {field.label}
          {field.required && <span className="text-rose-500">*</span>}
        </label>

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
          <input 
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Connection Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Conexión</h3>
          {activeConnection ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-[10px] font-bold text-emerald-600 rounded-full">
              <CheckCircle2 size={10} /> Conectado
            </span>
          ) : (
            <span className="text-[10px] font-bold text-rose-500 uppercase">Sin Cuenta</span>
          )}
        </div>

        <button 
          onClick={() => setActiveConnection('mock-google-id')}
          className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-indigo-400 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 font-black text-[10px]">
              G
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-gray-900 leading-none mb-0.5">
                {activeConnection ? 'marcos@fluxa.io' : 'Conectar Google'}
              </p>
              <p className="text-[10px] text-gray-400">
                {activeConnection ? 'Cuenta Personal' : 'Pulsa para autenticar'}
              </p>
            </div>
          </div>
          <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-400 transition-all" />
        </button>
      </div>

      {/* Action Settings */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings2 size={16} className="text-indigo-600" />
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Parámetros</h3>
        </div>

        <div className="pb-12">
          {action.inputSchema.fields.map(renderField)}
        </div>
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
