import { Redirect } from 'expo-router';

export default function Index() {
  // This file exists purely as a redirect.
  // The actual navigation logic is handled by the root layout.
  return <Redirect href="/(auth)/login" />;
}