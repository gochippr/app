import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { PlaidLink, usePlaidEmitter } from 'react-native-plaid-link-sdk';
import PlaidService, { LinkTokenResponse, PublicTokenExchangeResponse } from '@/services/plaidService';

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

  const handleSuccess = async (publicToken: string, metadata: any) => {
    setIsLinking(true);
    try {
      const institutionId = metadata?.institution?.institution_id;
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

  const handleExit = (error: any, metadata: any) => {
    console.log('Plaid Link exited:', error, metadata);
    if (error) {
      onError('Bank connection was cancelled or failed');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600 text-lg">Initializing bank connection...</Text>
      </View>
    );
  }

  if (!linkToken) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center mb-4">
          Failed to initialize bank connection
        </Text>
        <Pressable
          onPress={createLinkToken}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {isLinking && (
        <View className="absolute inset-0 bg-black bg-opacity-50 items-center justify-center z-10">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-gray-800 text-lg font-semibold">
              Connecting your bank account...
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Please wait while we securely connect your account.
            </Text>
          </View>
        </View>
      )}
      
      <PlaidLink
        tokenConfig={{
          token: linkToken,
        }}
        onSuccess={handleSuccess}
        onExit={handleExit}
      >
        <View className="flex-1 items-center justify-center p-6">
          <View className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
              Connect Your Bank
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Securely connect your bank account to view your transactions and manage your finances.
            </Text>
            
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <Text className="text-blue-800 text-sm font-medium mb-1">
                🔒 Secure & Private
              </Text>
              <Text className="text-blue-700 text-xs">
                Your bank credentials are never stored. We use bank-level security to protect your data.
              </Text>
            </View>

            <View className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Text className="text-green-800 text-sm font-medium mb-1">
                📊 View Transactions
              </Text>
              <Text className="text-green-700 text-xs">
                Get insights into your spending patterns and financial health.
              </Text>
            </View>
          </View>
        </View>
      </PlaidLink>
    </View>
  );
} 