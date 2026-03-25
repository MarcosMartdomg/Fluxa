import { Injectable, Logger } from '@nestjs/common';
import { ActionHandler, ActionExecutionContext } from './action-handler.interface';
import { ActionType } from '@prisma/client';

@Injectable()
export class EmailHandler implements ActionHandler {
  private readonly logger = new Logger(EmailHandler.name);
  type = ActionType.EMAIL;

  async execute(context: ActionExecutionContext): Promise<any> {
    const { config, payload } = context;
    const { to, subject, body } = config;

    this.logger.log(`[MOCK EMAIL] Sending email to: ${to}`);
    this.logger.log(`[MOCK EMAIL] Subject: ${subject}`);
    this.logger.log(`[MOCK EMAIL] Body: ${body}`);
    this.logger.log(`[MOCK EMAIL] Context Payload: ${JSON.stringify(payload)}`);

    // In a real implementation, we would use a service like SendGrid, Amazon SES, or Nodemailer.
    // For now, we mock the success.
    return {
      sent: true,
      to,
      timestamp: new Date().toISOString(),
    };
  }
}
