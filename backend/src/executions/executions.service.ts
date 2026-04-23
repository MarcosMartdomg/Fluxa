import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { WorkflowEngineService } from '../engine/workflow-engine.service';

@Injectable()
export class ExecutionsService {
  private readonly logger = new Logger(ExecutionsService.name);

  constructor(
    private prisma: PrismaService,
    private engineService: WorkflowEngineService,
  ) {}

  async trigger(workflowId: string, payload: any) {
    const execution = await this.prisma.execution.create({
      data: {
        workflowId,
        payload,
        status: 'PENDING',
      },
    });

    // Fire-and-forget: run the engine asynchronously
    this.engineService.executeWorkflow(workflowId, payload, execution.id).catch((error) => {
      this.logger.error(`Workflow ${workflowId} execution failed: ${error.message}`);
    });

    return execution;
  }

  async findAllByWorkflow(workflowId: string) {
    return this.prisma.execution.findMany({
      where: { workflowId },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const execution = await this.prisma.execution.findUnique({
      where: { id },
      include: { logs: true, stepExecutions: true },
    });
    if (!execution) throw new NotFoundException(`Execution ${id} not found`);
    return execution;
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.execution.update({
      where: { id },
      data: { status, finishedAt: status === 'COMPLETED' || status === 'FAILED' ? new Date() : undefined },
    });
  }
}
