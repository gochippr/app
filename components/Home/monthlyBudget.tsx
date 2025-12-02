import { UserBalance } from "@/services/accountService";
import { TransactionSummaryResponse } from "@/services/transactionService";
import { Text, View } from "react-native";

export interface MonthlyBudgetProps {
  transactionSummary: TransactionSummaryResponse | null;
  userBalance?: UserBalance | null;
}

function getCurrentMonthName() {
  const date = new Date();
  return date.toLocaleString("default", { month: "long" });
}

export function MonthlyBudget(props: MonthlyBudgetProps) {
  const { transactionSummary, userBalance } = props;
  return (
    <View className="w-full p-4 flex-col gap-2 rounded-xl bg-[#A5C3D3]">
      <View className="w-full flex-row justify-between items-center">
        <Text className="text-lg font-bold text-white">
          {getCurrentMonthName()} Budget
        </Text>
        <Text className="text-lg font-bold text-white">
          {" "}
          ${transactionSummary?.total_spent} / $2000
        </Text>
      </View>
      <View className="w-full">
        <View className="h-4 w-full bg-[#B7CFDC] rounded-full mt-2">
          <View
            className="h-4 bg-[#EDFE66] rounded-full"
            style={{
              width: `${
                transactionSummary
                  ? Math.min((transactionSummary.total_spent / 2000) * 100, 100)
                  : 0
              }%`,
            }}
          ></View>
        </View>
      </View>
      <View className="w-full pt-1">
        <Text className="text-md font-bold text-white">
          {transactionSummary && transactionSummary.total_spent > 2000
            ? "You have exceeded your budget!"
            : `You're on track! $${Math.round(2000 - (transactionSummary?.total_spent || 0))} remaining.`}
        </Text>
      </View>
      <View className="w-full flex-row justify-between items-center pt-2">
        <View className="flex-col justify-center items-start">
            <Text className="text-lg font-semibold text-white">Credit Available</Text>
            <Text className="text-3xl font-bold text-white">${userBalance?.real_credit_available || "??"}</Text>
        </View>
        <View className="flex-col justify-center items-end">
            <Text className="text-lg font-semibold text-white">Total Balance</Text>
            <Text className="text-xl font-bold text-white">${userBalance?.total_balance || "??"}</Text>
        </View>

      </View>
    </View>
  );
}
