import PlaidService, { PlaidTransaction } from '@/services/plaidService';
import React, { useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

interface TransactionsListProps {
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>;
}

export default function TransactionsList({ fetchWithAuth }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<PlaidTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plaidService = new PlaidService(fetchWithAuth);

  useEffect(() => {
    loadTransactions();
  }, []);
 
  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await plaidService.getRecentTransactions();
      // Get only the first 10 transactions
      setTransactions(response.transactions.slice(0, 10));
    } catch (error) {
      console.error('Error loading transactions:', error);
      setError('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadTransactions();
    setIsRefreshing(false);
  };

  const formatAmount = (amount: number, currency: string = 'USD') => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(absAmount / 100); // Plaid amounts are in cents

    return isNegative ? `-${formatted}` : formatted;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryIcon = (category: string[] | undefined) => {
    if (!category || category.length === 0) return '💳';
    
    const firstCategory = category[0].toLowerCase();
    
    if (firstCategory.includes('food') || firstCategory.includes('restaurant')) return '🍽️';
    if (firstCategory.includes('transport') || firstCategory.includes('travel')) return '🚗';
    if (firstCategory.includes('shopping') || firstCategory.includes('store')) return '🛍️';
    if (firstCategory.includes('entertainment')) return '🎬';
    if (firstCategory.includes('health') || firstCategory.includes('medical')) return '🏥';
    if (firstCategory.includes('home') || firstCategory.includes('housing')) return '🏠';
    if (firstCategory.includes('utilities')) return '⚡';
    if (firstCategory.includes('income') || firstCategory.includes('salary')) return '💰';
    
    return '💳';
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600 text-lg">Loading transactions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <Pressable
          onPress={loadTransactions}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-gray-500 text-center text-lg mb-2">
          No transactions found
        </Text>
        <Text className="text-gray-400 text-center">
          Your recent transactions will appear here
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="bg-white border-b border-gray-200 p-4">
        <Text className="text-xl font-bold text-gray-800">Recent Transactions</Text>
        <Text className="text-gray-600 text-sm mt-1">
          Last 10 transactions from your connected accounts
        </Text>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {transactions.map((transaction, index) => (
          <View 
            key={transaction.id || `transaction-${index}`} 
            className="bg-white border-b border-gray-100 p-4"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-lg">
                    {getCategoryIcon(transaction.category)}
                  </Text>
                </View>
                
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-base">
                    {transaction.name}
                  </Text>
                  {transaction.merchant_name && transaction.merchant_name !== transaction.name && (
                    <Text className="text-gray-500 text-sm">
                      {transaction.merchant_name}
                    </Text>
                  )}
                  <Text className="text-gray-400 text-xs mt-1">
                    {formatDate(transaction.date)}
                    {transaction.pending && (
                      <Text className="text-orange-500 ml-2"> • Pending</Text>
                    )}
                  </Text>
                </View>
              </View>
              
              <View className="items-end">
                <Text 
                  className={`font-semibold text-lg ${
                    transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {formatAmount(transaction.amount, transaction.iso_currency_code)}
                </Text>
                {transaction.category && transaction.category.length > 0 && (
                  <Text className="text-gray-400 text-xs mt-1">
                    {transaction.category[0]}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}
        
        <View className="p-4">
          <Text className="text-gray-400 text-center text-sm">
            Pull down to refresh
          </Text>
        </View>
      </ScrollView>
    </View>
  );
} 