import { Module } from '@nestjs/common';
import { WorkflowEngineService } from './workflow-engine.service';
import { BullModule } from '@nestjs/bullmq';
import { HttpRequestHandler } from './handlers/http-request.handler';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'workflow-execution',
    }),
  ],
  providers: [WorkflowEngineService, HttpRequestHandler],
  exports: [WorkflowEngineService],
})
export class WorkflowEngineModule {}
