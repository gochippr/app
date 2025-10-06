import { MonthlyBudget } from "@/components/Home/monthlyBudget";
import { SpendingInsights } from "@/components/Home/spendingInsights";
import LoadingLayout from "@/components/LoadingLayout";
import { useAuth } from "@/context/auth";
import {
  getAccounts,
  getUserBalance,
  UserBalance,
} from "@/services/accountService";
import {
  getTransactionSummary,
  TransactionSummaryResponse,
} from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [transactionSummary, setTransactionSummary] =
    useState<TransactionSummaryResponse | null>(null);
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);

  const { user, signOut, fetchWithAuth } = useAuth();
  const router = useRouter();

  const loadTransactionSummary = async () => {
    if (!fetchWithAuth) return;
    try {
      const summary = await getTransactionSummary(fetchWithAuth);
      setTransactionSummary(summary);
    } catch (error) {
      console.error("Error fetching transaction summary:", error);
    }
  };

  const loadUserBalance = async () => {
    if (!fetchWithAuth) return;
    try {
      const balance = await getUserBalance(fetchWithAuth);
      setUserBalance(balance);
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };

  const init = async () => {
    if (!fetchWithAuth) return;
    setLoading(true);
    try {
      const accounts = await getAccounts(fetchWithAuth);
      console.log("Fetched accounts:", accounts);
      if (accounts.length === 0) {
        console.log("No linked accounts found, redirecting to Plaid Link");
        router.push("/(tabs)/plaid-link");
      }

      await Promise.all([loadTransactionSummary(), loadUserBalance()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <LoadingLayout isLoading={loading}>
      <View className="w-full h-full px-4 py-8 flex-col items-center justify-between">
        {/* Header */}
        <View className="w-full flex-row justify-between items-center">
          <View className="flex-col justify-center items-start">
            <Text className="text-3xl font-bold text-[#253628]">
              Good morning!
            </Text>
            <Text className="text-xl font-medium text-[#4D5562]">
              Here's your financial overview
            </Text>
          </View>
          <Pressable onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} />
          </Pressable>
        </View>
        <MonthlyBudget transactionSummary={transactionSummary} userBalance={userBalance} />
        <SpendingInsights transactionSummary={transactionSummary} />
      </View>
    </LoadingLayout>
  );
}
