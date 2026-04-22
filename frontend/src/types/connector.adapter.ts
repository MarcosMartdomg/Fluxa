/**
 * Backend Adapter Interface for External Connectors
 */

export interface ExecutionContext {
  projectId: string;
  userId: string;
  credentials: any; // Decrypted tokens/keys
}

export interface ResourceItem {
  id: string;
  name: string;
  type: string;
  metadata?: any;
}

export interface IConnectorAdapter {
  /**
   * Unique identifier for the provider (google, microsoft, etc)
   */
  readonly providerId: string;

  /**
   * Validate that the credentials are still valid, or refresh them
   */
  validateAuth(context: ExecutionContext): Promise<boolean>;

  /**
   * List available resources for a specific type (e.g. list spreadsheets)
   * used by the UI File Picker
   */
  listResources(type: string, context: ExecutionContext): Promise<ResourceItem[]>;

  /**
   * Core execution logic for a specific action
   */
  executeAction(
    resourceType: string, 
    actionKey: string, 
    config: any, 
    context: ExecutionContext
  ): Promise<any>;
}
