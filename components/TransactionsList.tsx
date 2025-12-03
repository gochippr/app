import { Transaction } from "@/services/transactionService";
import { useMemo, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

export interface TransactionsListProps {
  transactions: Transaction[];
}

const DEFAULT_CURRENCY = "USD";

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString() : "—";

const getFormattedAmount = (transaction: Transaction): string => {
  const currencyCode = transaction.currency || DEFAULT_CURRENCY;
  const isCredit = transaction.amount >= 0;
  const signedAmount = (isCredit ? 1 : -1) * transaction.amount;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(signedAmount);
  } catch (_error) {
    const sign = isCredit ? "" : "-";
    return `${sign}${currencyCode} ${transaction.amount.toFixed(2)}`;
  }
};

export default function TransactionsList({
  transactions,
}: TransactionsListProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
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
        const isCredit = transaction.amount < 0;
        const amountColor = isCredit ? "text-green-500" : "text-red-500";
        const displayDate = formatDate(
          transaction.posted_date ||
            transaction.authorized_date ||
            transaction.created_at
        );

        return (
          <TouchableOpacity
            key={transaction.id}
            className="w-full flex flex-row justify-start items-center gap-4 p-4 bg-white rounded-xl"
            activeOpacity={0.8}
            onPress={() => handleSelectTransaction(transaction)}
          >
            <View className="size-12 flex justify-center items-center bg-[#EDFE66] rounded-full">
              <Text className="text-lg">
                {TRANSACTION_CATEGORY_TO_EMOJI[transaction.category] || "💳"}
              </Text>
            </View>
            <View className="max-w-60 w-full flex flex-col justify-center items-start">
              <Text
                className="font-semibold text-[#253628] text-nowrap text-ellipsis overflow-hidden"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {transaction.description ||
                  transaction.merchant_name ||
                  "Transaction"}
              </Text>
              <View className="flex-row gap-1 items-center">
                <Text className="text-sm text-[#6C7280] font-semibold">
                  {transaction.category || "Other"}
                </Text>
                <Text className="text-sm text-[#6C7280] font-semibold">•</Text>
                <Text className="text-sm text-[#6C7280] font-semibold">
                  {displayDate}
                </Text>
              </View>
            </View>

            <Text className={`${amountColor} font-bold`}>
              {getFormattedAmount(transaction)}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TransactionDetailsModal
        transaction={selectedTransaction}
        visible={isModalVisible && !!selectedTransaction}
        onClose={closeModal}
      />
    </View>
  );
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  visible: boolean;
  onClose: () => void;
}

const TransactionDetailsModal = ({
  transaction,
  visible,
  onClose,
}: TransactionDetailsModalProps) => {
  const windowHeight = Dimensions.get("window").height;

  const formattedAmount = useMemo(() => {
    if (!transaction) {
      return "";
    }
    return getFormattedAmount(transaction);
  }, [transaction]);

  if (!transaction) {
    return null;
  }

  const categoryEmoji =
    TRANSACTION_CATEGORY_TO_EMOJI[transaction.category] || "💳";
  const isCredit = transaction.type?.toLowerCase() === "credit";
  const accountSuffix = transaction.account_id?.slice(-4) ?? "";
  const accountDisplay = accountSuffix
    ? `•••• ${accountSuffix}`
    : transaction.account_id || "—";

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="w-full rounded-3xl bg-white overflow-hidden">
          <View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-[#253628]">
              Transaction Details
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              className="size-8 rounded-full bg-gray-200"
            >
              <View className="w-full h-full flex justify-center items-center ">
                <Ionicons name="close" size={20}/>
              </View>
            </Pressable>
          </View>

          <ScrollView
            style={{ maxHeight: windowHeight * 0.6 }}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            <View className="items-center gap-3 px-6 pt-6">
              <View className="size-16 flex justify-center items-center bg-[#EDFE66] rounded-full">
                <Text className="text-2xl">{categoryEmoji}</Text>
              </View>
              <Text className="text-xl font-semibold text-center text-[#253628]">
                {transaction.description ||
                  transaction.merchant_name ||
                  "Transaction"}
              </Text>
              <Text
                className={`text-2xl font-bold ${
                  isCredit ? "text-green-500" : "text-red-500"
                }`}
              >
                {formattedAmount}
              </Text>
            </View>

            <View className="px-6 pt-6">
              <DetailRow label="Type" value={transaction.type || "—"} />
              <DetailRow
                label="Transaction date"
                value={formatDate(
                  transaction.authorized_date ||
                    transaction.posted_date ||
                    transaction.created_at
                )}
              />
              <DetailRow
                label="Posted date"
                value={formatDate(transaction.posted_date)}
              />
              <DetailRow
                label="Status"
                value={transaction.pending ? "Pending" : "Completed"}
              />
              {transaction.merchant_name ? (
                <DetailRow label="Merchant" value={transaction.merchant_name} />
              ) : null}
              {transaction.description ? (
                <DetailRow
                  label="Description"
                  value={transaction.description}
                />
              ) : null}
              <DetailRow
                label="Category"
                value={transaction.category || "Uncategorized"}
              />
              <DetailRow label="Account" value={accountDisplay} />
            </View>
          </ScrollView>

          <View className="px-6 pb-8 pt-4">
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-full rounded-full bg-[#253628] py-4"
              onPress={() => {}}
            >
              <Text className="text-xl text-center text-white font-bold">
                Split with Friends
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
    <Text className="text-sm font-semibold text-[#6C7280] shrink-0">
      {label}
    </Text>
    <Text className="text-sm text-right text-[#253628] flex-1 ml-4">
      {value}
    </Text>
  </View>
);
