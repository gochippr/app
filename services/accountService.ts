import { BACKEND_URL } from "@/utils/constants";

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: "personal" | "debt_ledger";
  description?: string;
  external_account_id?: string;
  external_institution_id?: string;
  mask?: string;
  official_name?: string;
  subtype?: string;
  verification_status?: string;
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface UserBalance {
  total_balance: number;
  friend_credit: number;
  friend_debt: number;
  real_credit_available: number;
}

export async function getAccounts(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<Account[]> {
  const response = await fetchWithAuth(`${BACKEND_URL}/accounts`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch protected data");
  }

  const body = await response.json();
  return body.accounts;
}

export async function getUserBalance(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<UserBalance> {
  const response = await fetchWithAuth(`${BACKEND_URL}/accounts/balance`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user balance");
  }
  
  return response.json();
}


export async function syncAccounts(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<void> {
  const response = await fetchWithAuth(`${BACKEND_URL}/plaid/sync`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to sync accounts");
  }
}