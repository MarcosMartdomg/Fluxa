import { Provider, MaturityLevel } from '../types/integration';

export interface ProviderDefinition {
  id: Provider;
  label: string;
  color: string;
  maturity: MaturityLevel;
  resources: string[];
}

export const INTEGRATION_REGISTRY: Record<string, ProviderDefinition> = {
  google: {
    id: 'google',
    label: 'Google Workspace',
    color: 'bg-red-500',
    maturity: 'backend-ready',
    resources: ['spreadsheet', 'document', 'file']
  },
  microsoft: {
    id: 'microsoft',
    label: 'Microsoft 365',
    color: 'bg-blue-600',
    maturity: 'ui-only',
    resources: ['spreadsheet', 'document', 'email']
  },
  http: {
    id: 'http',
    label: 'Custom API / HTTP',
    color: 'bg-zinc-700',
    maturity: 'functional',
    resources: ['api_endpoint']
  },
  slack: {
    id: 'slack',
    label: 'Slack',
    color: 'bg-[#4A154B]',
    maturity: 'ui-only',
    resources: ['api_endpoint']
  },
  discord: {
    id: 'discord',
    label: 'Discord',
    color: 'bg-[#5865F2]',
    maturity: 'ui-only',
    resources: ['api_endpoint']
  },
  shopify: {
    id: 'shopify',
    label: 'Shopify',
    color: 'bg-[#95BF47]',
    maturity: 'ui-only',
    resources: ['api_endpoint']
  }
};
