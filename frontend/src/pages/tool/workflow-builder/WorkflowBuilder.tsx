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

import WorkflowSidebar from '../../../components/workflow/WorkflowSidebar';
import NodeEditorPanel from '../../../components/workflow/NodeEditorPanel';
import ActionSelectorModal from '../../../components/workflow/ActionSelectorModal';
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [lastParentId, setLastParentId] = useState<string | null>(null);

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

  return (
    <div className="workflow-builder-container">
      <div className="workflow-builder-content">
        <WorkflowSidebar onAddNode={() => setIsSelectorOpen(true)} />
        
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
