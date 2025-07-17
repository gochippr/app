import React, { useState } from 'react';
import { View, Text, Pressable, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import PlaidManager from '@/components/PlaidManager';
import MockProtectedApi from '@/services/mockProtectedApi';
import { useAuth } from '@/context/auth';
import BottomNav from '@/components/BottomNav';
import { Ionicons } from '@expo/vector-icons';

export default function MainPage() {
  const [protectedData, setProtectedData] = useState({});
  const { user, signOut, fetchWithAuth } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.name || 'User'}!</Text>
            </View>
            <Pressable
              onPress={handleSignOut}
              style={styles.signOutButton}
            >
              <Ionicons name="log-out-outline" size={24} color="#EFEFEF" />
            </Pressable>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, styles.statCard1]}>
              <Text style={styles.statEmoji}>💰</Text>
              <Text style={styles.statLabel}>Balance</Text>
              <Text style={styles.statValue}>$1,234</Text>
            </View>
            <View style={[styles.statCard, styles.statCard2]}>
              <Text style={styles.statEmoji}>📈</Text>
              <Text style={styles.statLabel}>Saved</Text>
              <Text style={styles.statValue}>$456</Text>
            </View>
          </View>

          {/* Plaid Integration */}
          <View style={styles.plaidSection}>
            <PlaidManager fetchWithAuth={fetchWithAuth} user={user} />
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Text>🍕</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Pizza with friends</Text>
                <Text style={styles.activitySubtitle}>Split 4 ways</Text>
              </View>
              <Text style={styles.activityAmount}>-$12.50</Text>
            </View>
            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Text>☕</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Morning coffee</Text>
                <Text style={styles.activitySubtitle}>Today at 8:30 AM</Text>
              </View>
              <Text style={styles.activityAmount}>-$4.75</Text>
            </View>
          </View>

          {/* Debug Section - Remove in production */}
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>Debug - Protected Data:</Text>
            <Text style={styles.debugContent}>
              {JSON.stringify(protectedData, null, 2)}
            </Text>
            <Pressable
              onPress={async () => {
                try {
                  const data = await MockProtectedApi.getProtectedData(fetchWithAuth);
                  console.log("Protected data:", data);
                  setProtectedData(data);
                } catch (error) {
                  console.error("Error fetching protected data:", error);
                }
              }}
              style={styles.debugButton}
            >
              <Text style={styles.debugButtonText}>
                Fetch Protected Data
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomNav />
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
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#9DC4D5',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EFEFEF',
  },
  signOutButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(157, 196, 213, 0.2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statCard1: {
    backgroundColor: '#E8FF40',
  },
  statCard2: {
    backgroundColor: '#9DC4D5',
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#203627',
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#203627',
  },
  plaidSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  activitySection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#203627',
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#EFEFEF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#203627',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#203627',
    opacity: 0.6,
  },
  activityAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#203627',
  },
  debugSection: {
    margin: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#9DC4D5',
  },
  debugTitle: {
    fontSize: 14,
    color: '#203627',
    opacity: 0.6,
    marginBottom: 8,
  },
  debugContent: {
    fontSize: 12,
    color: '#203627',
    opacity: 0.5,
    backgroundColor: '#EFEFEF',
    padding: 8,
    borderRadius: 8,
    fontFamily: 'monospace',
  },
  debugButton: {
    backgroundColor: '#9DC4D5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#203627',
    fontWeight: '600',
    fontSize: 14,
  },
});