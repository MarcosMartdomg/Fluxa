import { Injectable, Logger } from '@nestjs/common';
import { ActionHandler, ActionExecutionContext } from './action-handler.interface';
import { ActionType } from '@prisma/client';
import { CredentialsService } from '../../modules/credentials/credentials.service';

@Injectable()
export class GoogleSheetsHandler implements ActionHandler {
  private readonly logger = new Logger(GoogleSheetsHandler.name);
  type = ActionType.GOOGLE_SHEETS;

  constructor(private readonly credentialsService: CredentialsService) {}

  async execute(context: ActionExecutionContext): Promise<any> {
    const { config, payload, userId } = context;
    const { actionKey, spreadsheetId, sheetName, values } = config;

    this.logger.log(`Executing Google Sheets action: ${actionKey} for user ${userId}`);

    // 1. Retrieve credentials
    const connections = await this.credentialsService.findByProvider(userId, 'google');
    if (!connections || connections.length === 0) {
      throw new Error('No Google connection found for this user. Please connect your Google account.');
    }

    // Use the first connection for now
    const connection = connections[0];
    const credentials = connection.credentials as any;

    if (!credentials.accessToken) {
      throw new Error('Invalid Google credentials. Access token is missing.');
    }

    // 2. Validate input based on actionKey
    if (actionKey === 'append_row') {
      if (!spreadsheetId || !values) {
        throw new Error('Missing required fields for append_row: spreadsheetId and values are required.');
      }

      this.logger.log(`[MOCK] Appending row to sheet ${sheetName || 'default'} in spreadsheet ${spreadsheetId}`);
      
      // Simulation of real API call
      // In production, we would use googleapis package here
      // await google.sheets('v4').spreadsheets.values.append({ ... })

      return {
        success: true,
        updatedRange: `${sheetName || 'Sheet1'}!A${Math.floor(Math.random() * 100)}:Z${Math.floor(Math.random() * 100)}`,
        rowCount: 1,
        timestamp: new Date().toISOString(),
      };
    }

    if (actionKey === 'read_rows') {
      if (!spreadsheetId) {
        throw new Error('Missing required field for read_rows: spreadsheetId is required.');
      }

      this.logger.log(`[MOCK] Reading rows from spreadsheet ${spreadsheetId}`);

      return {
        success: true,
        rows: [
          ['Name', 'Email', 'Date'],
          ['John Doe', 'john@example.com', '2024-03-24'],
        ],
        count: 2,
      };
    }

    throw new Error(`Unsupported Google Sheets action: ${actionKey}`);
  }
}
