import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import SignInWithGoogleButton from '@/components/SignInWithGoogleButton';
import { useAuth } from '@/context/auth';
import { useRouter } from 'expo-router';
import LoadingLayout from '@/components/LoadingLayout';

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { signIn, user, isLoading } = useAuth();
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

  const handleSignIn = async () => {
    try {
      await signIn();
      router.replace('/main');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <LoadingLayout isLoading={isLoading}>
    <View className="w-full h-full flex flex-col items-center justify-center bg-white gap-4">
      <Text className="text-2xl font-bold text-gray-800">
        Welcome to Chippr!
      </Text>
      
      <SignInWithGoogleButton
        onPress={handleSignIn}
        disabled={false}
      />
    </View>
    </LoadingLayout>
  );
} 