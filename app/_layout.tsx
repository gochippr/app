import { AuthProvider, useAuth } from "@/context/auth";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

function InitialLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Wait for navigation to be ready and auth check to complete
    if (!navigationState?.key || isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    if (user && !inTabsGroup) {
      // User is signed in but not in the tabs group
      router.replace("/(tabs)");
    } else if (!user && !inAuthGroup && segments[0] !== undefined) {
      // User is not signed in and not in the auth group
      router.replace("/(auth)/login");
    }
  }, [user, segments, isLoading, router, navigationState]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFEFEF' }}>
        <ActivityIndicator size="large" color="#203627" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}