import LoadingLayout from "@/components/LoadingLayout";
import TransactionsList from "@/components/TransactionsList";
import { useAuth } from "@/context/auth";
import { Transaction, getTransactions } from "@/services/transactionService";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { fetchWithAuth } = useAuth();

  const loadTransactions = useCallback(async () => {
    if (!fetchWithAuth) return;
    setLoading(true);
    try {
      const data = await getTransactions(fetchWithAuth);
      setTransactions(data ?? []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions])
  );

  return (
    <LoadingLayout isLoading={loading}>
      <View className="w-full h-full px-4 pt-8 pb-1 flex-col items-center">
          <Text className="w-full text-3xl font-bold text-[#253628] mb-4">
            Transactions
          </Text>
        <ScrollView className="h-full w-full" showsVerticalScrollIndicator={false}>
          <TransactionsList transactions={transactions} />
        </ScrollView>
      </View>
    </LoadingLayout>
  );
}
