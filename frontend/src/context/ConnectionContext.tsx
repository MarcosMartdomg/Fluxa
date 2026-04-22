import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Provider } from '../types/integration';

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
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connections, setConnections] = useState<Record<Provider, UserConnection | null>>({
    google: null,
    microsoft: null,
    http: null,
    custom: null
  });

  const connect = async (provider: Provider) => {
    // Simulate OAuth2 Flow
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setConnections(prev => ({
          ...prev,
          [provider]: {
            id: `conn_${Date.now()}`,
            provider,
            email: `user@${provider === 'google' ? 'gmail.com' : 'outlook.com'}`,
            status: 'valid'
          }
        }));
        resolve();
      }, 1500);
    });
  };

  const disconnect = (provider: Provider) => {
    setConnections(prev => ({ ...prev, [provider]: null }));
  };

  const isConnected = (provider: Provider) => !!connections[provider];

  return (
    <ConnectionContext.Provider value={{ connections, connect, disconnect, isConnected }}>
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
