import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class ExecutionsService {
  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
  ) {}

  async trigger(workflowId: string, payload: any) {
    const execution = await this.prisma.execution.create({
      data: {
        workflowId,
        payload,
        status: 'PENDING',
      },
    });

    await this.queueService.addWorkflowToQueue(workflowId, payload, execution.id);

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
      include: { logs: true },
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
