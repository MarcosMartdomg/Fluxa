import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { TriggersModule } from './triggers/triggers.module';
import { ActionsModule } from './actions/actions.module';
import { ExecutionsModule } from './executions/executions.module';
import { LogsModule } from './logs/logs.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { BullMqModule } from './queue/bullmq.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
    PrismaModule,
    BullMqModule,
    AuthModule,
    UsersModule,
    WorkflowsModule,
    TriggersModule,
    ActionsModule,
    ExecutionsModule,
    LogsModule,
    WebhooksModule,
    SchedulerModule,
  ],
})
export class AppModule {}
