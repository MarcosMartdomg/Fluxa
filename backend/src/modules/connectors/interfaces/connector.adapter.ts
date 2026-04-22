/**
 * Backend Adapter Interface for External Connectors
 */

export interface ExecutionContext {
  projectId: string;
  userId: string;
  connectionId: string;
  credentials: {
    accessToken: string;
    refreshToken?: string;
    [key: string]: any;
  };
}

export interface ResourceItem {
  id: string;
  name: string;
  type: string;
  kind?: string; // e.g. 'folder' | 'file'
  metadata?: Record<string, any>;
}

export interface IConnectorAdapter {
  readonly providerId: string;

  /**
   * Validates and potentially refreshes credentials
   */
  validateAuth(context: ExecutionContext): Promise<{ isValid: boolean; updatedCredentials?: any }>;

  /**
   * Browser-compatible list of resources (files, folders, etc)
   */
  listResources(
    resourceType: string, 
    context: ExecutionContext, 
    filters?: { parentId?: string; search?: string }
  ): Promise<ResourceItem[]>;

  /**
   * Core execution of a specific action logic
   */
  executeAction(
    resourceType: string, 
    actionKey: string, 
    config: Record<string, any>, 
    context: ExecutionContext
  ): Promise<any>;
}
