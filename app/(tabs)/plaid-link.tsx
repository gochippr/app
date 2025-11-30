import PlaidLinkComponent from '@/components/PlaidLink';
import { useAuth } from '@/context/auth';
import { usePlaid } from '@/context/plaid';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

export default function PlaidLinkPage() {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const { setHasConnectedAccounts } = usePlaid();
  const params = useLocalSearchParams();
  
  const isRelinkMode = params.relinkMode === 'true';
  const institutionId = params.institutionId as string;
  const institutionName = params.institutionName as string;

  const handleSuccess = () => {
    setHasConnectedAccounts(true);
    if (isRelinkMode) {
      router.replace('/(tabs)/manage-accounts');
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleError = (error: string) => {
    console.error('Plaid link error:', error);
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EFEFEF' }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 24,
          backgroundColor: '#203627',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24
        }}>
          <Pressable
            onPress={handleBack}
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(157, 196, 213, 0.2)',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#EFEFEF" />
          </Pressable>
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#EFEFEF'
          }}>
            {isRelinkMode ? `Relink ${institutionName || 'Bank'}` : 'Connect Your Bank'}
          </Text>
        </View>

        {/* Plaid Link Component */}
        <PlaidLinkComponent
          fetchWithAuth={fetchWithAuth}
          onSuccess={handleSuccess}
          onError={handleError}
          relinkMode={isRelinkMode}
          relinkInstitutionId={institutionId}
        />
      </View>
    </SafeAreaView>
  );
}