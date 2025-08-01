import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SplitSettlePage() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Split & Settle</Text>
          <Text style={styles.headerSubtitle}>Share expenses with friends</Text>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Pressable style={[styles.actionCard, styles.splitCard]}>
              <Ionicons name="git-branch-outline" size={32} color="#203627" />
              <Text style={styles.actionTitle}>Split Bill</Text>
              <Text style={styles.actionSubtitle}>Divide expenses equally</Text>
            </Pressable>
            
            <Pressable style={[styles.actionCard, styles.settleCard]}>
              <Ionicons name="checkmark-circle-outline" size={32} color="#203627" />
              <Text style={styles.actionTitle}>Settle Up</Text>
              <Text style={styles.actionSubtitle}>Clear your debts</Text>
            </Pressable>
          </View>

          {/* Recent Splits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Splits</Text>
            
            <View style={styles.splitItem}>
              <View style={styles.splitIcon}>
                <Text>🍕</Text>
              </View>
              <View style={styles.splitContent}>
                <Text style={styles.splitTitle}>Pizza Night</Text>
                <Text style={styles.splitMembers}>You, Alex, Sam, Jordan</Text>
              </View>
              <View style={styles.splitAmount}>
                <Text style={styles.youOwe}>You owe</Text>
                <Text style={styles.amountText}>$12.50</Text>
              </View>
            </View>

            <View style={styles.splitItem}>
              <View style={styles.splitIcon}>
                <Text>🎬</Text>
              </View>
              <View style={styles.splitContent}>
                <Text style={styles.splitTitle}>Movie Tickets</Text>
                <Text style={styles.splitMembers}>You and Chris</Text>
              </View>
              <View style={styles.splitAmount}>
                <Text style={styles.theyOwe}>They owe</Text>
                <Text style={[styles.amountText, styles.positiveAmount]}>$15.00</Text>
              </View>
            </View>
          </View>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <Ionicons name="people-circle-outline" size={64} color="#9DC4D5" />
            <Text style={styles.emptyTitle}>Start splitting!</Text>
            <Text style={styles.emptySubtitle}>
              Add your first bill to split with friends
            </Text>
          </View>
        </ScrollView>
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  splitCard: {
    borderWidth: 2,
    borderColor: '#E8FF40',
  },
  settleCard: {
    borderWidth: 2,
    borderColor: '#9DC4D5',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#203627',
    marginTop: 8,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#203627',
    opacity: 0.6,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#203627',
    marginBottom: 16,
  },
  splitItem: {
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
  splitIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#EFEFEF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  splitContent: {
    flex: 1,
  },
  splitTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#203627',
    marginBottom: 2,
  },
  splitMembers: {
    fontSize: 14,
    color: '#203627',
    opacity: 0.6,
  },
  splitAmount: {
    alignItems: 'flex-end',
  },
  youOwe: {
    fontSize: 12,
    color: '#203627',
    opacity: 0.6,
    marginBottom: 2,
  },
  theyOwe: {
    fontSize: 12,
    color: '#203627',
    opacity: 0.6,
    marginBottom: 2,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
  },
  positiveAmount: {
    color: '#059669',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#203627',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#203627',
    opacity: 0.6,
    textAlign: 'center',
  },
});