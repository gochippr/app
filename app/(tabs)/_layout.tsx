import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#203627',
        tabBarInactiveTintColor: '#203627',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#9DC4D5',
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
          marginTop: -4,
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
          title: 'Transactions',
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
    </Tabs>
  );
}