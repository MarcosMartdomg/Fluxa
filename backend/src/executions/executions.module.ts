import { Module } from '@nestjs/common';
import { ExecutionsService } from './executions.service';
import { ExecutionsController } from './executions.controller';
import { ExecutionProcessor } from './processors/execution.processor';
import { BullMqModule } from '../queue/bullmq.module';

@Module({
  imports: [BullMqModule],
  providers: [ExecutionsService, ExecutionProcessor],
  controllers: [ExecutionsController],
  exports: [ExecutionsService],
})
export class ExecutionsModule {}
