import { Injectable } from '@nestjs/common';
import { ExecutionsService } from '../executions/executions.service';

@Injectable()
export class WebhooksService {
  constructor(private executionsService: ExecutionsService) {}

  async handle(workflowId: string, payload: any) {
    // Webhooks don't usually require auth in the same way, 
    // but in a real app, you'd verify a signature or API key here.
    return this.executionsService.trigger(workflowId, payload);
  }
}
