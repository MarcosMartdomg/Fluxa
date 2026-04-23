import { Handle, Position, NodeProps, Node, useReactFlow } from '@xyflow/react';
import { Zap, Play, Split, Clock, Trash2, Edit3, Plus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// --- Shared Styles & Types ---
export type NodeData = {
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  provider?: string;
  actionKey?: string;
  config?: Record<string, any>;
  maturity?: string;
  execStatus?: string;
  execResult?: any;
};

const PROVIDERS_REQUIRING_CONNECTION = ['google', 'microsoft', 'slack', 'discord', 'shopify'];

const nodeBaseStyles = "w-[180px] md:w-[220px] max-w-[240px] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all group relative";
const selectedStyles = "ring-2 ring-indigo-500 ring-offset-2 border-indigo-500";
const nodeHeaderStyles = "px-3 py-2 flex items-center gap-2 border-b border-gray-50";
const iconWrapperStyles = "w-7 h-7 rounded-md flex items-center justify-center text-white shrink-0";
const actionButtonStyles = "p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors";
const handleStyles = "w-3 h-3 bg-white border-2 border-gray-300 hover:border-indigo-500 hover:scale-125 transition-transform z-10";

// --- Execution Status Badge ---
const ExecutionStatusBadge = ({ status, result }: { status?: string, result?: any }) => {
  if (!status || status === 'IDLE') return null;

  const config = {
    RUNNING: { icon: <Loader2 size={10} className="animate-spin" />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    COMPLETED: { icon: <CheckCircle2 size={10} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    FAILED: { icon: <AlertCircle size={10} />, color: 'bg-rose-50 text-rose-600 border-rose-100' },
  }[status as keyof typeof config] || { icon: null, color: 'bg-gray-50 text-gray-400' };

  return (
    <div className={`absolute -top-2 -right-2 flex items-center gap-1.5 px-2 py-1 rounded-full border shadow-sm z-[60] animate-in zoom-in-50 duration-300 ${config.color}`}>
      {config.icon}
      <span className="text-[8px] font-black uppercase tracking-widest">{status}</span>
    </div>
  );
};

// --- AddNode (Sequential Plus) ---
export const AddNode = ({ id }: NodeProps) => {
  return (
    <div className="flex flex-col items-center justify-center group relative p-4">
      <Handle type="target" position={Position.Top} className="!w-0 !h-0 !border-0 !bg-transparent" />
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          window.dispatchEvent(new CustomEvent('fluxa:open-selector', { 
            detail: { parentId: id } 
          }));
        }}
        className="w-8 h-8 bg-white border-2 border-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shadow-sm transition-all hover:border-indigo-600 hover:scale-110 active:scale-95 group-hover:shadow-md"
        title="Interpolar paso"
      >
        <Plus size={16} strokeWidth={3} />
      </button>

      <Handle type="source" position={Position.Bottom} className="!w-0 !h-0 !border-0 !bg-transparent" />
    </div>
  );
};

// --- Trigger Node ---
export const TriggerNode = ({ data, selected, id }: NodeProps<Node<NodeData>>) => {
  const { deleteElements } = useReactFlow();

  return (
    <div className={`${nodeBaseStyles} ${selected ? selectedStyles : 'hover:border-indigo-300'}`}>
      <ExecutionStatusBadge status={data.execStatus} result={data.execResult} />
      <div className={nodeHeaderStyles}>
        <div className={`${iconWrapperStyles} bg-indigo-500`}>
          <Zap size={14} />
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider leading-none mb-1">Trigger</p>
          <h3 className="text-[13px] font-bold text-gray-900 leading-tight truncate">{data.label}</h3>
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className={actionButtonStyles}
            onClick={(e) => { e.stopPropagation(); deleteElements({ nodes: [{ id }] }); }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <div className="px-3 pb-3 pt-1 space-y-3">
        {/* Webhook Technical Info */}
        <div className="p-2.5 bg-gray-900 rounded-xl border border-gray-800 shadow-inner overflow-hidden">
           <div className="flex items-center justify-between mb-1.5">
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Webhook URL</span>
              <button 
                onClick={(e) => { e.stopPropagation(); alert('URL Copiada!'); }}
                className="text-[8px] font-bold text-gray-500 hover:text-white transition-colors"
              >
                COPIAR
              </button>
           </div>
           <div className="text-[9px] font-mono text-gray-300 truncate opacity-80">
              https://api.fluxa.io/hooks/trg_{id.slice(0, 8)}
           </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Esperando Evento...</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className={`${handleStyles} !bg-indigo-500 !border-indigo-200`} />
    </div>
  );
};

// --- Action Node ---
export const ActionNode = ({ data, selected, id }: NodeProps<Node<NodeData>>) => {
  const { deleteElements } = useReactFlow();
  const isPrototype = data.maturity === 'ui-only';

  return (
    <div className={`${nodeBaseStyles} ${selected ? selectedStyles : isPrototype ? 'border-dashed border-gray-300' : 'hover:border-indigo-300'}`}>
      <ExecutionStatusBadge status={data.execStatus} result={data.execResult} />
      {isPrototype && (
        <div className="absolute -top-2 -left-2 flex items-center gap-1.5 px-2 py-1 rounded-full border border-gray-200 bg-white shadow-sm z-[60] text-gray-400">
          <Eye size={10} />
          <span className="text-[8px] font-black uppercase tracking-widest">PROTOTIPO</span>
        </div>
      )}
      <Handle type="target" position={Position.Top} className={handleStyles} />
      <div className={nodeHeaderStyles}>
        <div className={`${iconWrapperStyles} ${isPrototype ? 'bg-gray-400' : 'bg-gray-800'}`}>
          <Play size={14} />
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Action</p>
          <h3 className="text-[13px] font-bold text-gray-900 leading-tight truncate">{data.label}</h3>
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className={actionButtonStyles}
            onClick={(e) => { e.stopPropagation(); deleteElements({ nodes: [{ id }] }); }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <div className="px-3 py-1.5 bg-gray-50/50 flex items-center justify-between gap-2">
        <p className="text-[10px] text-gray-500 font-medium truncate">{data.sublabel || 'Ejecuta una tarea'}</p>
        {data.provider && PROVIDERS_REQUIRING_CONNECTION.includes(data.provider) && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold border shrink-0 bg-amber-50 text-amber-600 border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            CONN
          </span>
        )}
        {data.provider && !data.actionKey && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold border shrink-0 bg-gray-100 text-gray-400 border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            SIN CONFIG
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className={handleStyles} />
    </div>
  );
};

// --- Condition Node ---
export const ConditionNode = ({ data, selected, id }: NodeProps<Node<NodeData>>) => {
  const { deleteElements } = useReactFlow();

  return (
    <div className={`${nodeBaseStyles} ${selected ? selectedStyles : 'hover:border-indigo-300'}`}>
      <ExecutionStatusBadge status={data.execStatus} result={data.execResult} />
      <Handle type="target" position={Position.Top} className={handleStyles} />
      <div className={nodeHeaderStyles}>
        <div className={`${iconWrapperStyles} bg-amber-500`}>
          <Split size={14} />
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider leading-none mb-1">Condition</p>
          <h3 className="text-[13px] font-bold text-gray-900 leading-tight truncate">{data.label}</h3>
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className={actionButtonStyles}
            onClick={(e) => { e.stopPropagation(); deleteElements({ nodes: [{ id }] }); }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <div className="px-3 py-1.5 flex justify-between gap-4 bg-amber-50/30">
        <div className="flex flex-col items-center relative">
          <span className="text-[8px] font-bold text-emerald-600 uppercase mb-0.5">Sí</span>
          <Handle type="source" position={Position.Bottom} id="true" className={`${handleStyles} !static !bg-emerald-500 !border-emerald-200`} />
        </div>
        <div className="flex flex-col items-center relative">
          <span className="text-[8px] font-bold text-rose-600 uppercase mb-0.5">No</span>
          <Handle type="source" position={Position.Bottom} id="false" className={`${handleStyles} !static !bg-rose-500 !border-rose-200`} />
        </div>
      </div>
    </div>
  );
};

// --- Delay Node ---
export const DelayNode = ({ data, selected, id }: NodeProps<Node<NodeData>>) => {
  const { deleteElements } = useReactFlow();

  return (
    <div className={`${nodeBaseStyles} ${selected ? selectedStyles : 'hover:border-indigo-300'}`}>
      <ExecutionStatusBadge status={data.execStatus} result={data.execResult} />
      <Handle type="target" position={Position.Top} className={handleStyles} />
      <div className={nodeHeaderStyles}>
        <div className={`${iconWrapperStyles} bg-zinc-400`}>
          <Clock size={14} />
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider leading-none mb-1">Delay</p>
          <h3 className="text-[13px] font-bold text-gray-900 leading-tight truncate">{data.label}</h3>
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className={actionButtonStyles}
            onClick={(e) => { e.stopPropagation(); deleteElements({ nodes: [{ id }] }); }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <div className="px-3 py-1.5 bg-gray-50/50">
        <p className="text-[10px] text-gray-500 font-medium truncate">{data.sublabel || 'Espera un tiempo'}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className={handleStyles} />
    </div>
  );
};
