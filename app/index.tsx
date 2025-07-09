import SignInWithGoogleButton from "@/components/SignInWithGoogleButton";
import PlaidManager from "@/components/PlaidManager";
import { useAuth } from "@/context/auth";
import MockProtectedApi from "@/services/mockProtectedApi";
import { Pressable, Text, View } from "react-native";

import { useState } from "react";


export default function Index() {
  const [protectedData, setProtectedData] = useState({});
  const { signIn, isLoading, signOut, user, fetchWithAuth } = useAuth();
  
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600 text-lg">Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-8">
          Welcome to Chippr!
        </Text>
        
        <SignInWithGoogleButton
          onPress={signIn}
          disabled={false}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-800">
              Welcome back, {user.name}!
            </Text>
            <Text className="text-gray-600 text-sm">
              Manage your finances securely
            </Text>
          </View>
          <Pressable
            onPress={signOut}
            className="bg-red-500 px-3 py-1 rounded-lg"
          >
            <Text className="text-white font-semibold text-sm">Sign Out</Text>
          </Pressable>
        </View>
      </View>

      {/* Plaid Manager */}
      <PlaidManager fetchWithAuth={fetchWithAuth} />

      {/* Debug Section - Remove in production */}
      <View className="p-4 border-t border-gray-200">
        <Text className="text-sm text-gray-500 mb-2">
          Debug - Protected Data:
        </Text>
        <Text className="text-xs text-gray-400 bg-gray-100 p-2 rounded">
          {JSON.stringify(protectedData, null, 2)}
        </Text>
        <Pressable
          onPress={async () => {
            try {
              const data = await MockProtectedApi.getProtectedData(fetchWithAuth);
              console.log("Protected data:", data);
              setProtectedData(data);
            } catch (error) {
              console.error("Error fetching protected data:", error);
            }
          }}
          className="bg-blue-500 px-4 py-2 rounded-lg mt-2"
        >
          <Text className="text-white font-semibold text-center text-sm">
            Fetch Protected Data
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
