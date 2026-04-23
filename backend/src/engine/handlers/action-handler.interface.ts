import { ActionType } from '@prisma/client';

export interface ActionExecutionContext {
  workflowId: string;
  executionId: string;
  userId: string;
  payload: any;
  config: any;
}

export interface ActionHandler {
  type: ActionType;
  execute(context: ActionExecutionContext): Promise<any>;
}

export const ACTION_HANDLERS = 'ACTION_HANDLERS';
