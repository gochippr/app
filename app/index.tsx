import { Redirect } from 'expo-router';
import { USE_MOCK_DATA } from '@/mocks/config';

export default function Index() {
  // In mock mode, skip login and go directly to tabs
  // since the mock auth provider auto-logs in the user
  if (USE_MOCK_DATA) {
    return <Redirect href="/(tabs)" />;
  }
  
  // In production mode, redirect to login
  return <Redirect href="/(auth)/login" />;
}