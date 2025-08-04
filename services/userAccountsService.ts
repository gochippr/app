import { BACKEND_URL } from "@/utils/constants";

export interface AccountBalance {
  account_id: string;
  account_name: string;
  account_type: string;
  current_balance: number;
  available_balance?: number;
  currency: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: string; // 'personal' or 'debt_ledger'
  description?: string;
  external_account_id?: string;
  external_institution_id?: string;
  mask?: string;
  official_name?: string;
  subtype?: string;
  verification_status?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAccountsResponse {
  accounts: Account[];
  balances: AccountBalance[];
  total_accounts: number;
  ingestion_started: boolean;
}

export default class UserAccountsService {
  static async getUserAccounts(fetchWithAuth: (url: string, options: RequestInit) =>
    Promise<Response>): Promise<UserAccountsResponse> {

    try {
      const response = await fetchWithAuth(`${BACKEND_URL}/users/accounts`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user accounts");
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching user accounts:", error);
      throw error;
    }
  }
} 