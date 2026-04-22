import { ActionMetadata, ResourceDefinition } from '../../types/integration';

const APPEND_ROW_EXCEL: ActionMetadata = {
  key: 'append_row_excel',
  label: 'Añadir Fila (Excel)',
  description: 'Añade una fila a una tabla de Excel Online.',
  inputSchema: {
    fields: [
      { id: 'workbookId', label: 'Libro de Excel', type: 'file_picker', required: true },
      { id: 'tableName', label: 'Nombre de la Tabla', type: 'text', placeholder: 'Tabla1', required: true },
      { id: 'values', label: 'Datos de la Fila', type: 'mapping', required: true },
    ]
  },
  outputSchema: {
    paths: [
      { path: 'index', label: 'Índice de Fila', example: 50 },
    ]
  }
};

export const MICROSOFT_EXCEL_RESOURCE: ResourceDefinition = {
  type: 'spreadsheet',
  label: 'Excel Online',
  icon: 'table',
  actions: [APPEND_ROW_EXCEL]
};
