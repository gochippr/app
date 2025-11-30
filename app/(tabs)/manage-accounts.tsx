import { useAuth } from '@/context/auth';
import { usePlaid } from '@/context/plaid';
import PlaidService, { PlaidInstitution } from '@/services/plaidService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ManageAccountsPage() {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const { checkConnectedAccounts } = usePlaid();
  const [institutions, setInstitutions] = useState<PlaidInstitution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const plaidService = new PlaidService(fetchWithAuth);

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      const response = await plaidService.getInstitutions();
      setInstitutions(response.institutions);
    } catch (error) {
      console.error('Failed to load institutions:', error);
      Alert.alert('Error', 'Failed to load connected accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadInstitutions();
    setIsRefreshing(false);
  };

  const handleDeleteInstitution = async (institution: PlaidInstitution) => {
    Alert.alert(
      'Remove Bank Account',
      `Are you sure you want to remove ${institution.institution_name}? This will delete all associated data.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(institution.id);
            try {
              await plaidService.deleteInstitution(institution.id);
              await loadInstitutions();
              await checkConnectedAccounts();
              Alert.alert('Success', 'Bank account removed successfully');
            } catch (error) {
              console.error('Failed to delete institution:', error);
              Alert.alert('Error', 'Failed to remove bank account. Please try again.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const handleRelinkInstitution = (institution: PlaidInstitution) => {
    // Navigate to plaid-link with relink mode
    router.push({
      pathname: '/(tabs)/plaid-link',
      params: { 
        relinkMode: 'true',
        institutionId: institution.institution_id,
        institutionName: institution.institution_name
      }
    });
  };

  const renderInstitution = ({ item }: { item: PlaidInstitution }) => (
    <View style={styles.institutionCard}>
      <View style={styles.institutionInfo}>
        <Text style={styles.institutionName}>{item.institution_name}</Text>
        <Text style={styles.institutionDetails}>
          Connected {new Date(item.created_at).toLocaleDateString()}
        </Text>
        {!item.is_active && (
          <View style={styles.warningBadge}>
            <Ionicons name="warning" size={14} color="#DC2626" />
            <Text style={styles.warningText}>Connection expired</Text>
          </View>
        )}
      </View>
      
      <View style={styles.institutionActions}>
        {!item.is_active && (
          <Pressable
            onPress={() => handleRelinkInstitution(item)}
            style={[styles.actionButton, styles.relinkButton]}
          >
            <Ionicons name="refresh" size={18} color="#EFEFEF" />
            <Text style={styles.relinkButtonText}>Relink</Text>
          </Pressable>
        )}
        
        <Pressable
          onPress={() => handleDeleteInstitution(item)}
          disabled={deletingId === item.id}
          style={[styles.actionButton, styles.deleteButton]}
        >
          {deletingId === item.id ? (
            <ActivityIndicator size="small" color="#EFEFEF" />
          ) : (
            <Ionicons name="trash-outline" size={18} color="#EFEFEF" />
          )}
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#EFEFEF" />
            </Pressable>
            <Text style={styles.headerTitle}>Manage Accounts</Text>
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#203627" />
            <Text style={styles.loadingText}>Loading accounts...</Text>
          </View>
        ) : institutions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏦</Text>
            <Text style={styles.emptyTitle}>No Connected Accounts</Text>
            <Text style={styles.emptySubtitle}>
              You haven't connected any bank accounts yet
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/plaid-link')}
              style={styles.connectButton}
            >
              <Text style={styles.connectButtonText}>Connect First Account</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={institutions}
            renderItem={renderInstitution}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#203627"
              />
            }
            ListFooterComponent={
              <Pressable
                onPress={() => router.push('/(tabs)/plaid-link')}
                style={styles.addAccountButton}
              >
                <Ionicons name="add-circle-outline" size={24} color="#203627" />
                <Text style={styles.addAccountText}>Add Another Account</Text>
              </Pressable>
            }
          />
        )}
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(157, 196, 213, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EFEFEF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#203627',
    opacity: 0.6,
  },
  emptyContainer: {
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
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  institutionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  institutionInfo: {
    flex: 1,
    marginRight: 12,
  },
  institutionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#203627',
    marginBottom: 4,
  },
  institutionDetails: {
    fontSize: 14,
    color: '#203627',
    opacity: 0.6,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  warningText: {
    fontSize: 12,
    color: '#DC2626',
    marginLeft: 4,
    fontWeight: '500',
  },
  institutionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  relinkButton: {
    backgroundColor: '#203627',
  },
  relinkButtonText: {
    color: '#EFEFEF',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    gap: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addAccountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#203627',
  },
});