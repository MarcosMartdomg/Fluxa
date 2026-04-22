import { ActionMetadata, ResourceDefinition } from '../../types/integration';

const GET_PRODUCT: ActionMetadata = {
  key: 'get_shopify_product',
  label: 'Obtener Producto',
  description: 'Obtiene los detalles de un producto por su ID o SKU.',
  inputSchema: {
    fields: [
      { id: 'productId', label: 'ID del Producto', type: 'text', placeholder: 'gid://shopify/Product/12345', required: true },
    ]
  },
  outputSchema: {
    paths: [
      { path: 'title', label: 'Nombre', example: 'Camiseta Fluxa' },
      { path: 'price', label: 'Precio', example: '29.99' },
      { path: 'inventory', label: 'Stock', example: 150 }
    ]
  }
};

export const SHOPIFY_RESOURCE: ResourceDefinition = {
  type: 'api_endpoint', // Abstraction as API
  label: 'Shopify',
  icon: 'shopping-bag',
  actions: [GET_PRODUCT]
};
