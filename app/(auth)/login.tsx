import AuthScreen from '@/components/AuthView';
import LoadingLayout from '@/components/LoadingLayout';
import { useAuth } from '@/context/auth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // If user is already logged in, redirect to tabs
    if (user && !isLoading) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading]);

  return (
    <LoadingLayout isLoading={isLoading}>
      <AuthScreen />
    </LoadingLayout>
  );
}