import PlaidService from '@/services/plaidService';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './auth';

interface PlaidContextType {
  hasConnectedAccounts: boolean | null;
  isLoading: boolean;
  error: string | null;
  checkConnectedAccounts: () => Promise<void>;
  setHasConnectedAccounts: (value: boolean) => void;
  clearError: () => void;
}

const PlaidContext = createContext<PlaidContextType | undefined>(undefined);

export function PlaidProvider({ children }: { children: React.ReactNode }) {
  const [hasConnectedAccounts, setHasConnectedAccounts] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, fetchWithAuth, isLoading: authLoading } = useAuth();

  // Don't create plaidService until auth is ready
  const plaidService = useMemo(() => {
    if (!fetchWithAuth || authLoading) return null;
    try {
      return new PlaidService(fetchWithAuth);
    } catch (err) {
      console.error('Error creating PlaidService:', err);
      return null;
    }
  }, [fetchWithAuth, authLoading]);

  const checkConnectedAccounts = async () => {
    if (!plaidService) {
      console.error('PlaidService not initialized');
      setError('Service not initialized');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const hasAccounts = await plaidService.hasConnectedAccounts();
      setHasConnectedAccounts(hasAccounts);
    } catch (error) {
      console.error('Error checking connected accounts:', error);
      // Check if it's a network/auth error vs other errors
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('403')) {
          setError('Authentication required');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          setError('Network error - please check your connection');
        } else {
          setError('Failed to check connected accounts');
        }
      } else {
        setError('Failed to check connected accounts');
      }
      setHasConnectedAccounts(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth to be ready before checking accounts
    if (authLoading) {
      return;
    }

    if (user && plaidService) {
      checkConnectedAccounts();
    } else if (!user) {
      setHasConnectedAccounts(null);
      setIsLoading(false);
    }
  }, [user, plaidService, authLoading]);

  const clearError = () => setError(null);

  return (
    <PlaidContext.Provider
      value={{
        hasConnectedAccounts,
        isLoading,
        error,
        checkConnectedAccounts,
        setHasConnectedAccounts,
        clearError,
      }}
    >
      {children}
    </PlaidContext.Provider>
  );
}

export function usePlaid() {
  const context = useContext(PlaidContext);
  if (context === undefined) {
    throw new Error('usePlaid must be used within a PlaidProvider');
  }
  return context;
}