import PlaidLinkComponent from "@/components/PlaidLink";
import { useAuth } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";

export default function PlaidLinkPage() {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const params = useLocalSearchParams();

  const isRelinkMode = params.relinkMode === "true";
  const institutionId = params.institutionId as string;
  const institutionName = params.institutionName as string;

  const handleSuccess = () => {
    router.replace("/(tabs)");
  };

  const handleError = (error: string) => {
    console.error("Plaid link error:", error);
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EFEFEF" }}>
      <View style={{ flex: 1 }}>

        {/* Plaid Link Component */}
        <PlaidLinkComponent
          fetchWithAuth={fetchWithAuth}
          onSuccess={handleSuccess}
          onError={handleError}
          relinkMode={isRelinkMode}
          relinkInstitutionId={institutionId}
        />
      </View>
    </SafeAreaView>
  );
}
