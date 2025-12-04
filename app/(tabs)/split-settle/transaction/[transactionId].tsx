import React, { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";

import { useAuth } from "@/context/auth";
import { FriendRelationship, getFriends } from "@/services/friendService";
import {
  getTransactionSplits,
  TransactionSplitInput,
  TransactionSplitsResponse,
  upsertTransactionSplits,
} from "@/services/splitService";

interface SplitEntry {
  friendId: string;
  name: string;
  email: string;
  amount: string;
}

const formatCurrency = (value: number, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
};

export default function TransactionSplitEditor() {
  const { transactionId } = useLocalSearchParams<{ transactionId: string }>();
  const { fetchWithAuth } = useAuth();
  const router = useRouter();

  const [transactionData, setTransactionData] = useState<TransactionSplitsResponse | null>(null);
  const [friends, setFriends] = useState<FriendRelationship[]>([]);
  const [entries, setEntries] = useState<SplitEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!fetchWithAuth || !transactionId) return;
    setLoading(true);
    try {
      const [splitResponse, friendsResponse] = await Promise.all([
        getTransactionSplits(fetchWithAuth, transactionId),
        getFriends(fetchWithAuth),
      ]);
      setTransactionData(splitResponse);
      setFriends(friendsResponse.filter((friend) => friend.status === "accepted"));

      const initialEntries: SplitEntry[] = splitResponse.participants
        .filter((participant) => participant.role === "debtor")
        .map((participant) => ({
          friendId: participant.user_id,
          name: participant.name || participant.email,
          email: participant.email,
          amount: participant.amount.toFixed(2),
        }));
      setEntries(initialEntries);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load split data");
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, transactionId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const transaction = transactionData?.transaction;
  const currencyCode = transaction?.transaction_currency || "USD";
  const transactionAmount = transaction?.transaction_amount ?? 0;

  const allocated = useMemo(() => {
    return entries.reduce((sum, entry) => {
      const value = parseFloat(entry.amount);
      if (Number.isNaN(value)) {
        return sum;
      }
      return sum + value;
    }, 0);
  }, [entries]);

  const remaining = useMemo(() => transactionAmount - allocated, [transactionAmount, allocated]);

  const availableFriends = useMemo(() => {
    const selectedIds = new Set(entries.map((entry) => entry.friendId));
    return friends.filter((friend) => friend.friend && !selectedIds.has(friend.friend.id));
  }, [entries, friends]);

  const updateEntryAmount = (friendId: string, amount: string) => {
    setEntries((prev) => prev.map((entry) => (entry.friendId === friendId ? { ...entry, amount } : entry)));
  };

  const removeEntry = (friendId: string) => {
    setEntries((prev) => prev.filter((entry) => entry.friendId !== friendId));
  };

  const addEntry = (friend: FriendRelationship) => {
    const fallbackAmount = remaining > 0 ? remaining.toFixed(2) : "0.00";
    setEntries((prev) => [
      ...prev,
      {
        friendId: friend.friend.id,
        name: friend.friend.name || friend.friend.email,
        email: friend.friend.email,
        amount: fallbackAmount,
      },
    ]);
  };

  const isSaveDisabled = useMemo(() => {
    if (!transactionData) return true;
    if (entries.length === 0) return false; // allows clearing splits entirely

    const invalidValue = entries.some((entry) => {
      const value = parseFloat(entry.amount);
      return Number.isNaN(value) || value <= 0;
    });

    return invalidValue || remaining < -0.01;
  }, [entries, remaining, transactionData]);

  const handleSave = async () => {
    if (!fetchWithAuth || !transactionId || !transactionData) return;

    setSaving(true);
    try {
      const payload: TransactionSplitInput[] = entries
        .filter((entry) => parseFloat(entry.amount) > 0)
        .map((entry) => ({
          debtor_user_id: entry.friendId,
          amount: parseFloat(entry.amount),
        }));

      await upsertTransactionSplits(fetchWithAuth, transactionId, { splits: payload });
      Alert.alert("Split updated", "Your split has been saved.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Unable to save split");
    } finally {
      setSaving(false);
    }
  };

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

          {transaction ? (
            <View className="mx-5 mt-6 rounded-3xl bg-white px-5 py-6 shadow-md shadow-[#203627]/10">
              <Text className="text-xl font-semibold text-[#203627]">
                {transaction.transaction_description || "Transaction"}
              </Text>
              {transaction.merchant_name ? (
                <Text className="mt-1 text-sm text-[#6C7280]">{transaction.merchant_name}</Text>
              ) : null}
              <View className="mt-4 flex-row justify-between">
                <View>
                  <Text className="text-xs text-[#6C7280]">Category</Text>
                  <Text className="mt-1 text-sm font-semibold text-[#203627]">
                    {transaction.category || "Uncategorized"}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-[#6C7280]">Date</Text>
                  <Text className="mt-1 text-sm font-semibold text-[#203627]">
                    {transaction.posted_date
                      ? new Date(transaction.posted_date).toLocaleDateString()
                      : "Pending"}
                  </Text>
                </View>
              </View>
              <View className="mt-4 flex-row justify-between">
                <View>
                  <Text className="text-xs text-[#6C7280]">Total</Text>
                  <Text className="mt-1 text-2xl font-bold text-[#203627]">
                    {formatCurrency(transactionAmount, currencyCode)}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-[#6C7280]">Currently split</Text>
                  <Text className="mt-1 text-xl font-semibold text-[#203627]">
                    {formatCurrency(entries.length ? allocated : transaction.split_total, currencyCode)}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {entries.length > 0 ? (
            <View className="mx-5 mt-6 space-y-3">
              <Text className="text-lg font-semibold text-[#203627]">Selected friends</Text>
              {entries.map((entry) => (
                <View
                  key={entry.friendId}
                  className="flex-row items-center rounded-2xl bg-white px-4 py-4 shadow-md shadow-[#203627]/10"
                >
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-[#203627]">{entry.name}</Text>
                    <Text className="text-xs text-[#6C7280]">{entry.email}</Text>
                  </View>
                  <TextInput
                    className="mr-3 h-11 w-24 rounded-xl bg-[#F5F6F5] px-3 text-center text-base font-semibold text-[#203627]"
                    keyboardType="decimal-pad"
                    value={entry.amount}
                    placeholder="0.00"
                    onChangeText={(text) => updateEntryAmount(entry.friendId, text)}
                  />
                  <Pressable
                    className="rounded-xl bg-[rgba(185,28,28,0.12)] px-3 py-2"
                    onPress={() => removeEntry(entry.friendId)}
                  >
                    <Text className="text-xs font-semibold text-[#B91C1C]">Remove</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}

          <View className="mx-5 mt-8 space-y-3">
            <Text className="text-lg font-semibold text-[#203627]">Add friend</Text>
            {availableFriends.length === 0 ? (
              <Text className="text-sm text-[#6C7280]">
                All accepted friends have been added.
              </Text>
            ) : (
              availableFriends.map((friend) => (
                <Pressable
                  key={friend.friend.id}
                  className="flex-row items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-md shadow-[#203627]/10"
                  onPress={() => addEntry(friend)}
                >
                  <View>
                    <Text className="text-base font-semibold text-[#203627]">
                      {friend.friend.name || friend.friend.email}
                    </Text>
                    <Text className="text-xs text-[#6C7280]">{friend.friend.email}</Text>
                  </View>
                  <Text className="text-sm font-semibold text-[#1B7A4D]">Add</Text>
                </Pressable>
              ))
            )}
          </View>

          <View className="mx-5 mt-8 rounded-2xl bg-white px-5 py-4 shadow-md shadow-[#203627]/10">
            <Text className="text-sm text-[#6C7280]">Remaining amount for you</Text>
            <Text
              className={`mt-2 text-2xl font-bold ${
                remaining >= -0.001 ? "text-[#1B7A4D]" : "text-[#B91C1C]"
              }`}
            >
              {formatCurrency(remaining, currencyCode)}
            </Text>
            <Text className="mt-2 text-xs text-[#6C7280]">
              The remaining amount is what you will cover after splits.
            </Text>
          </View>

          <Pressable
            disabled={isSaveDisabled || saving}
            onPress={handleSave}
            className={`mx-5 mt-6 items-center rounded-2xl py-4 ${
              isSaveDisabled || saving ? "bg-[#6C7280] opacity-60" : "bg-[#203627]"
            }`}
          >
            {saving ? (
              <ActivityIndicator color="#EFEFEF" />
            ) : (
              <Text className="text-base font-semibold text-[#EFEFEF]">Save split</Text>
            )}
          </Pressable>

          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
