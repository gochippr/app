import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { TransactionSummaryResponse } from "@/services/transactionService";

interface SpendingInsightsProps {
  transactionSummary: TransactionSummaryResponse | null;
}

const SEGMENT_COLORS = ["#EDFE66", "#A5C3D3", "#55B685", "#e5e7eb"] as const;
const RADIUS = 60;
const STROKE_WIDTH = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatCurrency(value: number | null | undefined) {
  if (!value) {
    return "$0";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${Math.round(value)}`;
  }
}

function buildSegments(summary: TransactionSummaryResponse | null) {
  const categories = summary?.categories ?? [];
  let accumulated = 0;

  return categories
    .filter((category) => category.percentage > 0)
    .slice(0, SEGMENT_COLORS.length)
    .map((category, index) => {
      const startPercentage = accumulated;
      accumulated += category.percentage;

      const dashLength = (category.percentage / 100) * CIRCUMFERENCE;
      const dashOffset = -((startPercentage / 100) * CIRCUMFERENCE);

      return {
        ...category,
        color:
          SEGMENT_COLORS[index] ?? SEGMENT_COLORS[SEGMENT_COLORS.length - 1],
        dashLength,
        dashOffset,
      };
    });
}

export function SpendingInsights({
  transactionSummary,
}: SpendingInsightsProps) {
  const totalSpent = transactionSummary?.total_spent ?? 0;
  const segments = buildSegments(transactionSummary);
  const hasData = segments.length > 0 && totalSpent > 0;

  return (
    <View className="w-full p-4 bg-white rounded-xl">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-semibold text-[#253628]">
          Spending Insights
        </Text>
        <Ionicons name="time-outline" size={20} color="#9ca3af" />
      </View>

      <View className="items-center justify-center">
        <View className="relative">
          <Svg
            width={240}
            height={240}
            style={{ transform: [{ rotate: "-90deg" }] }}
          >
            <Circle
              cx={120}
              cy={120}
              r={RADIUS}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={STROKE_WIDTH}
            />

            {hasData ? (
              segments.map((segment, index) => (
                <Circle
                  key={`${segment.category}-${index}`}
                  cx={120}
                  cy={120}
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={`${segment.dashLength} ${CIRCUMFERENCE}`}
                  strokeDashoffset={segment.dashOffset}
                />
              ))
            ) : (
              <Circle
                cx={120}
                cy={120}
                r={RADIUS}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={STROKE_WIDTH}
              />
            )}
          </Svg>
          <View className="absolute inset-0 items-center justify-center">
            <View className="items-center">
              <Text className="text-md font-semibold text-gray-500">Total</Text>
              <Text className="text-xl font-bold text-gray-900">
                {formatCurrency(totalSpent)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="w-full flex-col gap-3">
        {hasData ? (
          segments.map((segment, index) => (
            <View
              key={`${segment.category}-legend-${index}`}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View
                  className="size-4 rounded-full mr-3"
                  style={{ backgroundColor: segment.color }}
                />
                <Text className="text-md font-semibold text-gray-700">
                  {segment.category}
                </Text>
              </View>
              <View className="flex-row gap-2 items-center">
                <Text className="text-md font-semibold text-gray-900">
                  {formatCurrency(segment.amount)}
                </Text>
                <Text className="text-md text-gray-900">
                  {segment.percentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-sm text-gray-500 text-center">
            No spending data available yet. Connect an account to see insights.
          </Text>
        )}
      </View>
    </View>
  );
}
