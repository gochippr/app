import { BACKEND_URL } from "@/utils/constants";

export interface Transaction {
  id: string;
  account_id: string;
  external_txn_id?: string;
  amount: number;
  currency?: string;
  type: string;
  merchant_name?: string;
  description: string;
  category: string;
  authorized_date?: string; // ISO date string
  posted_date: string; // ISO date string
  pending: boolean;
  original_payer_user_id?: string;
  created_at: string; // ISO date string
  split_total?: number;
  user_amount?: number;
  has_split?: boolean;
}

export interface TransactionCategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface TransactionSummaryResponse {
  period_start: string; // ISO date string
  period_end: string; // ISO date string
  total_spent: number;
  categories: TransactionCategorySummary[];
}

export async function getTransactions(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<Transaction[]> {
  const response = await fetchWithAuth(`${BACKEND_URL}/transactions`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  const data = await response.json();

  return data["transactions"];
}

export async function getTransactionSummary(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<TransactionSummaryResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/transactions/summary`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transaction summary");
  }

  return response.json();
}
