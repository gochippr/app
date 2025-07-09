import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import PlaidService from '@/services/plaidService';
import PlaidLinkComponent from './PlaidLink';
import TransactionsList from './TransactionsList';

interface PlaidManagerProps {
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>;
}

export default function PlaidManager({ fetchWithAuth }: PlaidManagerProps) {
  const [hasConnectedAccounts, setHasConnectedAccounts] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlaidLink, setShowPlaidLink] = useState(false);

  const plaidService = new PlaidService(fetchWithAuth);

  useEffect(() => {
    checkConnectedAccounts();
  }, []);

  const checkConnectedAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const hasAccounts = await plaidService.hasConnectedAccounts();
      setHasConnectedAccounts(hasAccounts);
    } catch (error) {
      console.error('Error checking connected accounts:', error);
      setError('Failed to check connected accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaidSuccess = () => {
    setShowPlaidLink(false);
    setHasConnectedAccounts(true);
  };

  const handlePlaidError = (errorMessage: string) => {
    setError(errorMessage);
    setShowPlaidLink(false);
  };

  const handleConnectAccount = () => {
    setShowPlaidLink(true);
    setError(null);
  };

  const handleRefresh = () => {
    checkConnectedAccounts();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600 text-lg">Checking your accounts...</Text>
      </View>
    );
  }

  if (error && !showPlaidLink) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <View className="flex-row space-x-2">
          <Pressable
            onPress={handleRefresh}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </Pressable>
          <Pressable
            onPress={handleConnectAccount}
            className="bg-green-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Connect Account</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (showPlaidLink) {
    return (
      <PlaidLinkComponent
        fetchWithAuth={fetchWithAuth}
        onSuccess={handlePlaidSuccess}
        onError={handlePlaidError}
      />
    );
  }

  if (hasConnectedAccounts === false) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-gray-50">
        <View className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Text className="text-2xl">🏦</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800 text-center mb-2">
              Connect Your Bank Account
            </Text>
            <Text className="text-gray-600 text-center">
              Link your bank account to start tracking your transactions and managing your finances.
            </Text>
          </View>

          <View className="space-y-3 mb-6">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                <Text className="text-green-600 text-sm">✓</Text>
              </View>
              <Text className="text-gray-700 flex-1">View recent transactions</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                <Text className="text-green-600 text-sm">✓</Text>
              </View>
              <Text className="text-gray-700 flex-1">Track spending patterns</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                <Text className="text-green-600 text-sm">✓</Text>
              </View>
              <Text className="text-gray-700 flex-1">Bank-level security</Text>
            </View>
          </View>

          <Pressable
            onPress={handleConnectAccount}
            className="bg-blue-500 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold text-center text-lg">
              Connect Bank Account
            </Text>
          </Pressable>

          <Text className="text-gray-400 text-center text-xs mt-4">
            Your bank credentials are never stored. We use Plaid to securely connect to your bank.
          </Text>
        </View>
      </View>
    );
  }

  if (hasConnectedAccounts === true) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-white border-b border-gray-200 p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-gray-800">Your Finances</Text>
              <Text className="text-gray-600 text-sm">Connected accounts</Text>
            </View>
            <Pressable
              onPress={handleRefresh}
              className="bg-gray-100 px-3 py-1 rounded-lg"
            >
              <Text className="text-gray-700 text-sm">Refresh</Text>
            </Pressable>
          </View>
        </View>
        
        <TransactionsList fetchWithAuth={fetchWithAuth} />
      </View>
    );
  }

  return null;
} 