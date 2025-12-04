import React, { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
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
  FriendSplitListItem,
  FriendSplitListResponse,
  getFriendSplits,
} from "@/services/splitService";

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

export default function FriendSplitDetail() {
  const { friendId } = useLocalSearchParams<{ friendId: string }>();
  const { fetchWithAuth } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<FriendSplitListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!fetchWithAuth || !friendId) return;
    setLoading(true);
    try {
      const response = await getFriendSplits(fetchWithAuth, friendId);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load splits");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchWithAuth, friendId]);

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

  const friend = data?.friend;
  const totals = data?.totals;
  return (
    <View className="flex-1 bg-[#EFEFEF]">
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {friend ? (
            <View className="mx-5 mt-6 mb-4 rounded-3xl bg-white px-5 py-6 shadow-md shadow-[#203627]/10">
              <View className="flex-row items-center">
                <View className="mr-4 h-14 w-14 items-center justify-center rounded-full bg-[#E8FF40]">
                  <Text className="text-2xl font-bold text-[#203627]">
                    {friend.name?.charAt(0).toUpperCase() || friend.email.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-[#203627]">
                    {friend.name || friend.email}
                  </Text>
                  <Text className="text-sm text-[#6C7280]">{friend.email}</Text>
                </View>
              </View>

              {totals ? (
                <View className="mt-6 flex-row items-center justify-between rounded-2xl bg-[#F5F6F5] px-4 py-4">
                  <View className="flex-1 items-center">
                    <Text className="text-xs text-[#6C7280]">They owe you</Text>
                    <Text className="mt-1 text-xl font-bold text-[#1B7A4D]">
                      {formatCurrency(totals.total_owed_to_you)}
                    </Text>
                  </View>
                  <View className="h-9 w-px bg-[#203627]/10" />
                  <View className="flex-1 items-center">
                    <Text className="text-xs text-[#6C7280]">You owe</Text>
                    <Text className="mt-1 text-xl font-bold text-[#B91C1C]">
                      {formatCurrency(totals.total_you_owe)}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}

          {error ? (
            <View className="mx-5 mb-4 rounded-2xl bg-[#FEE2E2] px-4 py-3">
              <Text className="text-sm text-[#B91C1C]">{error}</Text>
            </View>
          ) : null}

          {loading ? <ActivityIndicator className="mt-4" color="#203627" /> : null}

          {data && data.splits.length === 0 && !loading ? (
            <View className="mx-5 mt-6 rounded-2xl bg-white px-5 py-6 shadow-md shadow-[#203627]/10">
              <Text className="text-lg font-semibold text-[#203627]">No splits yet</Text>
              <Text className="mt-1 text-sm text-[#6C7280]">
                Split a transaction with this friend to track it here.
              </Text>
            </View>
          ) : null}

          {data?.splits.map((split) => (
            <SplitRow
              key={split.split_id}
              split={split}
              onPress={() => router.push(`/(tabs)/split-settle/${friendId}/${split.split_id}`)}
            />
          ))}

          <View className="mt-6" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

interface SplitRowProps {
  split: FriendSplitListItem;
  onPress: () => void;
}

const SplitRow = ({ split, onPress }: SplitRowProps) => {
  const isYouOwe = split.direction === "you_owe";
  return (
    <Pressable
      onPress={onPress}
      className="mx-5 mb-3 flex-row items-center rounded-2xl bg-white px-4 py-4 shadow-md shadow-[#203627]/10"
    >
      <View className="flex-1">
        <Text className="text-base font-semibold text-[#203627]">
          {split.transaction_description || split.merchant_name || "Transaction"}
        </Text>
        <Text className="mt-1 text-xs text-[#6C7280]">
          {split.category || "Uncategorized"} • {" "}
          {split.posted_date ? new Date(split.posted_date).toLocaleDateString() : "Pending"}
        </Text>
        {split.note ? (
          <Text className="mt-2 text-[11px] text-[#6C7280]">{split.note}</Text>
        ) : null}
      </View>
      <View className="ml-3 items-end">
        <Text className="text-xs font-semibold text-[#6C7280]">
          {isYouOwe ? "You owe" : "They owe"}
        </Text>
        <Text
          className={`mt-1 text-base font-semibold ${
            isYouOwe ? "text-[#B91C1C]" : "text-[#1B7A4D]"
          }`}
        >
          {formatCurrency(split.share_amount)}
        </Text>
      </View>
    </Pressable>
  );
};
