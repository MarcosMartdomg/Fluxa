import { Node } from '@xyflow/react';

export type NodeType = 'trigger' | 'action' | 'condition' | 'delay';

export interface WorkflowNodeData {
  label: string;
  sublabel?: string;
  icon?: string;
  // Integration fields
  provider?: string;
  actionKey?: string;
  config?: Record<string, any>;
  // Execution state
  execStatus?: 'idle' | 'loading' | 'success' | 'error';
}

export type FluxaNode = Node<WorkflowNodeData, NodeType>;

export interface NodeTemplate {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
}
