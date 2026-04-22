import { ActionMetadata, ResourceDefinition } from '../../types/integration';

const SEND_CHANNEL_MESSAGE: ActionMetadata = {
  key: 'send_discord_message',
  label: 'Enviar Mensaje a Canal',
  description: 'Envía un mensaje a un servidor de Discord vía Webhook o Bot.',
  inputSchema: {
    fields: [
      { id: 'webhookUrl', label: 'URL del Webhook', type: 'text', placeholder: 'https://discord.com/api/webhooks/...', required: true },
      { id: 'content', label: 'Contenido', type: 'text', placeholder: 'Ej: 🚀 ¡Nueva venta en Shopify!', required: true },
      { id: 'username', label: 'Nombre del Bot', type: 'text', placeholder: 'Fluxa Bot', required: false },
    ]
  },
  outputSchema: {
    paths: [
      { path: 'success', label: 'Estado', example: true }
    ]
  }
};

export const DISCORD_RESOURCE: ResourceDefinition = {
  type: 'api_endpoint',
  label: 'Discord',
  icon: 'hash',
  actions: [SEND_CHANNEL_MESSAGE]
};
