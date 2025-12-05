import { useAuth } from "@/context/auth";
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TabLayout() {
  const [tabsMounted, setTabsMounted] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Signal when tabs have mounted
  useEffect(() => {
    setTabsMounted(true);
  }, []);
  
  useEffect(() => {
    console.log("User state changed:", user);
    if (!user) {
      console.log("No user found, redirecting to login");
      router.replace('/(auth)/login');
    }
  }, [user]);

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#203627',
          tabBarInactiveTintColor: '#203627',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#FFFFFF',
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            height: Platform.OS === 'ios' ? 88 : 68,
            shadowColor: '#203627',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 10,
          },
          tabBarItemStyle: {
            paddingVertical: 8,
            paddingHorizontal: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 0,
          },
          tabBarIconStyle: {
            marginBottom: -4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name="home" 
                size={22} 
                color="#203627" 
                style={{ opacity: focused ? 1 : 0.5 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Activity',
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name="card" 
                size={22} 
                color="#203627" 
                style={{ opacity: focused ? 1 : 0.5 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="ai"
          options={{
            title: 'AI',
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name="sparkles" 
                size={22} 
                color="#203627" 
                style={{ opacity: focused ? 1 : 0.5 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="split-settle"
          options={{
            title: 'Split',
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name="people" 
                size={22} 
                color="#203627" 
                style={{ opacity: focused ? 1 : 0.5 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                name="person" 
                size={22} 
                color="#203627" 
                style={{ opacity: focused ? 1 : 0.5 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="plaid-link"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="budget-run"
          options={{
            href: null, // Hide from tab bar - accessible via home screen
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
