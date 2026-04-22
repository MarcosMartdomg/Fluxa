import { Provider } from '../types/integration';

export interface ProviderDefinition {
  id: Provider;
  label: string;
  color: string;
  resources: string[];
}

export const INTEGRATION_REGISTRY: Record<string, ProviderDefinition> = {
  google: {
    id: 'google',
    label: 'Google Workspace',
    color: 'bg-red-500',
    resources: ['spreadsheet', 'document', 'file']
  },
  microsoft: {
    id: 'microsoft',
    label: 'Microsoft 365',
    color: 'bg-blue-600',
    resources: ['spreadsheet', 'document', 'email']
  },
  http: {
    id: 'http',
    label: 'Custom API / HTTP',
    color: 'bg-zinc-700',
    resources: ['api_endpoint']
  },
  slack: {
    id: 'slack',
    label: 'Slack',
    color: 'bg-[#4A154B]',
    resources: ['api_endpoint']
  },
  discord: {
    id: 'discord',
    label: 'Discord',
    color: 'bg-[#5865F2]',
    resources: ['api_endpoint']
  },
  shopify: {
    id: 'shopify',
    label: 'Shopify',
    color: 'bg-[#95BF47]',
    resources: ['api_endpoint']
  }
};
