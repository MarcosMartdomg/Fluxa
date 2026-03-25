import { ActionType } from '@prisma/client';

export interface ActionExecutionContext {
  workflowId: string;
  executionId: string;
  payload: any;
  config: any;
}

export interface ActionHandler {
  type: ActionType;
  execute(context: ActionExecutionContext): Promise<any>;
}
