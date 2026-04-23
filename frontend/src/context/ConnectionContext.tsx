import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Provider } from '../types/integration';
import api from '../services/api';

interface UserConnection {
  id: string;
  provider: Provider;
  email: string;
  status: 'valid' | 'expired';
}

interface ConnectionContextType {
  connections: Record<Provider, UserConnection | null>;
  connect: (provider: Provider) => Promise<void>;
  disconnect: (provider: Provider) => void;
  isConnected: (provider: Provider) => boolean;
  loading: boolean;
}

const PROVIDERS: Provider[] = ['google', 'microsoft', 'slack', 'discord', 'shopify', 'http', 'custom'];

const emptyConnections = (): Record<Provider, UserConnection | null> =>
  Object.fromEntries(PROVIDERS.map(p => [p, null])) as Record<Provider, UserConnection | null>;

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connections, setConnections] = useState<Record<Provider, UserConnection | null>>(emptyConnections());
  const [loading, setLoading] = useState(true);

  // Load existing connections from backend on mount
  useEffect(() => {
    const loadConnections = async () => {
      try {
        const result = emptyConnections();
        for (const provider of PROVIDERS) {
          try {
            const response = await api.get(`/credentials/${provider}`);
            const list = response.data;
            if (list && list.length > 0) {
              const conn = list[0];
              result[provider] = {
                id: conn.id,
                provider,
                email: (conn.credentials as any)?.email || `${provider} account`,
                status: 'valid',
              };
            }
          } catch {
            // No connections for this provider — that's fine
          }
        }
        setConnections(result);
      } catch (error) {
        console.error('Failed to load connections:', error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('access_token');
    if (token) {
      loadConnections();
    } else {
      setLoading(false);
    }
  }, []);

  const connect = async (provider: Provider) => {
    // Create a placeholder connection via the real API
    // In production, this would be replaced by an OAuth redirect flow
    const response = await api.post('/credentials', {
      providerId: provider,
      name: 'default',
      credentials: {
        accessToken: `placeholder_${provider}_${Date.now()}`,
        email: `user@${provider === 'google' ? 'gmail.com' : provider === 'microsoft' ? 'outlook.com' : `${provider}.com`}`,
      },
    });

    const conn = response.data;
    setConnections(prev => ({
      ...prev,
      [provider]: {
        id: conn.id,
        provider,
        email: (conn.credentials as any)?.email || `${provider} account`,
        status: 'valid',
      },
    }));
  };

  const disconnect = async (provider: Provider) => {
    const conn = connections[provider];
    if (conn) {
      try {
        await api.delete(`/credentials/${conn.id}`);
      } catch (error) {
        console.error(`Failed to delete connection for ${provider}:`, error);
      }
    }
    setConnections(prev => ({ ...prev, [provider]: null }));
  };

  const isConnected = (provider: Provider) => !!connections[provider];

  return (
    <ConnectionContext.Provider value={{ connections, connect, disconnect, isConnected, loading }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnections = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
};
