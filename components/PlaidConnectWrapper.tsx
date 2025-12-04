/**
 * Plaid Connect Wrapper
 * 
 * Automatically switches between real Plaid Link and mock Plaid Link
 * based on the USE_MOCK_DATA configuration.
 */

import { USE_MOCK_DATA } from '@/mocks/config';
import MockPlaidLink from './MockPlaidLink';
import PlaidLinkComponent from './PlaidLink';

interface PlaidConnectWrapperProps {
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>;
  onSuccess: () => void;
  onError: (error: string) => void;
  relinkMode?: boolean;
  relinkInstitutionId?: string;
}

export default function PlaidConnectWrapper(props: PlaidConnectWrapperProps) {
  if (USE_MOCK_DATA) {
    return <MockPlaidLink {...props} />;
  }
  
  return <PlaidLinkComponent {...props} />;
}

