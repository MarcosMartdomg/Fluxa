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
      } catch (error) {
        console.error('Error loading canvas:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCanvas();
  }, [projectId, setNodes, setEdges]);

  const { screenToFlowPosition, getInternalNode } = useReactFlow();

  // Derived state for the selected node
  const selectedNode = (nodes.find((n) => n.selected) as FluxaNode) || null;

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

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
    if (isExecuting) return;
    setIsExecuting(true);

    // Reset all nodes to idle
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, execStatus: 'idle' } })));

    // Sequential simulation
    // 1. Start with Trigger
    const trigger = nodes.find(n => n.type === 'trigger');
    if (!trigger) {
      setIsExecuting(false);
      return;
    }

    const setNodeStatus = (nodeId: string, status: 'loading' | 'success' | 'error', result?: any) => {
      setNodes(nds => nds.map(n => 
        n.id === nodeId ? { 
          ...n, 
          data: { 
            ...n.data, 
            execStatus: status,
            execResult: result || (status === 'success' ? { status: 'OK', timestamp: new Date().toISOString() } : null)
          } 
        } : n
      ));
    };

    // Execute Trigger
    setNodeStatus(trigger.id, 'loading');
    await new Promise(r => setTimeout(r, 1000));
    setNodeStatus(trigger.id, 'success', { event: 'webhook_received', body: { name: 'Marcos', email: 'marcos@fluxa.io' } });

    // Follow edges
    let currentNodeId = trigger.id;
    let hasNext = true;

    while (hasNext) {
      const edge = edges.find(e => e.source === currentNodeId);
      if (!edge) {
        hasNext = false;
        break;
      }

      const nextNode = nodes.find(n => n.id === edge.target);
      // Skip addNodes in execution flow
      if (!nextNode || nextNode.type === 'addNode') {
        // If it's an addNode, check if there's something after it
        const afterAddEdge = edges.find(e => e.source === edge.target);
        if (afterAddEdge) {
          currentNodeId = afterAddEdge.source;
          continue;
        } else {
          hasNext = false;
          break;
        }
      }

      setNodeStatus(nextNode.id, 'loading');
      await new Promise(r => setTimeout(r, 1500));
      
      // Simulate variable resolution for the UI
      let resolvedResult: any = { status: 'OK' };
      const config = nextNode.data.config || {};
      const hasVariables = Object.values(config).some(v => typeof v === 'string' && v.includes('{{'));
      
      if (hasVariables) {
        resolvedResult.resolvedData = "Variables procesadas: 'Marcos' <marcos@fluxa.io>";
      }

      setNodeStatus(nextNode.id, 'success', resolvedResult);
      currentNodeId = nextNode.id;
    }

    setIsExecuting(false);
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
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Auto-guardado activo
          </div>
          
          {isExecuting ? (
            <button 
              onClick={() => setIsExecuting(false)}
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
            panOnDrag={[1, 2, 3, 4]} // 1: left, 2: middle, 3: right (some mice), 4: back
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
