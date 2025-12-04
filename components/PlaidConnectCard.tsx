import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function PlaidConnectCard() {
  const router = useRouter();

  const handleConnectAccount = () => {
    router.push("/(tabs)/plaid-link");
  };

  return (
    <View className="bg-white rounded-xl shadow-sm p-6">
      <Text className="text-2xl text-center mb-2">🏦</Text>
      <Text className="text-xl font-bold text-gray-800 text-center mb-2">
        Connect Your Bank Account
      </Text>
      <Text className="text-gray-600 text-center mb-4">
        Link your bank account to start tracking your transactions and managing
        your finances.
      </Text>

      <Pressable
        onPress={handleConnectAccount}
        className="bg-blue-500 py-3 px-6 rounded-lg"
      >
        <Text className="text-white font-semibold text-center text-lg">
          Connect Bank Account
        </Text>
      </Pressable>

      <Text className="text-gray-400 text-center text-xs mt-4">
        Your bank credentials are never stored. We use Plaid to securely connect
        to your bank.
      </Text>
    </View>
  );
}
