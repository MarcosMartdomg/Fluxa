import { Injectable, Logger } from '@nestjs/common';
import { ActionHandler, ActionExecutionContext } from './action-handler.interface';
import { ActionType } from '@prisma/client';

@Injectable()
export class DelayHandler implements ActionHandler {
  private readonly logger = new Logger(DelayHandler.name);
  type = ActionType.DELAY;

  async execute(context: ActionExecutionContext): Promise<any> {
    const { config, payload } = context;
    const { seconds = 5 } = config;

    this.logger.log(`Waiting for ${seconds} seconds...`);

    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));

    this.logger.log(`Delay completed.`);
    return payload; // Delays usually just pass the payload through
  }
}
