import PlaidService from '@/services/plaidService';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './auth';

interface PlaidContextType {
  hasConnectedAccounts: boolean | null;
  plaidLoading: boolean;
  error: string | null;
  checkConnectedAccounts: () => Promise<void>;
  setHasConnectedAccounts: (value: boolean) => void;
  clearError: () => void;
}

const PlaidContext = createContext<PlaidContextType | undefined>(undefined);

export function PlaidProvider({ children }: { children: React.ReactNode }) {
  const [hasConnectedAccounts, setHasConnectedAccounts] = useState<boolean | null>(null);
  const [plaidLoading, setPlaidLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { user, fetchWithAuth, isLoading: authLoading } = useAuth();

  // Simplified plaidService creation - only depend on essential auth state
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
      return;
    }

    try {
      setPlaidLoading(true);
      setError(null);
      const hasAccounts = await plaidService.hasConnectedAccounts();
      setHasConnectedAccounts(hasAccounts);
    } catch (error) {
      console.error('Error checking connected accounts:', error);
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
      setPlaidLoading(false);
    }
  };

  // Safe auto-initialization with longer delay to ensure navigation context is ready
  useEffect(() => {
    if (authLoading || hasInitialized) {
      return;
    }

    if (user && plaidService) {
      // Use a longer timeout to ensure navigation context is fully established
      const timer = setTimeout(() => {
        checkConnectedAccounts();
        setHasInitialized(true);
      }, 1000); // 1 second delay to be safe
      
      return () => clearTimeout(timer);
    } else if (!user) {
      setHasConnectedAccounts(null);
      setPlaidLoading(false);
      setHasInitialized(true);
    }
  }, [user, plaidService, authLoading, hasInitialized]);

  const clearError = () => setError(null);

  return (
    <PlaidContext.Provider
      value={{
        hasConnectedAccounts,
        plaidLoading,
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