import TransactionsList from '@/components/TransactionsList';
import { useAuth } from '@/context/auth';
import { usePlaid } from '@/context/plaid';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function TransactionsPage() {
  const { fetchWithAuth } = useAuth();
  const { hasConnectedAccounts, plaidLoading: isLoading } = usePlaid();
  const router = useRouter();

  if (!hasConnectedAccounts && !isLoading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Transactions</Text>
            <Text style={styles.headerSubtitle}>Connect your bank to view transactions</Text>
          </View>
          
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏦</Text>
            <Text style={styles.emptyTitle}>No Bank Connected</Text>
            <Text style={styles.emptySubtitle}>
              Connect your bank account to start viewing your transactions
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/plaid-link')}
              style={styles.connectButton}
            >
              <Text style={styles.connectButtonText}>Connect Bank Account</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Transactions</Text>
          <Text style={styles.headerSubtitle}>All your financial activity</Text>
        </View>
        
        <View style={styles.content}>
          <TransactionsList fetchWithAuth={fetchWithAuth} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: '#203627',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EFEFEF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9DC4D5',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#203627',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#203627',
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 32,
  },
  connectButton: {
    backgroundColor: '#203627',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  connectButtonText: {
    color: '#EFEFEF',
    fontSize: 16,
    fontWeight: '600',
  },
});