import React, { useState } from 'react';
import { View, Text, Pressable, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import PlaidManager from '@/components/PlaidManager';
import MockProtectedApi from '@/services/mockProtectedApi';
import { useAuth } from '@/context/auth';

export default function MainPage() {
  const [protectedData, setProtectedData] = useState({});
  const { user, signOut, fetchWithAuth } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <SafeAreaView className="h-full flex flex-col items-center justify-between bg-white">
      {/* Header */}
      <View className="w-full px-5 py-2 flex-row items-center justify-between bg-white border-b border-gray-200">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              Welcome back, {user?.name || 'User'}!
            </Text>
            <Text className="text-gray-600 text-sm">
              Manage your finances securely
            </Text>
          </View>
          <Pressable
            onPress={handleSignOut}
            className="bg-red-500 rounded-lg"
          >
            <Text className="text-white font-semibold text-sm">Sign Out</Text>
          </Pressable>
      </View>

      {/* Main Content */}
      <PlaidManager fetchWithAuth={fetchWithAuth} user={user} />

      {/* Debug Section - Remove in production */}
      <View className="w-full px-4 pb-12 border-t border-gray-200">
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
    </SafeAreaView>
  );
} 