import { Handle, Position, NodeProps, Node, useReactFlow } from '@xyflow/react';
import { Zap, Play, Split, Clock, Trash2, Edit3 } from 'lucide-react';

// --- Shared Styles & Types ---
export type NodeData = {
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
};

const nodeBaseStyles = "w-[180px] md:w-[220px] max-w-[240px] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all group relative";
const selectedStyles = "ring-2 ring-indigo-500 ring-offset-2 border-indigo-500";
const nodeHeaderStyles = "px-3 py-2 flex items-center gap-2 border-b border-gray-50";
const iconWrapperStyles = "w-7 h-7 rounded-md flex items-center justify-center text-white shrink-0";
const actionButtonStyles = "p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors";
const handleStyles = "w-3 h-3 bg-white border-2 border-gray-300 hover:border-indigo-500 hover:scale-125 transition-transform z-10";

// --- Add Step Button Component ---
const AddStepButton = ({ parentId }: { parentId: string }) => (
  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20">
    <div className="w-[1px] h-3 bg-gray-200 mx-auto mb-1"></div>
    <button 
      onClick={(e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('fluxa:open-selector', { 
          detail: { parentId } 
        }));
      }}
      className="w-6 h-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95 group"
      title="Añadir paso siguiente"
    >
      <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
    </button>
  </div>
);

// --- Trigger Node ---
export const TriggerNode = ({ data, selected, id }: NodeProps<Node<NodeData>>) => {
  const { deleteElements } = useReactFlow();

  return (
    <div className={`${nodeBaseStyles} ${selected ? selectedStyles : 'hover:border-indigo-300'}`}>
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
      <div className="px-3 py-1.5 bg-gray-50/50">
        <p className="text-[10px] text-gray-500 font-medium truncate">{data.sublabel || 'Inicia el flujo'}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className={`${handleStyles} !bg-indigo-500 !border-indigo-200`} />
      
      {/* Sequential Action Button */}
      <AddStepButton parentId={id} />
    </div>
  );
};

// --- Action Node ---
export const ActionNode = ({ data, selected, id }: NodeProps<Node<NodeData>>) => {
  const { deleteElements } = useReactFlow();

  return (
    <div className={`${nodeBaseStyles} ${selected ? selectedStyles : 'hover:border-indigo-300'}`}>
      <Handle type="target" position={Position.Top} className={handleStyles} />
      <div className={nodeHeaderStyles}>
        <div className={`${iconWrapperStyles} bg-gray-800`}>
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
      <div className="px-3 py-1.5 bg-gray-50/50">
        <p className="text-[10px] text-gray-500 font-medium truncate">{data.sublabel || 'Ejecuta una tarea'}</p>
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
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-emerald-600 uppercase mb-0.5">Sí</span>
          <Handle type="source" position={Position.Bottom} id="true" className={`${handleStyles} !static !bg-emerald-500 !border-emerald-200`} />
        </div>
        <div className="flex flex-col items-center">
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
