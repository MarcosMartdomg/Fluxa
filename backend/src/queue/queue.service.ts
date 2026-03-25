import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from './queue.constants';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUES.WORKFLOW_EXECUTION) private workflowQueue: Queue,
  ) {}

  async addWorkflowToQueue(workflowId: string, payload: any, executionId: string) {
    await this.workflowQueue.add('execute', { workflowId, payload, executionId });
  }
}
