import PlaidConnectCard from "@/components/PlaidConnectCard";
import { useAuth } from "@/context/auth";
import MockProtectedApi from "@/services/mockProtectedApi";
import UserAccountsService, {
  UserAccountsResponse,
} from "@/services/userAccountsService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function HomePage() {
  const [protectedData, setProtectedData] = useState({});
  const [userAccounts, setUserAccounts] = useState<UserAccountsResponse | null>(
    null
  );
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const { user, signOut, fetchWithAuth } = useAuth();
  const router = useRouter();

  // Fetch user accounts when component mounts
  useEffect(() => {
    if (user) {
      fetchUserAccounts();
    }
  }, [user]);

  const fetchUserAccounts = async () => {
    setIsLoadingAccounts(true);
    setAccountsError(null);

    try {
      const accountsData =
        await UserAccountsService.getUserAccounts(fetchWithAuth);
      setUserAccounts(accountsData);
      console.log("User accounts loaded:", accountsData);
    } catch (error) {
      console.error("Error fetching user accounts:", error);
      setAccountsError(
        error instanceof Error ? error.message : "Failed to load accounts"
      );
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Calculate total balance from all accounts

  return (
    <View className="flex-1 bg-gray-100">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="bg-green-900 px-5 pt-4 pb-6 rounded-b-3xl shadow-lg">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-base text-blue-200 mb-1">Welcome back,</Text>
              <Text className="text-3xl font-bold text-gray-100">{user?.name || "User"}!</Text>
            </View>
            <Pressable onPress={handleSignOut} className="w-11 h-11 bg-blue-200/20 rounded-full justify-center items-center">
              <Ionicons name="log-out-outline" size={24} color="#EFEFEF" />
            </Pressable>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingAccounts}
              onRefresh={fetchUserAccounts}
              colors={["#203627"]}
              tintColor="#203627"
            />
          }
        >
          {/* Quick Stats */}
          <View className="flex-row px-5 pt-6 gap-4">
            <View className="flex-1 p-5 rounded-2xl items-center bg-lime-300 shadow-sm">
              <Text className="text-4xl mb-2">💰</Text>
              <Text className="text-sm text-green-900 opacity-70 mb-1">Total Balance</Text>
              <Text className="text-2xl font-bold text-green-900">
                {isLoadingAccounts && !userAccounts ? "Loading..." : `$${0}`}
              </Text>
            </View>
            <View className="flex-1 p-5 rounded-2xl items-center bg-blue-300 shadow-sm">
              <Text className="text-4xl mb-2">🏦</Text>
              <Text className="text-sm text-green-900 opacity-70 mb-1">Accounts</Text>
              <Text className="text-2xl font-bold text-green-900">
                {isLoadingAccounts && !userAccounts
                  ? "..."
                  : userAccounts?.total_accounts || 0}
              </Text>
            </View>
          </View>

          {/* Loading State */}
          {isLoadingAccounts && !userAccounts && (
            <View className="m-5 p-5 bg-gray-200 rounded-xl items-center justify-center">
              <Text className="text-lg font-bold text-green-900 mb-2">Loading your accounts...</Text>
              <Text className="text-sm text-green-900 opacity-60">
                This may take a moment on first sync
              </Text>
            </View>
          )}

          {/* Accounts Status */}
          {accountsError && (
            <View className="m-5 p-4 bg-red-50 rounded-xl border border-red-300 items-center">
              <Text className="text-red-500 text-sm text-center mb-2">
                Error loading accounts: {accountsError}
              </Text>
              <Pressable onPress={fetchUserAccounts} className="bg-red-500 py-2 px-5 rounded-lg">
                <Text className="text-white text-sm font-semibold">Retry</Text>
              </Pressable>
            </View>
          )}

          {/* Account Ingestion Status */}
          {userAccounts?.ingestion_started && (
            <View className="m-5 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Text className="text-lg font-bold text-blue-900 mb-2">🔄 Account Sync</Text>
              <Text className="text-sm text-blue-700">
                {userAccounts.total_accounts} accounts synced from your banks
              </Text>
            </View>
          )}

          {/* Account Sync Status */}
          {!userAccounts?.ingestion_started &&
            userAccounts &&
            userAccounts.total_accounts > 0 && (
              <View className="m-5 p-4 bg-green-50 rounded-xl border border-green-200">
                <Text className="text-lg font-bold text-green-900 mb-2">✅ Accounts Up to Date</Text>
                <Text className="text-sm text-green-700">
                  All {userAccounts.total_accounts} accounts are synced
                </Text>
              </View>
            )}

          {/* Account Details */}
          {userAccounts && userAccounts.accounts.length > 0 && (
            <View className="m-5">
              <Text className="text-xl font-bold text-green-900 mb-4">Your Accounts</Text>
            </View>
          )}

          {/* Plaid Integration */}
          <View className="m-5">
            <PlaidConnectCard />
          </View>

          {/* Recent Activity */}
          <View className="m-5">
            <Text className="text-xl font-bold text-green-900 mb-4">Recent Activity</Text>
            <View className="bg-white p-4 rounded-xl mb-3 flex-row items-center border border-gray-200">
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                <Text>🍕</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">Pizza with friends</Text>
                <Text className="text-sm text-gray-500">Split 4 ways</Text>
              </View>
              <Text className="text-base font-bold text-red-500">-$12.50</Text>
            </View>
            <View className="bg-white p-4 rounded-xl mb-3 flex-row items-center border border-gray-200">
              <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center mr-3">
                <Text>☕</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">Morning coffee</Text>
                <Text className="text-sm text-gray-500">Today at 8:30 AM</Text>
              </View>
              <Text className="text-base font-bold text-red-500">-$4.75</Text>
            </View>
          </View>

          {/* Debug Section - Remove in production */}
          <View className="m-5 p-4 bg-gray-100 rounded-xl border border-gray-300">
            <Text className="text-lg font-bold text-gray-900 mb-2">Debug - Protected Data:</Text>
            <Text className="text-xs text-gray-700 mb-3 font-mono">
              {JSON.stringify(protectedData, null, 2)}
            </Text>
            <Pressable
              onPress={async () => {
                try {
                  const data =
                    await MockProtectedApi.getProtectedData(fetchWithAuth);
                  console.log("Protected data:", data);
                  setProtectedData(data);
                } catch (error) {
                  console.error("Error fetching protected data:", error);
                }
              }}
              className="bg-gray-600 py-2 px-4 rounded-lg"
            >
              <Text className="text-white text-sm font-semibold text-center">Fetch Protected Data</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
