import { AuthProvider, useAuth } from "@/context/auth";
import { PlaidProvider } from "@/context/plaid";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthInitializer />
    </AuthProvider>
  );
}

// This component waits for auth to initialize before rendering children
function AuthInitializer() {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { isLoading: authLoading, user } = useAuth();
  
  useEffect(() => {
    // Wait for auth to finish its initial loading
    if (!authLoading) {
      setIsAuthReady(true);
      // Hide splash screen once auth is ready
      SplashScreen.hideAsync();
    }
  }, [authLoading]);
  
  // Show loading while auth is initializing
  if (!isAuthReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFEFEF' }}>
        <ActivityIndicator size="large" color="#203627" />
      </View>
    );
  }
  
  // Once auth is ready, render PlaidProvider and the navigator
  return (
    <PlaidProvider>
      <RootNavigator />
    </PlaidProvider>
  );
}

function RootNavigator() {
  const { user } = useAuth();
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}