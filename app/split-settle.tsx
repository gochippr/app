import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import BottomNav from '@/components/BottomNav';

export default function SplitSettlePage() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Split & Settle</Text>
          <Text style={styles.headerSubtitle}>Share expenses with friends</Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderEmoji}>👥</Text>
            <Text style={styles.placeholderText}>Bill splitting coming soon!</Text>
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
    paddingBottom: 100,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    color: '#203627',
    opacity: 0.6,
  },
});