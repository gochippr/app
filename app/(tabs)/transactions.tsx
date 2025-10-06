import LoadingLayout from "@/components/LoadingLayout";
import TransactionsList from "@/components/TransactionsList";
import { useAuth } from "@/context/auth";
import { Transaction, getTransactions } from "@/services/transactionService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { fetchWithAuth } = useAuth();
  const router = useRouter();

  const loadTransactions = async () => {
    if (!fetchWithAuth) return;
    try {
      const data = await getTransactions(fetchWithAuth);
      console.log("Fetched transactions:", data);
      if (data) {
        setTransactions(data);
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <LoadingLayout isLoading={loading}>
      <View>
        <Text className="text-2xl font-bold mb-4">Transactions</Text>
      </View>
      <ScrollView className="h-full w-full p-4">
        <TransactionsList transactions={transactions} />
      </ScrollView>
    </LoadingLayout>
  );
}
