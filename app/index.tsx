import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useRouter } from 'expo-router';
import LoadingLayout from '@/components/LoadingLayout';
import AuthView from '@/components/AuthView';

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    Promise.resolve().then(() => setIsMounted(true));
  }, []);
  
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (user) {
      router.replace('/main');
    }
  }, [user, isMounted]);

  return (
    <LoadingLayout isLoading={isLoading}>
      <AuthView />
    </LoadingLayout>
  );
} 