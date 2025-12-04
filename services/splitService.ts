import { BACKEND_URL } from "@/utils/constants";

export interface SplitTotalsResponse {
  total_owed_to_you: number;
  total_you_owe: number;
  net_balance: number;
}

export interface SplitFriend {
  id: string;
  email: string;
  name?: string | null;
  photo_url?: string | null;
}

export interface FriendSplitSummary {
  friend: SplitFriend;
  amount_owed_to_you: number;
  amount_you_owe: number;
  net_balance: number;
}

export interface FriendsSplitSummaryResponse {
  totals: SplitTotalsResponse;
  friends: FriendSplitSummary[];
}

export type SplitDirection = "you_owe" | "they_owe";

export interface FriendSplitListItem {
  split_id: string;
  transaction_id: string;
  transaction_amount: number;
  transaction_currency?: string | null;
  transaction_description?: string | null;
  merchant_name?: string | null;
  category?: string | null;
  posted_date?: string | null;
  created_at: string;
  updated_at: string;
  share_amount: number;
  direction: SplitDirection;
  note?: string | null;
  payer_user_id: string;
}

export interface FriendSplitListResponse {
  friend: SplitFriend;
  totals: SplitTotalsResponse;
  splits: FriendSplitListItem[];
}

export interface SplitParticipant {
  user_id: string;
  email: string;
  name?: string | null;
  photo_url?: string | null;
  amount: number;
  role: "payer" | "debtor";
  is_current_user: boolean;
}

export interface SplitTransactionInfo {
  transaction_id: string;
  transaction_amount: number;
  transaction_currency?: string | null;
  transaction_description?: string | null;
  merchant_name?: string | null;
  category?: string | null;
  type: string;
  posted_date?: string | null;
  authorized_date?: string | null;
  payer_user_id: string;
  split_total: number;
}

export interface SplitDetailResponse {
  split_id: string;
  share_amount: number;
  note?: string | null;
  direction: SplitDirection;
  can_edit: boolean;
  transaction: SplitTransactionInfo;
  participants: SplitParticipant[];
}

export interface TransactionSplitsResponse {
  transaction: SplitTransactionInfo;
  participants: SplitParticipant[];
  has_splits: boolean;
}

export interface TransactionSplitInput {
  debtor_user_id: string;
  amount: number;
  note?: string | null;
}

export interface TransactionSplitUpsertRequest {
  splits: TransactionSplitInput[];
}

async function parseJsonOrThrow<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData?.detail || fallbackMessage);
    } catch (jsonError) {
      const text = await response.text();
      throw new Error(text || fallbackMessage);
    }
  }
  return response.json();
}

export async function getSplitTotals(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<SplitTotalsResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/splits/summary`, {
    method: "GET",
  });
  return parseJsonOrThrow(response, "Failed to fetch split totals");
}

export async function getFriendSplitSummaries(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<FriendsSplitSummaryResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/splits/friends`, {
    method: "GET",
  });
  return parseJsonOrThrow(response, "Failed to fetch friend splits");
}

export async function getFriendSplits(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>,
  friendUserId: string
): Promise<FriendSplitListResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/splits/friends/${friendUserId}`, {
    method: "GET",
  });
  return parseJsonOrThrow(response, "Failed to fetch splits for friend");
}

export async function getSplitDetail(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>,
  splitId: string
): Promise<SplitDetailResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/splits/${splitId}`, {
    method: "GET",
  });
  return parseJsonOrThrow(response, "Failed to fetch split detail");
}

export async function getTransactionSplits(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>,
  transactionId: string
): Promise<TransactionSplitsResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/splits/transactions/${transactionId}`, {
    method: "GET",
  });
  return parseJsonOrThrow(response, "Failed to load transaction splits");
}

export async function upsertTransactionSplits(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>,
  transactionId: string,
  payload: TransactionSplitUpsertRequest
): Promise<TransactionSplitsResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/splits/transactions/${transactionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(response, "Failed to save splits");
}
