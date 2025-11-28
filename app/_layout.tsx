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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Prepare the app
    async function prepare() {
      try {
        // Add any pre-loading tasks here
        // Artificial delay to ensure everything is mounted
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <AuthProvider>
      <PlaidProvider>
        <RootNavigator />
      </PlaidProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    // Ensure navigation is ready before rendering
    setNavigationReady(true);
  }, []);

  if (isLoading || !navigationReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFEFEF' }}>
        <ActivityIndicator size="large" color="#203627" />
      </View>
    );
  }

  return (
    <Stack 
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? "(tabs)" : "(auth)/login"}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}