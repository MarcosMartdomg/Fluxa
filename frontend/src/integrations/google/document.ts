import { ActionMetadata, ResourceDefinition } from '../../types/integration';

const CREATE_DOCUMENT: ActionMetadata = {
  key: 'create_document',
  label: 'Crear Documento',
  description: 'Crea un nuevo documento de Google a partir de un nombre.',
  inputSchema: {
    fields: [
      { id: 'title', label: 'Título del Documento', type: 'text', placeholder: 'Ej: Factura {{trigger.body.id}}', required: true },
      { id: 'folderId', label: 'Carpeta Destino', type: 'file_picker', required: false },
    ]
  },
  outputSchema: {
    paths: [
      { path: 'documentId', label: 'ID del Documento', example: '1abc...xyz' },
      { path: 'url', label: 'URL del Documento', example: 'https://docs.google.com/...' }
    ]
  }
};

const REPLACE_PLACEHOLDERS: ActionMetadata = {
  key: 'replace_placeholders',
  label: 'Reemplazar Variables',
  description: 'Busca y reemplaza texto en un documento (ej: {{nombre}}).',
  inputSchema: {
    fields: [
      { id: 'documentId', label: 'Documento', type: 'file_picker', required: true },
      { id: 'replacements', label: 'Mapeo de Variables', type: 'mapping', required: true },
    ]
  },
  outputSchema: {
    paths: [
      { path: 'success', label: 'Estado', example: true }
    ]
  }
};

export const GOOGLE_DOCUMENT_RESOURCE: ResourceDefinition = {
  type: 'document',
  label: 'Google Docs',
  icon: 'file-text',
  actions: [CREATE_DOCUMENT, REPLACE_PLACEHOLDERS]
};
