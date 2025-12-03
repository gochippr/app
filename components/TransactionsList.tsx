import { Transaction } from "@/services/transactionService";
import { Text, View } from "react-native";

// const TRANSACTION_CATEGORY_TO_EMOJI: { [key: string]: string } = {
//   Groceries: "🛒",
//   Dining: "🍽️",
//   Utilities: "💡",
//   Entertainment: "🎬",
//   Transportation: "🚗",
//   Healthcare: "🏥",
//   Education: "🎓",
//   Shopping: "🛍️",
//   Travel: "✈️",
//   "Personal Care": "💆‍♀️",
//   Subscriptions: "📅",
//   "Gifts & Donations": "🎁",
//   Miscellaneous: "🧾",
// };
export interface TransactionsListProps {
  transactions: Transaction[];
}

export default function TransactionsList({
  transactions,
}: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No transactions found.</Text>
      </View>
    );
  }

  return (
    <View className="w-full flex flex-col gap-4">
      {transactions.map((transaction) => (
        <View key={transaction.id} className="p-4 bg-white rounded-xl">
          <Text className="text-lg font-semibold">{transaction.description}</Text>
          <Text className="text-gray-500">
            {new Date(transaction.posted_date).toLocaleDateString()}
          </Text>
          <Text className="text-gray-800 font-bold">
            ${transaction.amount}
          </Text>
          <Text className="text-gray-600">
            {transaction.category}
          </Text>
        </View>
      ))}
    </View>
  );
}
