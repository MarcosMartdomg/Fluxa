import { ActionMetadata, ResourceDefinition } from '../../types/integration';

const SEND_MESSAGE: ActionMetadata = {
  key: 'send_slack_message',
  label: 'Enviar Mensaje',
  description: 'Envía un mensaje a un canal de Slack o usuario.',
  inputSchema: {
    fields: [
      { id: 'channel', label: 'Canal / ID', type: 'text', placeholder: 'Ej: #general o C12345', required: true },
      { id: 'text', label: 'Mensaje', type: 'text', placeholder: 'Ej: Nuevo pedido de {{trigger.body.name}}!', required: true },
    ]
  },
  outputSchema: {
    paths: [
      { path: 'ts', label: 'Timestamp del Mensaje', example: '123456789.0001' },
      { path: 'channel', label: 'ID del Canal', example: 'C12345' }
    ]
  }
};

export const SLACK_RESOURCE: ResourceDefinition = {
  type: 'api_endpoint',
  label: 'Slack',
  icon: 'message-square',
  actions: [SEND_MESSAGE]
};
