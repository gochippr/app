/**
 * Budget Run Game Board
 * 
 * A gamified daily budget challenge with streaks, tiles, and rewards.
 * Styled to match the app's design system.
 */

import { useAuth } from '@/context/auth';
import {
  BadgeInfo,
  ChallengeCheckResponse,
  checkDailyChallenge,
  DayStatus,
  GameBoardResponse,
  getBudgetRunStatus,
} from '@/services/budgetRunService';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface BudgetRunBoardProps {
  expanded?: boolean;
  onPress?: () => void;
}

// Map day names from API to display labels
const DAY_NAME_MAP: Record<string, string> = {
  'sun': 'S',
  'mon': 'M', 
  'tue': 'T',
  'wed': 'W',
  'thu': 'T',
  'fri': 'F',
  'sat': 'S',
};

export default function BudgetRunBoard({ expanded = false, onPress }: BudgetRunBoardProps) {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  
  // Calculate progress bar width based on container padding
  const containerPadding = 16 * 2; // mx-4 = 16px each side
  const contentPadding = 16 * 2;   // p-4 = 16px each side
  const progressBarWidth = screenWidth - containerPadding - contentPadding;
  
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState<GameBoardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkingChallenge, setCheckingChallenge] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<BadgeInfo | null>(null);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  
  // Animation values
  const avatarBounce = useSharedValue(0);
  const streakPulse = useSharedValue(1);
  const progressGlow = useSharedValue(0.5);
  
  // Load game data
  const loadGameData = useCallback(async () => {
    if (!fetchWithAuth) return;
    
    try {
      setError(null);
      const data = await getBudgetRunStatus(fetchWithAuth);
      setGameData(data);
    } catch (err) {
      console.error('Error loading budget run:', err);
      setError('Unable to load Budget Run');
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);
  
  useEffect(() => {
    loadGameData();
  }, [loadGameData]);
  
  // Initialize animations (only run once on mount)
  useEffect(() => {
    // Avatar idle bounce
    avatarBounce.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    
    // Progress bar glow
    progressGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 })
      ),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: avatarBounce.value }],
  }));
  
  const streakStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakPulse.value }],
  }));
  
  // Handle checking challenge
  const handleCheckChallenge = async () => {
    if (!fetchWithAuth || checkingChallenge) return;
    
    setCheckingChallenge(true);
    try {
      const result: ChallengeCheckResponse = await checkDailyChallenge(fetchWithAuth);
      
      // Animate streak
      streakPulse.value = withSequence(
        withSpring(1.2),
        withSpring(1)
      );
      
      setCelebrationMessage(result.message);
      
      // Show badge modal if new badge earned
      if (result.new_badges.length > 0) {
        setUnlockedBadge(result.new_badges[0]);
        setTimeout(() => setShowBadgeModal(true), 500);
      }
      
      // Reload data
      await loadGameData();
      
      // Clear message after delay
      setTimeout(() => setCelebrationMessage(null), 3000);
    } catch (err) {
      console.error('Error checking challenge:', err);
    } finally {
      setCheckingChallenge(false);
    }
  };
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (!expanded) {
      router.push('/(tabs)/budget-run');
    }
  };
  
  // Render day tile
  const renderDayTile = (day: DayStatus, index: number) => {
    const isCompleted = day.status === 'completed' || day.status === 'success';
    const isFailed = day.status === 'failed' || day.status === 'missed';
    const isCurrent = day.status === 'current' || day.status === 'active';
    const isUpcoming = day.status === 'upcoming' || day.status === 'future';
    
    return (
      <View key={day.date} className="items-center">
        <View
          className={`w-10 h-10 rounded-xl items-center justify-center border ${
            isCompleted ? 'bg-[#55B685] border-[#55B685]' :
            isFailed ? 'bg-red-300 border-red-300' :
            isCurrent ? 'bg-[#EDFE66] border-[#253628] border-2' :
            'bg-gray-100 border-gray-300'
          }`}
        >
          {isCompleted && <Text className="text-white text-base font-bold">✓</Text>}
          {isFailed && <Text className="text-white text-base font-bold">✗</Text>}
          {isCurrent && (
            <Text className="text-xs font-bold text-[#253628]">
              ${Math.round(day.spent ?? 0)}
            </Text>
          )}
          {isUpcoming && <Text className="text-gray-400 text-sm">•</Text>}
        </View>
        <Text className={`text-xs mt-1 ${isCurrent ? 'font-bold text-[#253628]' : 'text-gray-500'}`}>
          {DAY_NAME_MAP[day.day] || day.day.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  };
  
  if (loading) {
    return (
      <View className="mx-4 my-2 p-6 bg-white rounded-xl items-center justify-center">
        <ActivityIndicator size="small" color="#253628" />
        <Text className="text-gray-500 mt-2 text-sm">Loading Budget Run...</Text>
      </View>
    );
  }
  
  if (error || !gameData) {
    return (
      <View className="mx-4 my-2 p-6 bg-white rounded-xl items-center">
        <Text className="text-4xl mb-2">🎯</Text>
        <Text className="text-lg font-semibold text-[#253628] mb-1">Daily Budget Run</Text>
        <Text className="text-gray-500 text-center text-sm mb-3">
          {error || 'Connect to start your budget challenge!'}
        </Text>
        <Pressable 
          onPress={loadGameData} 
          className="bg-[#A5C3D3] px-6 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </Pressable>
      </View>
    );
  }
  
  const { streak, game_board, today_challenge, upcoming_reward, rank } = gameData;
  
  const progressPercent = Math.min(100, (today_challenge.current_spent / today_challenge.budget_limit) * 100);
  const isOverBudget = today_challenge.current_spent > today_challenge.budget_limit;
  
  // Find the current day's index for avatar positioning
  const currentDayIndex = game_board.days.findIndex(
    day => day.status === 'current' || day.status === 'active'
  );
  const avatarPosition = currentDayIndex >= 0 ? currentDayIndex : game_board.avatar_position;
  
  const Container = expanded ? View : Pressable;
  const containerProps = expanded ? {} : { onPress: handlePress };
  
  return (
    <Container 
      className={`mx-4 my-2 bg-white rounded-xl overflow-hidden ${expanded ? 'flex-1' : ''}`}
      {...containerProps}
    >
      {/* Header */}
      <View className="p-4 bg-[#A5C3D3]">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">Daily Budget Run</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-white/80 text-sm">
                {rank?.icon || '🌱'} {rank?.name || 'Budget Newbie'}
              </Text>
            </View>
          </View>
          
          {/* Streak Badge */}
          <Animated.View 
            style={streakStyle}
            className="bg-white/20 px-3 py-2 rounded-xl items-center"
          >
            <Text className="text-2xl">🔥</Text>
            <Text className="text-white font-bold text-lg">{streak?.current ?? 0}</Text>
            <Text className="text-white/80 text-[10px] uppercase">streak</Text>
          </Animated.View>
        </View>
      </View>
      
      {/* Game Board */}
      <View className="p-4">
        {/* Week Progress */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-3">
            {game_board.days.map((day, index) => renderDayTile(day, index))}
          </View>
        </View>
        
        {/* Today's Challenge Card */}
        <View className="bg-gray-50 rounded-xl p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-semibold text-[#253628] uppercase tracking-wide">
              {"Today's Challenge"}
            </Text>
            {upcoming_reward?.badge && (
              <View className="bg-[#EDFE66] px-2 py-1 rounded-lg">
                <Text className="text-[10px] font-semibold text-[#253628]">
                  {upcoming_reward.icon || '🎯'} {upcoming_reward.days_remaining}d to {upcoming_reward.badge}
                </Text>
              </View>
            )}
          </View>
          
          <Text className="text-base font-medium text-gray-700 mb-3">
            {today_challenge.description}
          </Text>
          
          {/* Progress Bar */}
          <View className="mb-2">
            <View 
              style={{ 
                height: 12, 
                backgroundColor: '#E5E7EB', 
                borderRadius: 6,
              }}
            >
              <View 
                style={{ 
                  height: 12, 
                  backgroundColor: isOverBudget ? '#F87171' : '#55B685',
                  borderRadius: 6,
                  width: Math.max(0, (Math.min(progressPercent, 100) / 100) * (progressBarWidth - 32)),
                }}
              />
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : 'text-[#55B685]'}`}>
                ${today_challenge.current_spent.toFixed(2)} spent
              </Text>
              {isOverBudget ? (
                <Text className="text-sm text-red-500 font-semibold">
                  Over by ${(today_challenge.current_spent - today_challenge.budget_limit).toFixed(2)}
                </Text>
              ) : (
                <Text className="text-sm text-gray-500">
                  ${today_challenge.remaining.toFixed(2)} left
                </Text>
              )}
            </View>
          </View>
          
          {/* Status Message */}
          {/* {celebrationMessage ? (
            <Text className="text-sm text-[#55B685] font-medium text-center mt-2">
              {celebrationMessage}
            </Text>
          ) : streak?.is_alive && !isOverBudget ? (
            <Text className="text-sm text-[#55B685] font-medium mt-2">
              💪 {streak.current} day streak! Keep it going!
            </Text>
          ) : isOverBudget ? (
            <Text className="text-sm text-red-500 font-medium mt-2">
              ⚠️ Over budget - try to cut back!
            </Text>
          ) : null} */}
        </View>
        
        {/* Action Buttons (expanded view only) */}
        {/* {expanded && (
          <View className="mt-4">
            <Pressable
              onPress={handleCheckChallenge}
              disabled={checkingChallenge || today_challenge.is_completed}
              className={`py-3 rounded-xl items-center ${
                today_challenge.is_completed 
                  ? 'bg-gray-200' 
                  : 'bg-[#253628]'
              }`}
            >
              {checkingChallenge ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className={`font-semibold ${
                  today_challenge.is_completed ? 'text-gray-500' : 'text-white'
                }`}>
                  {today_challenge.is_completed ? '✓ Challenge Completed' : 'Check My Progress'}
                </Text>
              )}
            </Pressable>
          </View>
        )} */}
        
        {/* Tap hint (collapsed view) */}
        {/* {!expanded && (
          <View className="mt-3 items-center">
            <Text className="text-xs text-gray-400">Tap for details →</Text>
          </View>
        )} */}
      </View>
      
      {/* Badge Unlock Modal */}
      {showBadgeModal && (
        <Modal
          visible={showBadgeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowBadgeModal(false)}
        >
          <Pressable 
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => setShowBadgeModal(false)}
          >
            <View className="bg-white rounded-3xl p-8 mx-8 items-center">
              <Text className="text-xl font-bold text-[#253628] mb-4">🎉 Badge Unlocked!</Text>
              {unlockedBadge && (
                <>
                  <Text className="text-6xl mb-3">{unlockedBadge.icon}</Text>
                  <Text className="text-2xl font-bold text-[#253628] mb-2">{unlockedBadge.name}</Text>
                  <Text className="text-gray-500 text-center mb-6">{unlockedBadge.description}</Text>
                </>
              )}
              <Pressable 
                onPress={() => setShowBadgeModal(false)}
                className="bg-[#EDFE66] px-8 py-3 rounded-xl"
              >
                <Text className="font-bold text-[#253628]">Awesome!</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}
    </Container>
  );
}
