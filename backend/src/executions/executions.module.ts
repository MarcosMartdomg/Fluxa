import { Module } from '@nestjs/common';
import { ExecutionsService } from './executions.service';
import { ExecutionsController } from './executions.controller';
import { WorkflowEngineModule } from '../engine/workflow-engine.module';

@Module({
  imports: [WorkflowEngineModule],
  providers: [ExecutionsService],
  controllers: [ExecutionsController],
  exports: [ExecutionsService],
})
export class ExecutionsModule {}
