import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from './queue.constants';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.WORKFLOW_EXECUTION,
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class BullMqModule {}
