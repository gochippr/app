import { BACKEND_URL } from "@/utils/constants";

export interface PlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  current_balance: number;
  available_balance: number;
  iso_currency_code: string;
  unofficial_currency_code?: string;
}

export interface PlaidTransaction {
  id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name?: string;
  category?: string[];
  pending: boolean;
  iso_currency_code: string;
  unofficial_currency_code?: string;
}

export interface PlaidInstitution {
  id: string;
  user_id: string;
  item_id: string;
  institution_id: string;
  institution_name: string;
  created_at: string;
  updated_at: string;
  delete_at?: string;
  is_active: boolean;
}

export interface LinkTokenResponse {
  link_token: string;
  expiration?: string;
}

export interface PublicTokenExchangeResponse {
  item_id: string;
  access_token: string;
  db_id: number;
}

export interface AccountsResponse {
  accounts: PlaidAccount[];
}

export interface TransactionsResponse {
  transactions: PlaidTransaction[];
  total_transactions: number;
}

export interface InstitutionsResponse {
  institutions: PlaidInstitution[];
}

class PlaidService {
  private fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>;

  constructor(fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>) {
    this.fetchWithAuth = fetchWithAuth;
  }

  // Create link token for Plaid Link
  async createLinkToken(clientName?: string): Promise<LinkTokenResponse> {
    const response = await this.fetchWithAuth(`${BACKEND_URL}/plaid/create_link_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: clientName || 'Chippr',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create link token: ${response.statusText}`);
    }

    return response.json();
  }

  // Exchange public token for access token
  async exchangePublicToken(
    publicToken: string,
    institutionId?: string,
    institutionName?: string
  ): Promise<PublicTokenExchangeResponse> {
    const response = await this.fetchWithAuth(`${BACKEND_URL}/plaid/exchange_public_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_token: publicToken,
        institution_id: institutionId,
        institution_name: institutionName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange public token: ${response.statusText}`);
    }

    return response.json();
  }
}

export default PlaidService; 