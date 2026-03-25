import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WorkflowEngineService } from './workflow-engine.service';
import { Logger } from '@nestjs/common';

@Processor('workflow-execution')
export class WorkflowProcessor extends WorkerHost {
  private readonly logger = new Logger(WorkflowProcessor.name);

  constructor(private readonly engineService: WorkflowEngineService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { workflowId, payload, executionId } = job.data;
    this.logger.log(`Processing job ${job.id} for workflow: ${workflowId}`);
    
    try {
      await this.engineService.executeWorkflow(workflowId, payload, executionId);
      return { success: true };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}
