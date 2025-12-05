/**
 * Budget Run Full Screen
 * 
 * Dedicated screen for the Daily Budget Run game with full interactions.
 */

import { useAuth } from '@/context/auth';
import { BudgetRunBoard } from '@/features/budgetRun';
import {
  BadgeInfo,
  GameBoardResponse,
  getBadges,
  getBudgetRunStatus,
  getLeaderboard,
  LeaderboardResponse,
} from '@/services/budgetRunService';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View
} from 'react-native';

// All possible badges in the system
const ALL_BADGES = [
  { type: 'newbie', name: 'Budget Newbie', icon: '🌱', description: 'Started your journey' },
  { type: 'bronze', name: 'Bronze Saver', icon: '🥉', description: '3-day streak' },
  { type: 'silver', name: 'Silver Saver', icon: '🥈', description: '7-day streak' },
  { type: 'gold', name: 'Gold Saver', icon: '🥇', description: '14-day streak' },
  { type: 'diamond', name: 'Diamond Saver', icon: '💎', description: '30-day streak' },
  { type: 'perfect_week', name: 'Perfect Week', icon: '⭐', description: '7 days in a row' },
  { type: 'comeback', name: 'Comeback Kid', icon: '💪', description: 'Recovered a streak' },
  { type: 'consistent', name: 'Consistent', icon: '📈', description: '10 total wins' },
];

export default function BudgetRunScreen() {
  const { fetchWithAuth } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gameData, setGameData] = useState<GameBoardResponse | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<BadgeInfo[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  
  const loadData = useCallback(async () => {
    if (!fetchWithAuth) return;
    
    try {
      const [gameResponse, badgesResponse, leaderboardResponse] = await Promise.all([
        getBudgetRunStatus(fetchWithAuth),
        getBadges(fetchWithAuth),
        getLeaderboard(fetchWithAuth),
      ]);
      
      setGameData(gameResponse);
      setEarnedBadges(badgesResponse);
      setLeaderboard(leaderboardResponse);
    } catch (err) {
      console.error('Error loading budget run data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchWithAuth]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };
  
  if (loading) {
    return (
      <View className="flex-1 bg-[#EFEFEF] items-center justify-center">
        <ActivityIndicator size="large" color="#253628" />
      </View>
    );
  }
  
  const earnedBadgeTypes = new Set(earnedBadges.map(b => b.type));
  
  return (
    <View className="flex-1 bg-[#EFEFEF]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View className="px-4 pt-16 pb-4">
          <Text className="text-3xl font-bold text-[#253628]">Daily Budget Run</Text>
          <Text className="text-gray-500 mt-1">Stay on budget, build your streak! 🔥</Text>
        </View>
        
        {/* Game Board */}
        <BudgetRunBoard expanded gameData={gameData} />
        
        {/* Stats Cards */}
        {gameData && (
          <View className="px-4 mt-4">
            <Text className="text-lg font-semibold text-[#253628] mb-3">Your Stats</Text>
            <View className="flex-row flex-wrap gap-3">
              <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 items-center">
                <Text className="text-3xl mb-1">🔥</Text>
                <Text className="text-2xl font-bold text-[#253628]">{gameData.streak.current}</Text>
                <Text className="text-xs text-gray-500 uppercase">Current Streak</Text>
              </View>
              <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 items-center">
                <Text className="text-3xl mb-1">🏆</Text>
                <Text className="text-2xl font-bold text-[#253628]">{gameData.streak.longest}</Text>
                <Text className="text-xs text-gray-500 uppercase">Best Streak</Text>
              </View>
              <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 items-center">
                <Text className="text-3xl mb-1">✅</Text>
                <Text className="text-2xl font-bold text-[#253628]">{gameData.streak.total_successful_days}</Text>
                <Text className="text-xs text-gray-500 uppercase">Total Wins</Text>
              </View>
              <View className="flex-1 min-w-[45%] bg-white rounded-xl p-4 items-center">
                <Text className="text-3xl mb-1">{gameData.rank.icon}</Text>
                <Text className="text-2xl font-bold text-[#253628]">{earnedBadges.length}</Text>
                <Text className="text-xs text-gray-500 uppercase">Badges</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* Badge Collection */}
        <View className="px-4 mt-6">
          <Text className="text-lg font-semibold text-[#253628] mb-3">Badge Collection</Text>
          <View className="flex-row flex-wrap gap-2">
            {ALL_BADGES.map((badge) => {
              const isEarned = earnedBadgeTypes.has(badge.type);
              return (
                <View 
                  key={badge.type}
                  className={`w-[31%] bg-white rounded-xl p-3 items-center ${!isEarned ? 'opacity-40' : ''}`}
                >
                  <Text className="text-3xl mb-1">{badge.icon}</Text>
                  <Text className="text-xs font-semibold text-[#253628] text-center" numberOfLines={1}>
                    {badge.name}
                  </Text>
                  {isEarned && (
                    <View className="absolute top-1 right-1">
                      <Ionicons name="checkmark-circle" size={14} color="#55B685" />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
        
        {/* How It Works */}
        <View className="px-4 mt-6 mb-8">
          <Text className="text-lg font-semibold text-[#253628] mb-3">How It Works</Text>
          <View className="bg-white rounded-xl p-4">
            {[
              { num: '1', title: 'Daily Challenge', desc: 'Get a spending target each day' },
              { num: '2', title: 'Track Progress', desc: 'Watch your spending throughout the day' },
              { num: '3', title: 'Build Streaks', desc: 'Stay under budget to grow your streak' },
              { num: '4', title: 'Earn Rewards', desc: 'Unlock badges as you progress' },
            ].map((step, index) => (
              <View key={step.num} className={`flex-row items-start ${index > 0 ? 'mt-4' : ''}`}>
                <View className="w-7 h-7 rounded-full bg-[#EDFE66] items-center justify-center mr-3">
                  <Text className="font-bold text-[#253628]">{step.num}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-[#253628]">{step.title}</Text>
                  <Text className="text-sm text-gray-500">{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
