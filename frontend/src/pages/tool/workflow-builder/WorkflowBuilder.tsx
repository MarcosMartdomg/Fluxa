import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import { Zap, Play, Settings } from 'lucide-react';

import WorkflowSidebar from '../../../components/workflow/WorkflowSidebar';
import NodeEditorPanel from '../../../components/workflow/NodeEditorPanel';
import ActionSelectorModal from '../../../components/workflow/ActionSelectorModal';
import projectsService from '../../../services/projects.service';
import workflowsService from '../../../services/workflows.service';
import executionsService from '../../../services/executions.service';
import { useConnections } from '../../../context/ConnectionContext';
import { NodeType, FluxaNode, WorkflowNodeData } from '../../../types/workflow';

import { 
  TriggerNode, 
  ActionNode, 
  ConditionNode, 
  DelayNode,
  AddNode
} from './nodes/CustomNodes';

import '@xyflow/react/dist/style.css';
import './WorkflowBuilder.css';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
  addNode: AddNode,
};

const initialNodes = [
  {
    id: 'node-1',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: { label: 'Webhook Recibido', sublabel: 'Endpoint: /api/v1/trigger' },
  },
  {
    id: 'add-1',
    type: 'addNode',
    position: { x: 185, y: 175 },
    data: {},
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-add', source: 'node-1', target: 'add-1', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }
];

interface WorkflowBuilderProps {
  projectId: string;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ projectId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [lastParentId, setLastParentId] = useState<string | null>(null);
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [executionStatus, setExecutionStatus] = useState<'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED'>('IDLE');
  const [activeExecutionId, setActiveExecutionId] = useState<string | null>(null);
  const { isConnected } = useConnections();

  useEffect(() => {
    const loadCanvas = async () => {
      try {
        setLoading(true);
        const data = await projectsService.getCanvas(projectId);
        if (data && data.cards) {
          const validNodes = data.cards.map((node: any) => ({
            ...node,
            position: node.position || { x: 0, y: 0 }
          }));
          setNodes(validNodes);
          setEdges(data.edges || []);
        }

        // Get associated workflow
        const workflows = await workflowsService.getAll(projectId);
        if (workflows && workflows.length > 0) {
          setWorkflowId(workflows[0].id);
        }
      } catch (error) {
        console.error('Error loading canvas:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCanvas();
  }, [projectId, setNodes, setEdges]);

  // Polling execution status
  useEffect(() => {
    let interval: any;
    if (activeExecutionId && executionStatus === 'RUNNING') {
      interval = setInterval(async () => {
        try {
          const execution = await executionsService.getById(activeExecutionId);
          if (execution.status !== 'RUNNING') {
            setExecutionStatus(execution.status);
            if (execution.status !== 'RUNNING') {
              setActiveExecutionId(null);
            }

            // Map step results back to nodes
            if (execution.stepExecutions) {
              setNodes(nds => nds.map(node => {
                const step = execution.stepExecutions.find((s: any) => s.actionId === node.id);
                if (step) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      execStatus: step.status,
                      execResult: step.output || step.error
                    }
                  };
                }
                return node;
              }));
            }
          }
        } catch (error) {
          console.error('Polling error:', error);
          clearInterval(interval);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [activeExecutionId, executionStatus, setNodes]);

  const { screenToFlowPosition, getInternalNode } = useReactFlow();

  // Derived state for the selected node
  const selectedNode = (nodes.find((n) => n.selected) as FluxaNode) || null;

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedNodes = nodes.filter(n => n.selected);
        const selectedEdges = edges.filter(e => e.selected);

        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          const selectedNodeIds = new Set(selectedNodes.map(n => n.id));
          
          setNodes(nds => nds.filter(n => !n.selected));
          // Remove selected edges OR edges connected to deleted nodes
          setEdges(eds => eds.filter(e => !e.selected && !selectedNodeIds.has(e.source) && !selectedNodeIds.has(e.target)));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, setNodes, setEdges]);

  const onAddNode = useCallback((type: NodeType, label?: string, metadata?: any) => {
    const id = `node_${Date.now()}`;
    const nextAddId = `add_${Date.now()}`;
    let position = { x: 400, y: 150 };
    
    if (lastParentId) {
      const parentNode = nodes.find(n => n.id === lastParentId);
      if (parentNode) {
        position = { ...parentNode.position };
        
        // Find who was pointing to this addNode to redirect them to the new real node
        setEdges((eds) => 
          eds.map(edge => {
            if (edge.target === lastParentId) {
              return { ...edge, target: id };
            }
            return edge;
          })
        );

        // Remove the old addNode
        setNodes((nds) => nds.filter(n => n.id !== lastParentId));
      }
    }

    const newNode = {
      id,
      type,
      position,
      data: { 
        label: label || `Nuevo ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        sublabel: metadata?.provider ? `Acción de ${metadata.provider}` : 'Configura este bloque',
        provider: metadata?.provider,
        actionKey: metadata?.actionKey,
        config: {}
      },
    };

    const nextAddNode = {
      id: nextAddId,
      type: 'addNode',
      position: { x: position.x + 85, y: position.y + 75 }, // Centered below
      data: {},
    };

    const nextEdge: Edge = {
      id: `e-${id}-${nextAddId}`,
      source: id,
      target: nextAddId,
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 }
    };
    
    setNodes((nds) => [...nds, newNode, nextAddNode]);
    setEdges((eds) => [...eds, nextEdge]);
    
    setIsSelectorOpen(false);
    setLastParentId(null);
  }, [setNodes, setEdges, nodes, lastParentId]);

  const onUpdateNodeData = useCallback((id: string, data: Partial<WorkflowNodeData>) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...data },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const clearSelection = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
  }, [setNodes]);

  // Listen for canvas "+" button clicks
  useEffect(() => {
    const handleOpenSelector = (e: any) => {
      setLastParentId(e.detail.parentId);
      setIsSelectorOpen(true);
    };

    window.addEventListener('fluxa:open-selector', handleOpenSelector);
    return () => window.removeEventListener('fluxa:open-selector', handleOpenSelector);
  }, []);

  // Handle global mouse button events to prevent back navigation
  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      // Button 3 is usually the "back" button on mice
      if (e.button === 3) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('mouseup', handleMouseUp, true);
    window.addEventListener('auxclick', handleMouseUp, true);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp, true);
      window.removeEventListener('auxclick', handleMouseUp, true);
    };
  }, []);

  const [isExecuting, setIsExecuting] = useState(false);

  const runWorkflow = async () => {
    if (!workflowId) return;

    try {
      setExecutionStatus('RUNNING');
      // Reset nodes
      setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, execStatus: 'IDLE', execResult: null } })));
      
      const execution = await executionsService.trigger(workflowId, { trigger: 'manual' });
      setActiveExecutionId(execution.id);
    } catch (error) {
      console.error('Execution error:', error);
      setExecutionStatus('FAILED');
    }
  };

  if (loading) return null;

  return (
    <div className="workflow-builder-container flex flex-col h-screen bg-[#F8F9FB] overflow-hidden">
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Zap className="text-white" size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none mb-1">Workflow Builder</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Proyecto: Fluxa Automation</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Workflow readiness indicator */}
          {(() => {
            const CONN_PROVIDERS = ['google', 'microsoft', 'slack', 'discord', 'shopify'];
            const actionNodes = nodes.filter(n => n.type === 'action' || n.type === 'condition' || n.type === 'delay');
            const needsConnection = actionNodes.some(n => n.data?.provider && CONN_PROVIDERS.includes(n.data.provider as string) && !isConnected(n.data.provider as any));
            const needsConfig = actionNodes.some(n => n.data?.provider && !n.data?.actionKey);

            let readinessLabel = '';
            let readinessColor = '';
            let readinessDot = '';

            if (!workflowId) {
              readinessLabel = 'SIN WORKFLOW';
              readinessColor = 'bg-gray-50 text-gray-400 border-gray-200';
              readinessDot = 'bg-gray-300';
            } else if (needsConnection) {
              readinessLabel = 'SIN CONEXIÓN';
              readinessColor = 'bg-amber-50 text-amber-600 border-amber-100';
              readinessDot = 'bg-amber-400';
            } else if (needsConfig) {
              readinessLabel = 'SIN CONFIG';
              readinessColor = 'bg-gray-50 text-gray-500 border-gray-200';
              readinessDot = 'bg-gray-400';
            } else {
              readinessLabel = 'LISTO';
              readinessColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
              readinessDot = 'bg-emerald-500';
            }

            return executionStatus === 'IDLE' ? (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold border ${readinessColor}`}>
                <div className={`w-2 h-2 rounded-full ${readinessDot}`} />
                {readinessLabel}
              </div>
            ) : null;
          })()}

          {executionStatus !== 'IDLE' && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold border ${
              executionStatus === 'RUNNING' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
              executionStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              'bg-rose-50 text-rose-600 border-rose-100'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                executionStatus === 'RUNNING' ? 'bg-indigo-500 animate-pulse' :
                executionStatus === 'COMPLETED' ? 'bg-emerald-500' :
                'bg-rose-500'
              }`} />
              {executionStatus === 'RUNNING' ? 'EJECUTANDO...' : executionStatus === 'COMPLETED' ? 'ÉXITO' : 'FALLO'}
            </div>
          )}

          {executionStatus === 'RUNNING' ? (
            <button 
              onClick={() => setExecutionStatus('IDLE')}
              className="px-6 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-100 transition-all shadow-sm"
            >
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
              Detener
            </button>
          ) : (
            <button 
              onClick={runWorkflow}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 group"
            >
              <Play size={14} fill="currentColor" className="group-hover:scale-110 transition-transform" />
              Ejecutar Flujo
            </button>
          )}

          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
            <Settings size={20} />
          </button>
        </div>
      </nav>

      <div className="workflow-builder-content flex flex-1 overflow-hidden relative">
        <WorkflowSidebar 
          activeNode={selectedNode}
          onAddNode={() => setIsSelectorOpen(true)} 
        />
        
        <div className="react-flow-wrapper cursor-grab active:cursor-grabbing">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            // Navigation improvements
            panOnScroll={true}
            zoomOnScroll={true}
            panOnDrag={true}
            selectionOnDrag={false}
            elementsSelectable={true}
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#E5E7EB" />
          </ReactFlow>
        </div>

        <NodeEditorPanel 
          node={selectedNode} 
          onUpdate={onUpdateNodeData}
          onClose={clearSelection}
        />
      </div>

      <ActionSelectorModal 
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={(type, label) => onAddNode(type, label)}
      />
    </div>
  );
};

export default WorkflowBuilder;
