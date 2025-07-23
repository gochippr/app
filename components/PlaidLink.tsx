import PlaidService, { LinkTokenResponse, PublicTokenExchangeResponse } from '@/services/plaidService';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinkExit, LinkSuccess, PlaidLink, usePlaidEmitter } from 'react-native-plaid-link-sdk';

interface PlaidLinkComponentProps {
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PlaidLinkComponent({ 
  fetchWithAuth, 
  onSuccess, 
  onError 
}: PlaidLinkComponentProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  const plaidService = new PlaidService(fetchWithAuth);

  // Listen to Plaid events
  usePlaidEmitter((event) => {
    console.log('Plaid event:', event);
  });

  // Create link token when component mounts
  useEffect(() => {
    createLinkToken();
  }, []);

  const createLinkToken = async () => {
    setIsLoading(true);
    try {
      const response: LinkTokenResponse = await plaidService.createLinkToken();
      setLinkToken(response.link_token);
    } catch (error) {
      console.error('Error creating link token:', error);
      onError('Failed to initialize bank connection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = async (success: LinkSuccess) => {
    setIsLinking(true);
    try {
      const { publicToken, metadata } = success;
      const institutionId = metadata?.institution?.id;
      const institutionName = metadata?.institution?.name;

      const response: PublicTokenExchangeResponse = await plaidService.exchangePublicToken(
        publicToken,
        institutionId,
        institutionName
      );

      console.log('Successfully connected account:', response);
      onSuccess();
    } catch (error) {
      console.error('Error exchanging public token:', error);
      onError('Failed to connect bank account');
    } finally {
      setIsLinking(false);
    }
  };

  const handleExit = (linkExit: LinkExit) => {
    console.log('Plaid Link exited:', linkExit);
    if (linkExit.error) {
      onError('Bank connection was cancelled or failed');
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#203627', fontSize: 18, opacity: 0.6 }}>Initializing bank connection...</Text>
      </View>
    );
  }

  if (!linkToken) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text style={{ color: '#DC2626', textAlign: 'center', marginBottom: 16, fontSize: 16 }}>
          Failed to initialize bank connection
        </Text>
        <Pressable
          onPress={createLinkToken}
          style={{ backgroundColor: '#203627', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 }}
        >
          <Text style={{ color: '#EFEFEF', fontWeight: '600', fontSize: 16 }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isLinking && (
        <View style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(32, 54, 39, 0.5)', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 10 
        }}>
          <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 16, shadowColor: '#203627', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 }}>
            <Text style={{ color: '#203627', fontSize: 18, fontWeight: '600' }}>
              Connecting your bank account...
            </Text>
            <Text style={{ color: '#203627', textAlign: 'center', marginTop: 8, opacity: 0.6 }}>
              Please wait while we securely connect your account.
            </Text>
          </View>
        </View>
      )}
      
      {/* Custom UI explaining what will happen */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 20, 
          shadowColor: '#203627',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 8,
          padding: 24, 
          width: '100%', 
          maxWidth: 350, 
          marginBottom: 24 
        }}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: '#203627', textAlign: 'center', marginBottom: 8 }}>
            Connect Your Bank
          </Text>
          <Text style={{ color: '#203627', textAlign: 'center', marginBottom: 24, opacity: 0.7, fontSize: 16 }}>
            Securely connect your bank account to view your transactions and manage your finances.
          </Text>
          
          <View style={{ backgroundColor: '#9DC4D5', borderRadius: 16, padding: 16, marginBottom: 16, opacity: 0.9 }}>
            <Text style={{ color: '#203627', fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
              🔒 Secure & Private
            </Text>
            <Text style={{ color: '#203627', fontSize: 12, opacity: 0.8 }}>
              Your bank credentials are never stored. We use bank-level security to protect your data.
            </Text>
          </View>

          <View style={{ backgroundColor: '#E8FF40', borderRadius: 16, padding: 16, opacity: 0.9 }}>
            <Text style={{ color: '#203627', fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
              📊 View Transactions
            </Text>
            <Text style={{ color: '#203627', fontSize: 12, opacity: 0.8 }}>
              Get insights into your spending patterns and financial health.
            </Text>
          </View>
        </View>

        {/* PlaidLink component - touch events handled directly by PlaidLink */}
        <PlaidLink
          tokenConfig={{
            token: linkToken,
            noLoadingState: false,
          }}
          onSuccess={handleSuccess}
          onExit={handleExit}
        >
          <View style={{ 
            backgroundColor: '#203627', 
            paddingVertical: 14, 
            paddingHorizontal: 32, 
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{ color: '#EFEFEF', fontWeight: '600', textAlign: 'center', fontSize: 16 }}>
              Continue to Bank Selection
            </Text>
          </View>
        </PlaidLink>
      </View>
    </View>
  );
} 