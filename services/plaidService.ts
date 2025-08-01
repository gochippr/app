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

  // Get user's connected institutions
  async getInstitutions(): Promise<InstitutionsResponse> {
    const response = await this.fetchWithAuth(`${BACKEND_URL}/plaid/institutions`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get institutions: ${response.statusText}`);
    }

    return response.json();
  }

  // Get accounts for a specific item
  async getAccounts(itemId: string): Promise<AccountsResponse> {
    const response = await this.fetchWithAuth(`${BACKEND_URL}/plaid/accounts/${itemId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get accounts: ${response.statusText}`);
    }

    return response.json();
  }

  // Get transactions for a specific item
  async getTransactions(
    itemId: string,
    startDate?: string,
    endDate?: string,
    accountIds?: string[]
  ): Promise<TransactionsResponse> {
    const params = new URLSearchParams();
    params.append('item_id', itemId);
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (accountIds) {
      accountIds.forEach(id => params.append('account_ids', id));
    }

    const response = await this.fetchWithAuth(`${BACKEND_URL}/plaid/transactions?${params.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get transactions: ${response.statusText}`);
    }

    return response.json();
  }

  // Check if user has any connected accounts
  async hasConnectedAccounts(): Promise<boolean> {
    try {
      const institutions = await this.getInstitutions();
      return institutions.institutions.length > 0;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      throw error;
    }
  }

  // Get recent transactions (last 10) for the first connected institution
  async getRecentTransactions(): Promise<TransactionsResponse> {
    const institutions = await this.getInstitutions();
    
    if (institutions.institutions.length === 0) {
      throw new Error('No connected institutions found');
    }

    const firstInstitution = institutions.institutions[0];
    
    // Get last 30 days of transactions
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return this.getTransactions(firstInstitution.item_id, startDate, endDate);
  }

  // Delete a connected institution
  async deleteInstitution(institutionId: string): Promise<void> {
    const response = await this.fetchWithAuth(`${BACKEND_URL}/plaid/institutions/${institutionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete institution: ${response.statusText}`);
    }
  }

  // Create link token for update mode (relinking)
  async createUpdateLinkToken(itemId: string): Promise<LinkTokenResponse> {
    const response = await this.fetchWithAuth(`${BACKEND_URL}/plaid/create_link_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_name: 'Chippr',
        mode: 'update',
        item_id: itemId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create update link token: ${response.statusText}`);
    }

    return response.json();
  }
}

export default PlaidService; 