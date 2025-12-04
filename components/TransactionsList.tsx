import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/context/auth";
import { Transaction } from "@/services/transactionService";
import {
  TransactionSplitsResponse,
  getTransactionSplits,
} from "@/services/splitService";

const TRANSACTION_CATEGORY_TO_EMOJI: { [key: string]: string } = {
  Groceries: "🛒",
  Dining: "🍽️",
  Utilities: "💡",
  Entertainment: "🎬",
  Transportation: "🚗",
  Healthcare: "🏥",
  Education: "🎓",
  Shopping: "🛍️",
  Travel: "✈️",
  "Personal Care": "💆‍♀️",
  Subscriptions: "📅",
  "Gifts & Donations": "🎁",
  Miscellaneous: "🧾",
};

const DEFAULT_CURRENCY = "USD";

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString() : "—";

const formatSignedAmount = (
  amount: number,
  currencyCode: string,
  isCredit: boolean
): string => {
  const signedAmount = isCredit ? amount : -amount;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(signedAmount);
  } catch {
    const sign = isCredit ? "" : "-";
    return `${sign}${currencyCode} ${amount.toFixed(2)}`;
  }
};

const formatCurrency = (amount: number, currencyCode: string) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};

export interface TransactionsListProps {
  transactions: Transaction[];
}

