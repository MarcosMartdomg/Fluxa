import { ActionMetadata, ResourceDefinition } from '../../types/integration';

const APPEND_ROW: ActionMetadata = {
  key: 'append_row',
  label: 'Añadir Fila',
  description: 'Añade una nueva fila al final de la hoja seleccionada.',
  inputSchema: {
    fields: [
      { id: 'spreadsheetId', label: 'ID de la Hoja', type: 'file_picker', required: true },
      { id: 'sheetName', label: 'Nombre de la Pestaña', type: 'text', placeholder: 'Hoja1', required: true },
      { id: 'values', label: 'Datos de la Fila', type: 'mapping', required: true },
    ]
  },
  outputSchema: {
    paths: [
      { path: 'updatedRange', label: 'Rango Actualizado', example: 'Hoja1!A10:Z10' },
      { path: 'rowCount', label: 'Total de Filas', example: 10 }
    ]
  }
};

const READ_ROWS: ActionMetadata = {
  key: 'read_rows',
  label: 'Leer Filas',
  description: 'Obtiene los datos de un rango específico de la hoja.',
  inputSchema: {
    fields: [
      { id: 'spreadsheetId', label: 'ID de la Hoja', type: 'file_picker', required: true },
      { id: 'range', label: 'Rango', type: 'text', placeholder: 'A1:Z100', required: true },
    ]
  },
  outputSchema: {
    paths: [
      { path: 'rows', label: 'Filas (Array)', example: [['val1', 'val2'], ['val3', 'val4']] },
      { path: 'count', label: 'Número de Filas Leídas', example: 100 }
    ]
  }
};

export const GOOGLE_SPREADSHEET_RESOURCE: ResourceDefinition = {
  type: 'spreadsheet',
  label: 'Google Sheets',
  icon: 'table',
  actions: [APPEND_ROW, READ_ROWS]
};
