import { ActionMetadata, ResourceDefinition } from '../../types/integration';

const SEND_EMAIL: ActionMetadata = {
  key: 'send_email_outlook',
  label: 'Enviar Email (Outlook)',
  description: 'Envía un correo electrónico desde tu cuenta de Outlook.',
  inputSchema: {
    fields: [
      { id: 'to', label: 'Destinatario', type: 'text', placeholder: 'ejemplo@correo.com', required: true },
      { id: 'subject', label: 'Asunto', type: 'text', placeholder: 'Ej: Nuevo pedido {{trigger.body.id}}', required: true },
      { id: 'body', label: 'Cuerpo del Mensaje', type: 'text', placeholder: 'Escribe tu mensaje aquí...', required: true },
    ]
  },
  outputSchema: {
    paths: [
      { path: 'messageId', label: 'ID del Mensaje', example: 'AAMkAG...' },
    ]
  }
};

export const MICROSOFT_OUTLOOK_RESOURCE: ResourceDefinition = {
  type: 'email',
  label: 'Outlook Email',
  icon: 'mail',
  actions: [SEND_EMAIL]
};
