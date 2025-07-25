import { usePlaid } from '@/context/plaid';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

export default function PlaidConnectCard() {
  const router = useRouter();
  const { hasConnectedAccounts, checkConnectedAccounts, error, plaidLoading } = usePlaid();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleConnectAccount = () => {
    router.push('/(tabs)/plaid-link');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkConnectedAccounts();
    setIsRefreshing(false);
  };

  if (plaidLoading) {
    return (
      <View className="bg-white rounded-xl p-6 items-center justify-center h-48">
        <ActivityIndicator size="large" color="#203627" />
        <Text className="text-gray-600 mt-2">Checking your accounts...</Text>
      </View>
    );
  }

  if (error && !hasConnectedAccounts) {
    return (
      <View className="bg-white rounded-xl p-6">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <Pressable
          onPress={handleRefresh}
          disabled={isRefreshing}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          {isRefreshing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-center">Retry</Text>
          )}
        </Pressable>
      </View>
    );
  }

  if (!hasConnectedAccounts) {
    return (
      <View className="bg-white rounded-xl shadow-sm p-6">
        <Text className="text-2xl text-center mb-2">🏦</Text>
        <Text className="text-xl font-bold text-gray-800 text-center mb-2">
          Connect Your Bank Account
        </Text>
        <Text className="text-gray-600 text-center mb-4">
          Link your bank account to start tracking your transactions and managing your finances.
        </Text>
        
        <Pressable
          onPress={handleConnectAccount}
          className="bg-blue-500 py-3 px-6 rounded-lg"
        >
          <Text className="text-white font-semibold text-center text-lg">
            Connect Bank Account
          </Text>
        </Pressable>
        
        <Text className="text-gray-400 text-center text-xs mt-4">
          Your bank credentials are never stored. We use Plaid to securely connect to your bank.
        </Text>
      </View>
    );
  }

  // If accounts are connected, show a summary card
  return (
    <View className="bg-white rounded-xl shadow-sm p-6">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-lg font-bold text-gray-800">Bank Connected</Text>
          <Text className="text-gray-600 text-sm">Your accounts are linked</Text>
        </View>
        <Text className="text-3xl">✅</Text>
      </View>
      
      <View className="flex-row gap-2 mb-3">
        <Pressable
          onPress={() => router.push('/(tabs)/transactions')}
          className="flex-1 bg-gray-100 py-2 px-4 rounded-lg"
        >
          <Text className="text-gray-700 text-center font-medium">View Transactions</Text>
        </Pressable>
        
        <Pressable
          onPress={handleRefresh}
          disabled={isRefreshing}
          className="bg-gray-100 py-2 px-4 rounded-lg"
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color="#203627" />
          ) : (
            <Text className="text-gray-700 font-medium">Refresh</Text>
          )}
        </Pressable>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          onPress={handleConnectAccount}
          className="flex-1 bg-blue-500 py-2 px-4 rounded-lg"
        >
          <Text className="text-white text-center font-medium">Add Another Account</Text>
        </Pressable>
        
        <Pressable
          onPress={() => router.push('/(tabs)/manage-accounts')}
          className="flex-1 bg-gray-200 py-2 px-4 rounded-lg"
        >
          <Text className="text-gray-700 text-center font-medium">Manage Accounts</Text>
        </Pressable>
      </View>
    </View>
  );
}
