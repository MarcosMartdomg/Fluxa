import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ExecutionStatus, ActionType } from '@prisma/client';
import { ACTION_HANDLERS, ActionHandler } from './handlers/action-handler.interface';

@Injectable()
export class WorkflowEngineService {
  private readonly logger = new Logger(WorkflowEngineService.name);

  private readonly handlers = new Map<ActionType, ActionHandler>();

  constructor(
    private readonly prisma: PrismaService,
    @Inject(ACTION_HANDLERS) handlers: ActionHandler[],
  ) {
    handlers.forEach(handler => this.handlers.set(handler.type, handler));
  }

  async executeWorkflow(workflowId: string, initialPayload: any, executionId?: string) {
    this.logger.log(`Starting workflow execution for ID: ${workflowId}`);

    let execution;
    if (executionId) {
      execution = await this.prisma.execution.update({
        where: { id: executionId },
        data: { status: ExecutionStatus.RUNNING },
      });
    } else {
      execution = await this.prisma.execution.create({
        data: {
          workflowId,
          status: ExecutionStatus.RUNNING,
          payload: initialPayload,
        },
      });
    }

    try {
      // 2. Fetch Workflow with Actions
      const workflow = await this.prisma.workflow.findUnique({
        where: { id: workflowId },
        include: {
          actions: {
            orderBy: { order: 'asc' },
          },
        },
      });

      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }

      let currentPayload = initialPayload;

      // 3. Execute Actions in sequence
      for (const action of workflow.actions) {
        await this.logStep(execution.id, `Executing step: ${action.name} (${action.type})`);

        try {
          const result = await this.executeAction(action, currentPayload, execution.id, workflow.userId);
          currentPayload = result; // Update payload for the next step
          await this.logStep(execution.id, `Step ${action.name} completed successfully`, result);
        } catch (error) {
          await this.logStep(execution.id, `Step ${action.name} failed: ${error.message}`, null, 'ERROR');
          throw error;
        }
      }

      // 4. Update Execution as Completed
      await this.prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: ExecutionStatus.COMPLETED,
          finishedAt: new Date(),
        },
      });

      this.logger.log(`Workflow ${workflowId} completed successfully`);
    } catch (error) {
      this.logger.error(`Workflow ${workflowId} failed: ${error.message}`);
      
      await this.prisma.execution.update({
        where: { id: execution.id },
        data: {
          status: ExecutionStatus.FAILED,
          finishedAt: new Date(),
        },
      });
    }
  }

  private async executeAction(action: any, payload: any, executionId: string, userId: string) {
    const context = {
      workflowId: action.workflowId,
      executionId,
      userId,
      payload,
      config: action.config,
    };

    const handler = this.handlers.get(action.type);
    if (!handler) {
      throw new Error(`Unsupported action type: ${action.type}`);
    }

    return handler.execute(context);
  }

  private async logStep(executionId: string, message: string, meta: any = null, level: string = 'INFO') {
    await this.prisma.executionLog.create({
      data: {
        executionId,
        message,
        meta: meta ? JSON.parse(JSON.stringify(meta)) : undefined,
        level,
      },
    });
  }
}