export default function TransactionsList({ transactions }: TransactionsListProps) {
  const { fetchWithAuth } = useAuth();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };

  if (transactions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No transactions found.</Text>
      </View>
    );
  }

  return (
    <View className="w-full flex flex-col gap-4">
      {transactions.map((transaction) => {
        const currency = transaction.currency || DEFAULT_CURRENCY;
        const userAmount = transaction.user_amount ?? transaction.amount;
        const isCredit = transaction.type?.toLowerCase() === "credit";
        const amountColor = isCredit ? "text-green-500" : "text-red-500";
        const displayDate = formatDate(
          transaction.posted_date || transaction.authorized_date || transaction.created_at
        );

        return (
          <TouchableOpacity
            key={transaction.id}
            className="w-full flex flex-row justify-start items-center gap-4 p-4 bg-white rounded-xl"
            activeOpacity={0.85}
            onPress={() => handleSelectTransaction(transaction)}
          >
            <View className="size-12 flex justify-center items-center bg-[#EDFE66] rounded-full">
              <Text className="text-lg">
                {TRANSACTION_CATEGORY_TO_EMOJI[transaction.category] || "💳"}
              </Text>
            </View>
            <View className="flex-1 flex flex-col justify-center items-start">
              <View className="flex-row items-center gap-2">
                <Text
                  className="font-semibold text-[#253628] text-nowrap text-ellipsis overflow-hidden"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {transaction.description || transaction.merchant_name || "Transaction"}
                </Text>
                {transaction.has_split ? (
                  <View className="px-2 py-0.5 bg-[#E8FF40] rounded-full">
                    <Text className="text-[10px] font-semibold text-[#253628]">Split</Text>
                  </View>
                ) : null}
              </View>
              <View className="flex-row gap-1 items-center mt-1">
                <Text className="text-sm text-[#6C7280] font-semibold">
                  {transaction.category || "Other"}
                </Text>
                <Text className="text-sm text-[#6C7280] font-semibold">•</Text>
                <Text className="text-sm text-[#6C7280] font-semibold">{displayDate}</Text>
              </View>
              {transaction.has_split ? (
                <Text className="text-xs text-[#6C7280] mt-1">
                  Your share {formatCurrency(userAmount, currency)} • Others owe {formatCurrency(transaction.split_total ?? 0, currency)}
                </Text>
              ) : null}
            </View>

            <Text className={`${amountColor} font-bold`}>
              {formatSignedAmount(userAmount, currency, isCredit)}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TransactionDetailsModal
        transaction={selectedTransaction}
        visible={isModalVisible && !!selectedTransaction}
        onClose={closeModal}
        fetchWithAuth={fetchWithAuth}
      />
    </View>
  );
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  visible: boolean;
  onClose: () => void;
  fetchWithAuth?: (url: string, options: RequestInit) => Promise<Response>;
}

const TransactionDetailsModal = ({
  transaction,
  visible,
  onClose,
  fetchWithAuth,
}: TransactionDetailsModalProps) => {
  const windowHeight = Dimensions.get("window").height;
  const router = useRouter();

  const [splitInfo, setSplitInfo] = useState<TransactionSplitsResponse | null>(null);
  const [splitLoading, setSplitLoading] = useState(false);
  const [splitError, setSplitError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const loadSplits = async () => {
      if (!visible || !transaction || !transaction.has_split || !fetchWithAuth) {
        setSplitInfo(null);
        setSplitError(null);
        return;
      }
      try {
        setSplitLoading(true);
        const response = await getTransactionSplits(fetchWithAuth, transaction.id);
        if (isActive) {
          setSplitInfo(response);
          setSplitError(null);
        }
      } catch (err) {
        if (isActive) {
          setSplitError(err instanceof Error ? err.message : "Failed to load split details");
        }
      } finally {
        if (isActive) {
          setSplitLoading(false);
        }
      }
    };

    loadSplits();
    return () => {
      isActive = false;
    };
  }, [visible, transaction, fetchWithAuth]);

  const currency = transaction?.currency || DEFAULT_CURRENCY;

  const formattedAmount = useMemo(() => {
    if (!transaction) {
      return "";
    }
    const userAmount = transaction.user_amount ?? transaction.amount;
    const isCredit = transaction.type?.toLowerCase() === "credit";
    return formatSignedAmount(userAmount, currency, isCredit);
  }, [transaction, currency]);

  if (!transaction) {
    return null;
  }

  const categoryEmoji = TRANSACTION_CATEGORY_TO_EMOJI[transaction.category] || "💳";
  const accountSuffix = transaction.account_id?.slice(-4) ?? "";
  const accountDisplay = accountSuffix ? `•••• ${accountSuffix}` : transaction.account_id || "—";

  const yourShare = transaction.user_amount ?? transaction.amount;
  const totalSplit = transaction.split_total ?? 0;

  const handleSplitAction = () => {
    router.push(`/(tabs)/split-settle/transaction/${transaction.id}`);
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="w-full rounded-3xl bg-white overflow-hidden">
          <View className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-[#253628]">Transaction Details</Text>
            <Pressable onPress={onClose} hitSlop={12} className="size-8 rounded-full bg-gray-200">
              <View className="w-full h-full flex justify-center items-center">
                <Ionicons name="close" size={18} color="#253628" />
              </View>
            </Pressable>
          </View>

          <ScrollView
            style={{ maxHeight: windowHeight * 0.65 }}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View className="items-center gap-3 px-6 pt-6">
              <View className="size-16 flex justify-center items-center bg-[#EDFE66] rounded-full">
                <Text className="text-2xl">{categoryEmoji}</Text>
              </View>
              <Text className="text-xl font-semibold text-center text-[#253628]">
                {transaction.description || transaction.merchant_name || "Transaction"}
              </Text>
              <Text className="text-2xl font-bold text-[#253628]">{formattedAmount}</Text>
              <Text className="text-sm text-[#6C7280]">
                Original amount {formatCurrency(transaction.amount, currency)}
              </Text>
            </View>

            <View className="px-6 pt-6">
              <DetailRow label="Type" value={transaction.type || "—"} />
              <DetailRow
                label="Transaction date"
                value={formatDate(
                  transaction.authorized_date || transaction.posted_date || transaction.created_at
                )}
              />
              <DetailRow label="Posted date" value={formatDate(transaction.posted_date)} />
              <DetailRow
                label="Status"
                value={transaction.pending ? "Pending" : "Completed"}
              />
              {transaction.merchant_name ? (
                <DetailRow label="Merchant" value={transaction.merchant_name} />
              ) : null}
              {transaction.description ? (
                <DetailRow label="Description" value={transaction.description} />
              ) : null}
              <DetailRow label="Category" value={transaction.category || "Uncategorized"} />
              <DetailRow label="Account" value={accountDisplay} />
              <DetailRow
                label="Your share"
                value={formatCurrency(yourShare, currency)}
              />
              {transaction.has_split ? (
                <DetailRow
                  label="Friends owe"
                  value={formatCurrency(totalSplit, currency)}
                />
              ) : null}
            </View>

            {transaction.has_split ? (
              <View className="px-6 mt-4">
                <Text className="text-sm font-semibold text-[#253628] mb-2">Split details</Text>
                {splitLoading ? (
                  <ActivityIndicator color="#203627" />
                ) : splitError ? (
                  <Text className="text-xs text-red-500">{splitError}</Text>
                ) : splitInfo ? (
                  <View className="bg-[#F5F6F5] rounded-2xl p-3">
                    {splitInfo.participants.map((participant) => (
                      <View
                        key={participant.user_id}
                        className="flex-row justify-between items-center py-1"
                      >
                        <View className="flex-1 mr-3">
                          <Text className="text-sm font-semibold text-[#253628]">
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
                        <Text className="text-sm font-semibold text-[#253628]">
                          {formatCurrency(participant.amount, currency)}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text className="text-xs text-[#6C7280]">No split participants listed.</Text>
                )}
              </View>
            ) : null}
          </ScrollView>

          <View className="px-6 pb-6 pt-4">
            <TouchableOpacity
              activeOpacity={0.85}
              className="w-full flex-row items-center justify-center gap-2 rounded-full bg-[#253628] py-4"
              onPress={handleSplitAction}
            >
              <Ionicons name="git-branch-outline" size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold text-base">
                {transaction.has_split ? "View split" : "Split this transaction"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <View className="w-full flex-row justify-between items-start py-2 border-b border-gray-100">
    <Text className="text-sm font-semibold text-[#6C7280] shrink-0">{label}</Text>
    <Text className="text-sm text-right text-[#253628] flex-1 ml-4">{value}</Text>
  </View>
);
