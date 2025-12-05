import { MonthlyBudget } from "@/components/Home/monthlyBudget";
import { SpendingInsights } from "@/components/Home/spendingInsights";
import LoadingLayout from "@/components/LoadingLayout";
import { useAuth } from "@/context/auth";
import { BudgetRunBoard } from "@/features/budgetRun";
import {
  getAccounts,
  getUserBalance,
  UserBalance,
} from "@/services/accountService";
import {
  GameBoardResponse,
  getBudgetRunStatus,
} from "@/services/budgetRunService";
import {
  getTransactionSummary,
  TransactionSummaryResponse,
} from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View, ScrollView } from "react-native";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [transactionSummary, setTransactionSummary] =
    useState<TransactionSummaryResponse | null>(null);
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);
  const [budgetRunData, setBudgetRunData] = useState<GameBoardResponse | null>(null);
  
  const { user, signOut, fetchWithAuth } = useAuth();
  const router = useRouter();
  const { refresh } = useLocalSearchParams();

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

  const loadBudgetRunData = async () => {
    if (!fetchWithAuth) return;
    try {
      const data = await getBudgetRunStatus(fetchWithAuth);
      setBudgetRunData(data);
    } catch (error) {
      console.error("Error fetching budget run data:", error);
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

      await Promise.all([
        loadTransactionSummary(),
        loadUserBalance(),
        loadBudgetRunData(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, [refresh]);

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
      <ScrollView 
        className="w-full h-full" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="w-full flex-row justify-between items-center px-4 pt-8 pb-4">
          <View className="flex-col justify-center items-start">
            <Text className="text-3xl font-bold text-[#253628]">
              Good morning!
            </Text>
            <Text className="text-xl font-medium text-[#4D5562]">
              Here's your financial overview
            </Text>
          </View>
          <Pressable onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#203627" />
          </Pressable>
        </View>
        
        {/* Daily Budget Run - Primary Feature */}
        <BudgetRunBoard gameData={budgetRunData} />
        
        {/* Financial Overview */}
        <View className="px-4 mt-4">
          <MonthlyBudget transactionSummary={transactionSummary} userBalance={userBalance} />
        </View>
        
        <View className="px-4 mt-4">
          <SpendingInsights transactionSummary={transactionSummary} />
        </View>
      </ScrollView>
    </LoadingLayout>
  );
}
