import LoadingLayout from "@/components/LoadingLayout";
import PlaidConnectWrapper from "@/components/PlaidConnectWrapper";
import { useAuth } from "@/context/auth";
import { syncAccounts } from "@/services/accountService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

export default function PlaidLinkPage() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const params = useLocalSearchParams();

  const isRelinkMode = params.relinkMode === "true";
  const institutionId = params.institutionId as string;
  const institutionName = params.institutionName as string;

  const handleSuccess = async () => {
    if (!fetchWithAuth) return;
    // After successfully linking an account, sync accounts and navigate to the main page
    setLoading(true);

    try {
      await syncAccounts(fetchWithAuth);
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
    router.replace({
      pathname: "/(tabs)",
      params: { refresh: Date.now().toString() },
    });
  };

  const handleError = (error: string) => {
    console.error("Plaid link error:", error);
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return <LoadingLayout isLoading={loading} />;
  }

  return (
      <View style={{ flex: 1, backgroundColor: "#EFEFEF" }}>
        <View style={{ flex: 1 }}>
          {/* Plaid Link Component */}
          <PlaidConnectWrapper
            fetchWithAuth={fetchWithAuth}
            onSuccess={handleSuccess}
            onError={handleError}
            relinkMode={isRelinkMode}
            relinkInstitutionId={institutionId}
          />
        </View>
      </View>
  );
}
