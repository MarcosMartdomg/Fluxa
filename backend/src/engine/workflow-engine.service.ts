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

        const stepExecution = await this.prisma.stepExecution.create({
          data: {
            executionId: execution.id,
            actionId: action.id,
            status: 'RUNNING',
            input: action.config,
          },
        });

        const maxRetries = action.config?.retryCount || 0;
        const retryDelay = action.config?.retryDelayMs || 1000;
        let attempts = 0;
        let success = false;

        while (attempts <= maxRetries && !success) {
          try {
            const result = await this.executeAction(action, currentPayload, execution.id, workflow.userId);
            
            await this.prisma.stepExecution.update({
              where: { id: stepExecution.id },
              data: {
                status: 'COMPLETED',
                output: result,
                finishedAt: new Date(),
              },
            });

            currentPayload = result;
            await this.logStep(execution.id, `Step ${action.name} completed successfully`, result);
            success = true;
          } catch (error) {
            attempts++;
            if (attempts <= maxRetries) {
              await this.logStep(
                execution.id, 
                `Step ${action.name} failed: ${error.message}. Retrying in ${retryDelay}ms... (${attempts}/${maxRetries})`, 
                null, 
                'WARNING'
              );
              await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
              await this.prisma.stepExecution.update({
                where: { id: stepExecution.id },
                data: {
                  status: 'FAILED',
                  error: error.message,
                  finishedAt: new Date(),
                },
              });

              await this.logStep(execution.id, `Step ${action.name} failed after ${attempts} attempts: ${error.message}`, null, 'ERROR');
              throw error; // Stop execution on error
            }
          }
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
