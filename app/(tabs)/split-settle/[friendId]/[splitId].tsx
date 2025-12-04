import React, { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";

import { useAuth } from "@/context/auth";
import { getSplitDetail, SplitDetailResponse } from "@/services/splitService";

const formatCurrency = (value: number, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
};

export default function SplitDetailScreen() {
  const { splitId } = useLocalSearchParams<{ splitId: string }>();
  const { fetchWithAuth } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<SplitDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!fetchWithAuth || !splitId) return;
    setLoading(true);
    try {
      const response = await getSplitDetail(fetchWithAuth, splitId);
      setData(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load split detail");
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, splitId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const transaction = data?.transaction;
  const currencyCode = useMemo(() => transaction?.transaction_currency || "USD", [transaction]);
  const directionLabel = data?.direction === "you_owe" ? "You owe" : "They owe you";

  return (
    <View className="flex-1 bg-[#EFEFEF]">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {loading ? <ActivityIndicator className="mt-6" color="#203627" /> : null}

          {error ? (
            <View className="mx-5 mt-6 rounded-2xl bg-[#FEE2E2] px-4 py-3">
              <Text className="text-sm text-[#B91C1C]">{error}</Text>
            </View>
          ) : null}

          {data && transaction ? (
            <View className="mx-5 mt-6 rounded-3xl bg-white px-5 py-6 shadow-md shadow-[#203627]/10">
              <Text className="text-xl font-semibold text-[#203627]">
                {transaction.transaction_description || "Transaction"}
              </Text>
              {transaction.merchant_name ? (
                <Text className="mt-1 text-sm text-[#6C7280]">{transaction.merchant_name}</Text>
              ) : null}

              <View className="mt-5 flex-row justify-between">
                <View>
                  <Text className="text-xs text-[#6C7280]">Total amount</Text>
                  <Text className="mt-1 text-2xl font-bold text-[#203627]">
                    {formatCurrency(transaction.transaction_amount, currencyCode)}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-[#6C7280]">Split total</Text>
                  <Text className="mt-1 text-xl font-semibold text-[#203627]">
                    {formatCurrency(transaction.split_total, currencyCode)}
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row justify-between">
                <Text className="text-xs text-[#6C7280]">
                  {transaction.category || "Uncategorized"}
                </Text>
                <Text className="text-xs text-[#6C7280]">
                  {transaction.posted_date
                    ? new Date(transaction.posted_date).toLocaleDateString()
                    : "Pending"}
                </Text>
              </View>

              <View className="mt-6 flex-row items-center justify-between rounded-2xl bg-[#F5F6F5] px-4 py-4">
                <Text className="text-sm font-semibold text-[#203627]">{directionLabel}</Text>
                <Text
                  className={`text-xl font-semibold ${
                    data.direction === "you_owe" ? "text-[#B91C1C]" : "text-[#1B7A4D]"
                  }`}
                >
                  {formatCurrency(data.share_amount, currencyCode)}
                </Text>
              </View>

              {data.note ? (
                <Text className="mt-4 text-sm text-[#6C7280]">Note: {data.note}</Text>
              ) : null}
            </View>
          ) : null}

          {data ? (
            <View className="mx-5 mt-6 rounded-3xl bg-white px-5 py-6 shadow-md shadow-[#203627]/10">
              <Text className="text-lg font-semibold text-[#203627]">Participants</Text>
              <View className="mt-4 space-y-3">
                {data.participants.map((participant) => (
                  <View
                    key={participant.user_id}
                    className="flex-row items-center justify-between rounded-2xl bg-[#F5F6F5] px-4 py-3"
                  >
                    <View>
                      <Text className="text-sm font-semibold text-[#203627]">
                        {participant.name || participant.email}
                      </Text>
                      <Text className="text-xs text-[#6C7280]">
                        {participant.role === "payer"
                          ? "Payer"
                          : participant.is_current_user
                          ? "You"
                          : "Friend"}
                      </Text>
                    </View>
                    <Text
                      className={`text-sm font-semibold ${
                        participant.role === "payer" ? "text-[#6C7280]" : "text-[#203627]"
                      }`}
                    >
                      {formatCurrency(participant.amount, currencyCode)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {data?.can_edit ? (
            <Pressable
              className="mx-5 mt-6 items-center rounded-2xl bg-[#203627] py-4"
              onPress={() =>
                router.push(`/(tabs)/split-settle/transaction/${data.transaction.transaction_id}`)
              }
            >
              <Text className="text-base font-semibold text-[#EFEFEF]">Edit split</Text>
            </Pressable>
          ) : null}

          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
