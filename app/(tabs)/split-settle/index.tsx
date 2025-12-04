import React, { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";

import { useAuth } from "@/context/auth";
import {
  FriendSplitSummary,
  FriendsSplitSummaryResponse,
  getFriendSplitSummaries,
} from "@/services/splitService";

const formatCurrency = (value: number | undefined | null) => `$${(value ?? 0).toFixed(2)}`;

export default function SplitSettleHome() {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  const [data, setData] = useState<FriendsSplitSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!fetchWithAuth) return;
    setLoading(true);
    try {
      const response = await getFriendSplitSummaries(fetchWithAuth);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load split summary");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchWithAuth]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = useCallback(() => {
    if (!fetchWithAuth) return;
    setRefreshing(true);
    loadData();
  }, [fetchWithAuth, loadData]);

  const totals = data?.totals;
  const netPositive = useMemo(() => (totals?.net_balance ?? 0) >= 0, [totals?.net_balance]);

  return (
    <View className="flex-1 bg-[#EFEFEF]">
      <SafeAreaView className="flex-1">
        <View className="p-4">
          <Text className="w-full text-3xl font-bold text-[#253628]">
            Settlements
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          <View className="mx-5 mb-4 rounded-3xl bg-white px-5 py-5 shadow-md shadow-[#203627]/10">
            <Text className="text-lg font-semibold text-[#203627]">Grand total</Text>
            {totals ? (
              <View className="mt-4 flex-row items-center justify-between">
                <View className="flex-1 items-center">
                  <Text className="text-xs text-[#6C7280]">They owe you</Text>
                  <Text className="mt-1 text-2xl font-bold text-[#1B7A4D]">
                    {formatCurrency(totals.total_owed_to_you)}
                  </Text>
                </View>
                <View className="h-10 w-px bg-[#203627]/10" />
                <View className="flex-1 items-center">
                  <Text className="text-xs text-[#6C7280]">You owe</Text>
                  <Text className="mt-1 text-2xl font-bold text-[#B91C1C]">
                    {formatCurrency(totals.total_you_owe)}
                  </Text>
                </View>
              </View>
            ) : (
              <ActivityIndicator className="mt-4" color="#203627" />
            )}

            {totals ? (
              <View className="mt-5 flex-row items-center justify-between rounded-2xl bg-[#F5F6F5] px-4 py-3">
                <Text className="text-sm font-semibold text-[#203627]/70">Net balance</Text>
                <Text
                  className={`text-xl font-semibold ${
                    netPositive ? "text-[#1B7A4D]" : "text-[#B91C1C]"
                  }`}
                >
                  {formatCurrency(totals.net_balance)}
                </Text>
              </View>
            ) : null}
          </View>

          {error ? (
            <View className="mx-5 mb-4 rounded-2xl bg-[#FEE2E2] px-4 py-3">
              <Text className="text-sm text-[#B91C1C]">{error}</Text>
            </View>
          ) : null}

          <View className="mx-5 mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-[#203627]">Friends</Text>
            {loading ? <ActivityIndicator size="small" color="#203627" /> : null}
          </View>

          {data && data.friends.length === 0 && !loading ? (
            <View className="mx-5 mb-6 items-center rounded-2xl bg-white px-5 py-6 shadow-md shadow-[#203627]/10">
              <Text className="text-lg font-semibold text-[#203627]">No splits yet</Text>
              <Text className="mt-1 text-sm text-[#6C7280] text-center">
                Split a transaction with a friend to see it here.
              </Text>
            </View>
          ) : null}

          {data?.friends.map((friend) => (
            <FriendRow
              key={friend.friend.id}
              summary={friend}
              onPress={() => router.push(`/(tabs)/split-settle/${friend.friend.id}`)}
            />
          ))}

          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

interface FriendRowProps {
  summary: FriendSplitSummary;
  onPress: () => void;
}

const FriendRow = ({ summary, onPress }: FriendRowProps) => {
  const { friend, amount_owed_to_you, amount_you_owe, net_balance } = summary;
  const isPositive = net_balance >= 0;
  return (
    <Pressable
      onPress={onPress}
      className="mx-5 mb-3 flex-row items-center rounded-2xl bg-white p-4 shadow-md shadow-[#203627]/10"
    >
      <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-[#E8FF40]">
        <Text className="text-lg font-bold text-[#203627]">
          {friend.name?.charAt(0).toUpperCase() || friend.email.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-[#203627]">
          {friend.name || friend.email}
        </Text>
        <Text className="text-xs text-[#6C7280]">{friend.email}</Text>
        <View className="mt-2 flex-row gap-3">
          <Text className="text-xs font-semibold text-[#1B7A4D]">
            They owe {formatCurrency(amount_owed_to_you)}
          </Text>
          <Text className="text-xs font-semibold text-[#B91C1C]">
            You owe {formatCurrency(amount_you_owe)}
          </Text>
        </View>
      </View>
      <View
        className={`rounded-full px-3 py-1 ${
          isPositive ? "bg-[rgba(27,122,77,0.12)]" : "bg-[rgba(185,28,28,0.12)]"
        }`}
      >
        <Text
          className={`text-xs font-semibold ${
            isPositive ? "text-[#1B7A4D]" : "text-[#B91C1C]"
          }`}
        >
          {isPositive ? "+" : "-"}
          {formatCurrency(Math.abs(net_balance))}
        </Text>
      </View>
    </Pressable>
  );
};
