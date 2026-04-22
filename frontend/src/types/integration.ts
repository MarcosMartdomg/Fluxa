/**
 * External Resource System (ERS) Refined Types
 */

export type Provider = 'google' | 'microsoft' | 'slack' | 'discord' | 'shopify' | 'http' | 'custom';

export type ResourceType = 
  | 'spreadsheet' 
  | 'document' 
  | 'file' 
  | 'folder' 
  | 'email' 
  | 'api_endpoint';

/**
 * Data shape for a single integration step in a workflow
 */
export interface WorkflowStep {
  id: string;
  nodeId: string;
  type: 'action' | 'trigger';
  
  // Identity
  provider: Provider;
  resourceType: ResourceType;
  actionKey: string;
  
  // Connection & Selection
  connectionId: string;
  selectedResource?: {
    id: string;
    name: string;
    metadata?: Record<string, any>;
  };

  // User Configuration
  config: Record<string, any>;
  
  // Runtime state
  status: 'active' | 'configured' | 'incomplete' | 'error';
  version: number;
}

/**
 * Connection model (Auth data)
 */
export interface Connection {
  id: string;
  userId: string;
  provider: Provider;
  label: string;
  status: 'valid' | 'expired' | 'revoked';
}

/**
 * Action configuration metadata
 */
export interface ActionField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'mapping' | 'file_picker';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}

export interface ActionMetadata {
  key: string;
  label: string;
  description: string;
  inputSchema: {
    fields: ActionField[];
  };
  outputSchema: {
    paths: Array<{
      path: string;
      label: string;
      example: any;
    }>;
  };
}

export interface ResourceDefinition {
  type: ResourceType;
  label: string;
  icon: string;
  actions: ActionMetadata[];
}
