import { Injectable, Logger } from '@nestjs/common';
import { ActionHandler, ActionExecutionContext } from './action-handler.interface';
import { ActionType } from '@prisma/client';

@Injectable()
export class HttpRequestHandler implements ActionHandler {
  private readonly logger = new Logger(HttpRequestHandler.name);
  type = ActionType.HTTP_REQUEST;

  async execute(context: ActionExecutionContext): Promise<any> {
    const { config, payload } = context;
    const { url, method = 'POST', headers = {} } = config;

    this.logger.log(`Executing HTTP ${method} to ${url}`);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: method !== 'GET' ? JSON.stringify(payload) : undefined,
      });

      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      this.logger.error(`HTTP Request failed: ${error.message}`);
      throw error;
    }
  }
}
