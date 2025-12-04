import { Stack } from "expo-router";
import React from "react";

export default function SplitSettleLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="[friendId]"
        options={{ headerTitle: "Friend" }}
      />
      <Stack.Screen
        name="[friendId]/[splitId]"
        options={{ headerTitle: "Split Detail", presentation: "card" }}
      />
      <Stack.Screen
        name="transaction/[transactionId]"
        options={{ headerTitle: "Edit Split" }}
      />
    </Stack>
  );
}
