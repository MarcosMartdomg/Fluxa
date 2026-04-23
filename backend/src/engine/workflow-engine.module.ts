import { Module } from '@nestjs/common';
import { WorkflowEngineService } from './workflow-engine.service';
import { BullModule } from '@nestjs/bullmq';
import { HttpRequestHandler } from './handlers/http-request.handler';
import { DelayHandler } from './handlers/delay.handler';
import { EmailHandler } from './handlers/email.handler';
import { GoogleSheetsHandler } from './handlers/google-sheets.handler';
import { ACTION_HANDLERS } from './handlers/action-handler.interface';
import { CredentialsModule } from '../modules/credentials/credentials.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'workflow-execution',
    }),
    CredentialsModule,
  ],
  providers: [
    WorkflowEngineService,
    HttpRequestHandler,
    DelayHandler,
    EmailHandler,
    GoogleSheetsHandler,
    {
      provide: ACTION_HANDLERS,
      useFactory: (...handlers) => handlers,
      inject: [HttpRequestHandler, DelayHandler, EmailHandler, GoogleSheetsHandler],
    },
  ],
  exports: [WorkflowEngineService],
})
export class WorkflowEngineModule {}
