/**
 * Budget Run API Service
 * 
 * Handles all API calls for the Daily Budget Run gamification feature.
 */

import { BACKEND_URL } from "@/utils/constants";

// ============================================================================
// Types matching backend models
// ============================================================================

export interface StreakInfo {
  current: number;
  longest: number;
  start_date: string | null;
  total_successful_days: number;
  is_alive: boolean;
}

export interface DayStatus {
  day: string;
  date: string;
  day_index: number;
  status: 'completed' | 'failed' | 'current' | 'upcoming' | 'missed' | 'active' | 'future' | 'success';
  spent: number | null;
  limit: number | null;
}

export interface GameBoard {
  week_start_date: string;
  days: DayStatus[];
  avatar_position: number;
  days_completed_this_week: number;
}

export interface TodayChallenge {
  id: string;
  date: string;
  budget_limit: number;
  current_spent: number;
  remaining: number;
  challenge_type: string;
  description: string;
  is_completed: boolean;
  status: 'pending' | 'success' | 'over_budget';
}

export interface UpcomingReward {
  badge: string;
  name: string;
  icon: string;
  days_remaining: number;
  streak_required: number;
}

export interface BadgeInfo {
  type: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface RankInfo {
  name: string;
  icon: string;
  level: number;
  badge_count: number;
}

export interface GameBoardResponse {
  streak: StreakInfo;
  game_board: GameBoard;
  today_challenge: TodayChallenge;
  upcoming_reward: UpcomingReward;
  badges: BadgeInfo[];
  rank: RankInfo;
}

export interface ChallengeCheckResponse {
  success: boolean;
  challenge: TodayChallenge;
  new_badges: BadgeInfo[];
  streak_update: StreakInfo;
  message: string;
}

export interface SetBudgetRequest {
  budget_limit: number;
  challenge_type?: string;
  target_date?: string;
}

export interface SetBudgetResponse {
  challenge: TodayChallenge;
  message: string;
}

export interface LeaderboardEntry {
  streak: number;
  longest_streak: number;
  total_successful_days: number;
  badge_count: number;
}

export interface LeaderboardResponse {
  your_rank: LeaderboardEntry;
  message: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get the complete game board status
 */
export async function getBudgetRunStatus(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<GameBoardResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/budget-run`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch budget run status");
  }

  return response.json();
}

/**
 * Check and evaluate today's challenge
 */
export async function checkDailyChallenge(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<ChallengeCheckResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/budget-run/check`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to check daily challenge");
  }

  return response.json();
}

/**
 * Get today's challenge details
 */
export async function getTodayChallenge(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<TodayChallenge> {
  const response = await fetchWithAuth(`${BACKEND_URL}/budget-run/today`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch today's challenge");
  }

  return response.json();
}

/**
 * Get current streak info
 */
export async function getStreak(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<StreakInfo> {
  const response = await fetchWithAuth(`${BACKEND_URL}/budget-run/streak`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch streak");
  }

  return response.json();
}

/**
 * Get all earned badges
 */
export async function getBadges(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<BadgeInfo[]> {
  const response = await fetchWithAuth(`${BACKEND_URL}/budget-run/badges`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch badges");
  }

  return response.json();
}

/**
 * Set a custom daily budget
 */
export async function setDailyBudget(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>,
  request: SetBudgetRequest
): Promise<SetBudgetResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/budget-run/budget`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to set daily budget");
  }

  return response.json();
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<LeaderboardResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/budget-run/leaderboard`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  return response.json();
}

