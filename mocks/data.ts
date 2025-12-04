/**
 * Mock Data for Development
 * 
 * Contains realistic sample data for all services
 */

import { Transaction, TransactionSummaryResponse } from "@/services/transactionService";
import { Account, UserBalance } from "@/services/accountService";
import { FriendRelationship, FriendRequestListResponse } from "@/services/friendService";
import { 
  FriendsSplitSummaryResponse, 
  FriendSplitListResponse, 
  SplitDetailResponse,
  TransactionSplitsResponse 
} from "@/services/splitService";
import { UserAccountsResponse } from "@/services/userAccountsService";
import { AuthUser } from "@/context/auth";

// ============================================
// MOCK USER
// ============================================
export const mockUser: AuthUser = {
  id: "mock-user-123",
  email: "demo@chippr.app",
  name: "Alex Demo",
  picture: undefined,
  given_name: "Alex",
  family_name: "Demo",
  email_verified: true,
  provider: "mock",
};

// ============================================
// MOCK FRIENDS
// ============================================
const mockFriendUsers = [
  {
    id: "friend-001",
    email: "sarah.johnson@email.com",
    name: "Sarah Johnson",
    photo_url: null,
  },
  {
    id: "friend-002",
    email: "mike.chen@email.com",
    name: "Mike Chen",
    photo_url: null,
  },
  {
    id: "friend-003",
    email: "emma.wilson@email.com",
    name: "Emma Wilson",
    photo_url: null,
  },
  {
    id: "friend-004",
    email: "james.taylor@email.com",
    name: "James Taylor",
    photo_url: null,
  },
];

export const mockFriends: FriendRelationship[] = [
  {
    friend: mockFriendUsers[0],
    status: "accepted",
    initiator_user_id: "mock-user-123",
    created_at: "2024-10-15T10:30:00Z",
    updated_at: "2024-10-15T11:00:00Z",
    is_incoming_request: false,
    is_outgoing_request: false,
  },
  {
    friend: mockFriendUsers[1],
    status: "accepted",
    initiator_user_id: "friend-002",
    created_at: "2024-09-20T14:00:00Z",
    updated_at: "2024-09-21T09:00:00Z",
    is_incoming_request: false,
    is_outgoing_request: false,
  },
  {
    friend: mockFriendUsers[2],
    status: "accepted",
    initiator_user_id: "mock-user-123",
    created_at: "2024-11-01T16:45:00Z",
    updated_at: "2024-11-02T08:30:00Z",
    is_incoming_request: false,
    is_outgoing_request: false,
  },
];

export const mockFriendRequests: FriendRequestListResponse = {
  incoming: [
    {
      friend: mockFriendUsers[3],
      status: "pending",
      initiator_user_id: "friend-004",
      created_at: "2024-11-28T09:00:00Z",
      updated_at: "2024-11-28T09:00:00Z",
      is_incoming_request: true,
      is_outgoing_request: false,
    },
  ],
  outgoing: [
    {
      friend: {
        id: "pending-friend-001",
        email: "olivia.martinez@email.com",
        name: "Olivia Martinez",
        photo_url: null,
      },
      status: "pending",
      initiator_user_id: "mock-user-123",
      created_at: "2024-11-25T14:30:00Z",
      updated_at: "2024-11-25T14:30:00Z",
      is_incoming_request: false,
      is_outgoing_request: true,
    },
  ],
};

// ============================================
// MOCK ACCOUNTS
// ============================================
export const mockAccounts: Account[] = [
  {
    id: "account-001",
    user_id: "mock-user-123",
    name: "Checking Account",
    type: "personal",
    description: "Main checking account",
    external_account_id: "plaid-acct-001",
    external_institution_id: "ins_001",
    mask: "4567",
    official_name: "Premier Checking",
    subtype: "checking",
    verification_status: "verified",
    is_active: true,
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2024-11-28T12:00:00Z",
  },
  {
    id: "account-002",
    user_id: "mock-user-123",
    name: "Savings Account",
    type: "personal",
    description: "Emergency fund",
    external_account_id: "plaid-acct-002",
    external_institution_id: "ins_001",
    mask: "8901",
    official_name: "High-Yield Savings",
    subtype: "savings",
    verification_status: "verified",
    is_active: true,
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2024-11-28T12:00:00Z",
  },
  {
    id: "account-003",
    user_id: "mock-user-123",
    name: "Credit Card",
    type: "personal",
    description: "Rewards credit card",
    external_account_id: "plaid-acct-003",
    external_institution_id: "ins_002",
    mask: "2345",
    official_name: "Cashback Rewards Card",
    subtype: "credit card",
    verification_status: "verified",
    is_active: true,
    created_at: "2024-07-15T14:00:00Z",
    updated_at: "2024-11-28T12:00:00Z",
  },
];

export const mockUserBalance: UserBalance = {
  total_balance: 8542.35,
  friend_credit: 245.50,
  friend_debt: 87.25,
  real_credit_available: 8700.60,
};

// ============================================
// MOCK TRANSACTIONS
// ============================================
const today = new Date();
const daysAgo = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

export const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    account_id: "account-001",
    external_txn_id: "ext-txn-001",
    amount: 156.32,
    currency: "USD",
    type: "debit",
    merchant_name: "Whole Foods Market",
    description: "Groceries",
    category: "Food & Drink",
    authorized_date: daysAgo(1),
    posted_date: daysAgo(0),
    pending: false,
    created_at: daysAgo(0),
    has_split: true,
    split_total: 78.16,
    user_amount: 78.16,
  },
  {
    id: "txn-002",
    account_id: "account-003",
    external_txn_id: "ext-txn-002",
    amount: 89.99,
    currency: "USD",
    type: "debit",
    merchant_name: "Netflix",
    description: "Monthly subscription",
    category: "Entertainment",
    authorized_date: daysAgo(2),
    posted_date: daysAgo(1),
    pending: false,
    created_at: daysAgo(1),
  },
  {
    id: "txn-003",
    account_id: "account-001",
    external_txn_id: "ext-txn-003",
    amount: 45.00,
    currency: "USD",
    type: "debit",
    merchant_name: "Shell Gas Station",
    description: "Gas",
    category: "Transportation",
    authorized_date: daysAgo(3),
    posted_date: daysAgo(2),
    pending: false,
    created_at: daysAgo(2),
  },
  {
    id: "txn-004",
    account_id: "account-003",
    external_txn_id: "ext-txn-004",
    amount: 234.50,
    currency: "USD",
    type: "debit",
    merchant_name: "Amazon",
    description: "Electronics purchase",
    category: "Shopping",
    authorized_date: daysAgo(4),
    posted_date: daysAgo(3),
    pending: false,
    created_at: daysAgo(3),
    has_split: true,
    split_total: 117.25,
    user_amount: 117.25,
  },
  {
    id: "txn-005",
    account_id: "account-001",
    external_txn_id: "ext-txn-005",
    amount: 12.50,
    currency: "USD",
    type: "debit",
    merchant_name: "Starbucks",
    description: "Coffee",
    category: "Food & Drink",
    authorized_date: daysAgo(4),
    posted_date: daysAgo(4),
    pending: false,
    created_at: daysAgo(4),
  },
  {
    id: "txn-006",
    account_id: "account-003",
    external_txn_id: "ext-txn-006",
    amount: 67.80,
    currency: "USD",
    type: "debit",
    merchant_name: "Uber",
    description: "Ride to airport",
    category: "Transportation",
    authorized_date: daysAgo(5),
    posted_date: daysAgo(5),
    pending: false,
    created_at: daysAgo(5),
    has_split: true,
    split_total: 33.90,
    user_amount: 33.90,
  },
  {
    id: "txn-007",
    account_id: "account-001",
    external_txn_id: "ext-txn-007",
    amount: 125.00,
    currency: "USD",
    type: "debit",
    merchant_name: "Electric Company",
    description: "Monthly utility bill",
    category: "Bills & Utilities",
    authorized_date: daysAgo(7),
    posted_date: daysAgo(6),
    pending: false,
    created_at: daysAgo(6),
  },
  {
    id: "txn-008",
    account_id: "account-003",
    external_txn_id: "ext-txn-008",
    amount: 85.20,
    currency: "USD",
    type: "debit",
    merchant_name: "Target",
    description: "Household items",
    category: "Shopping",
    authorized_date: daysAgo(8),
    posted_date: daysAgo(7),
    pending: false,
    created_at: daysAgo(7),
  },
  {
    id: "txn-009",
    account_id: "account-001",
    external_txn_id: "ext-txn-009",
    amount: 42.30,
    currency: "USD",
    type: "debit",
    merchant_name: "Chipotle",
    description: "Dinner with friends",
    category: "Food & Drink",
    authorized_date: daysAgo(9),
    posted_date: daysAgo(8),
    pending: false,
    created_at: daysAgo(8),
    has_split: true,
    split_total: 21.15,
    user_amount: 21.15,
  },
  {
    id: "txn-010",
    account_id: "account-003",
    external_txn_id: "ext-txn-010",
    amount: 199.00,
    currency: "USD",
    type: "debit",
    merchant_name: "Gym Membership",
    description: "Annual gym fee",
    category: "Health & Fitness",
    authorized_date: daysAgo(10),
    posted_date: daysAgo(9),
    pending: false,
    created_at: daysAgo(9),
  },
  {
    id: "txn-011",
    account_id: "account-001",
    external_txn_id: "ext-txn-011",
    amount: 35.00,
    currency: "USD",
    type: "credit",
    merchant_name: "Venmo",
    description: "Payment from Sarah",
    category: "Transfer",
    authorized_date: daysAgo(10),
    posted_date: daysAgo(10),
    pending: false,
    created_at: daysAgo(10),
  },
  {
    id: "txn-012",
    account_id: "account-003",
    external_txn_id: "ext-txn-012",
    amount: 55.40,
    currency: "USD",
    type: "debit",
    merchant_name: "CVS Pharmacy",
    description: "Prescriptions",
    category: "Health & Fitness",
    authorized_date: daysAgo(12),
    posted_date: daysAgo(11),
    pending: false,
    created_at: daysAgo(11),
  },
  {
    id: "txn-013",
    account_id: "account-001",
    external_txn_id: "ext-txn-013",
    amount: 28.99,
    currency: "USD",
    type: "debit",
    merchant_name: "Spotify",
    description: "Music subscription",
    category: "Entertainment",
    authorized_date: daysAgo(14),
    posted_date: daysAgo(13),
    pending: false,
    created_at: daysAgo(13),
  },
  {
    id: "txn-014",
    account_id: "account-003",
    external_txn_id: "ext-txn-014",
    amount: 320.00,
    currency: "USD",
    type: "debit",
    merchant_name: "Delta Airlines",
    description: "Flight booking",
    category: "Travel",
    authorized_date: daysAgo(15),
    posted_date: daysAgo(14),
    pending: false,
    created_at: daysAgo(14),
    has_split: true,
    split_total: 160.00,
    user_amount: 160.00,
  },
  {
    id: "txn-015",
    account_id: "account-001",
    external_txn_id: "ext-txn-015",
    amount: 18.50,
    currency: "USD",
    type: "debit",
    merchant_name: "Subway",
    description: "Lunch",
    category: "Food & Drink",
    authorized_date: daysAgo(16),
    posted_date: daysAgo(15),
    pending: false,
    created_at: daysAgo(15),
  },
];

export const mockTransactionSummary: TransactionSummaryResponse = {
  period_start: daysAgo(30),
  period_end: daysAgo(0),
  total_spent: 1515.50,
  categories: [
    { category: "Food & Drink", amount: 368.62, percentage: 24.3 },
    { category: "Shopping", amount: 319.70, percentage: 21.1 },
    { category: "Travel", amount: 320.00, percentage: 21.1 },
    { category: "Health & Fitness", amount: 254.40, percentage: 16.8 },
    { category: "Entertainment", amount: 118.98, percentage: 7.9 },
    { category: "Bills & Utilities", amount: 125.00, percentage: 8.2 },
    { category: "Transportation", amount: 112.80, percentage: 7.4 },
  ],
};

// ============================================
// MOCK SPLITS
// ============================================
export const mockFriendsSplitSummary: FriendsSplitSummaryResponse = {
  totals: {
    total_owed_to_you: 245.50,
    total_you_owe: 87.25,
    net_balance: 158.25,
  },
  friends: [
    {
      friend: mockFriendUsers[0],
      amount_owed_to_you: 145.50,
      amount_you_owe: 0,
      net_balance: 145.50,
    },
    {
      friend: mockFriendUsers[1],
      amount_owed_to_you: 100.00,
      amount_you_owe: 45.00,
      net_balance: 55.00,
    },
    {
      friend: mockFriendUsers[2],
      amount_owed_to_you: 0,
      amount_you_owe: 42.25,
      net_balance: -42.25,
    },
  ],
};

export const getMockFriendSplits = (friendId: string): FriendSplitListResponse => {
  const friend = mockFriendUsers.find(f => f.id === friendId) || mockFriendUsers[0];
  const summary = mockFriendsSplitSummary.friends.find(f => f.friend.id === friendId);
  
  return {
    friend,
    totals: {
      total_owed_to_you: summary?.amount_owed_to_you || 0,
      total_you_owe: summary?.amount_you_owe || 0,
      net_balance: summary?.net_balance || 0,
    },
    splits: [
      {
        split_id: `split-${friendId}-001`,
        transaction_id: "txn-001",
        transaction_amount: 156.32,
        transaction_currency: "USD",
        transaction_description: "Groceries",
        merchant_name: "Whole Foods Market",
        category: "Food & Drink",
        posted_date: daysAgo(0),
        created_at: daysAgo(0),
        updated_at: daysAgo(0),
        share_amount: 78.16,
        direction: "they_owe",
        note: "Weekly groceries split",
        payer_user_id: "mock-user-123",
      },
      {
        split_id: `split-${friendId}-002`,
        transaction_id: "txn-004",
        transaction_amount: 234.50,
        transaction_currency: "USD",
        transaction_description: "Electronics purchase",
        merchant_name: "Amazon",
        category: "Shopping",
        posted_date: daysAgo(3),
        created_at: daysAgo(3),
        updated_at: daysAgo(3),
        share_amount: 67.34,
        direction: "they_owe",
        note: "Shared electronics",
        payer_user_id: "mock-user-123",
      },
    ],
  };
};

export const getMockSplitDetail = (splitId: string): SplitDetailResponse => {
  return {
    split_id: splitId,
    share_amount: 78.16,
    note: "Weekly groceries split",
    direction: "they_owe",
    can_edit: true,
    transaction: {
      transaction_id: "txn-001",
      transaction_amount: 156.32,
      transaction_currency: "USD",
      transaction_description: "Groceries",
      merchant_name: "Whole Foods Market",
      category: "Food & Drink",
      type: "debit",
      posted_date: daysAgo(0),
      authorized_date: daysAgo(1),
      payer_user_id: "mock-user-123",
      split_total: 78.16,
    },
    participants: [
      {
        user_id: "mock-user-123",
        email: "demo@chippr.app",
        name: "Alex Demo",
        photo_url: null,
        amount: 78.16,
        role: "payer",
        is_current_user: true,
      },
      {
        user_id: "friend-001",
        email: "sarah.johnson@email.com",
        name: "Sarah Johnson",
        photo_url: null,
        amount: 78.16,
        role: "debtor",
        is_current_user: false,
      },
    ],
  };
};

export const getMockTransactionSplits = (transactionId: string): TransactionSplitsResponse => {
  const transaction = mockTransactions.find(t => t.id === transactionId);
  
  return {
    transaction: {
      transaction_id: transactionId,
      transaction_amount: transaction?.amount || 100,
      transaction_currency: "USD",
      transaction_description: transaction?.description || "Transaction",
      merchant_name: transaction?.merchant_name || "Merchant",
      category: transaction?.category || "General",
      type: transaction?.type || "debit",
      posted_date: transaction?.posted_date || daysAgo(0),
      authorized_date: transaction?.authorized_date || daysAgo(1),
      payer_user_id: "mock-user-123",
      split_total: transaction?.split_total || 0,
    },
    participants: transaction?.has_split ? [
      {
        user_id: "mock-user-123",
        email: "demo@chippr.app",
        name: "Alex Demo",
        photo_url: null,
        amount: (transaction?.amount || 100) / 2,
        role: "payer",
        is_current_user: true,
      },
      {
        user_id: "friend-001",
        email: "sarah.johnson@email.com",
        name: "Sarah Johnson",
        photo_url: null,
        amount: (transaction?.amount || 100) / 2,
        role: "debtor",
        is_current_user: false,
      },
    ] : [],
    has_splits: transaction?.has_split || false,
  };
};

// ============================================
// MOCK USER ACCOUNTS
// ============================================
export const mockUserAccounts: UserAccountsResponse = {
  accounts: mockAccounts,
  balances: [
    {
      account_id: "account-001",
      account_name: "Checking Account",
      account_type: "checking",
      current_balance: 5234.67,
      available_balance: 5200.00,
      currency: "USD",
    },
    {
      account_id: "account-002",
      account_name: "Savings Account",
      account_type: "savings",
      current_balance: 12450.00,
      available_balance: 12450.00,
      currency: "USD",
    },
    {
      account_id: "account-003",
      account_name: "Credit Card",
      account_type: "credit",
      current_balance: -1842.32,
      available_balance: 8157.68,
      currency: "USD",
    },
  ],
  total_accounts: 3,
  ingestion_started: true,
};

// ============================================
// MOCK AI RESPONSES
// ============================================
export const mockAIResponses: { [key: string]: string } = {
  default: "Based on your recent spending, I can see you've been managing your finances well! Your top spending categories this month are Food & Drink and Shopping. Would you like me to provide more detailed insights or help you set up a budget?",
  spending: "Looking at your transactions, you've spent $1,515.50 this month. Your biggest expenses were Travel ($320) and Food & Drink ($368.62). Compared to last month, your Food & Drink spending increased by about 12%. Would you like some tips to reduce spending in any category?",
  budget: "I'd recommend setting up category budgets based on your spending patterns. For Food & Drink, a budget of $350/month would be reasonable. For Entertainment, $100/month seems appropriate. Would you like me to help you set up specific budget goals?",
  savings: "Great question about savings! Based on your income and spending patterns, you could potentially save an additional $200-300 per month by reducing dining out expenses and subscription services. Your current savings rate is healthy, but there's always room for improvement!",
  splits: "You currently have $158.25 net balance from splits with friends - meaning friends owe you more than you owe them. Sarah Johnson owes you $145.50, and Mike Chen owes you $55.00. Would you like me to help you send reminders?",
};

export const getMockAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('spend') || lowerMessage.includes('expense')) {
    return mockAIResponses.spending;
  }
  if (lowerMessage.includes('budget')) {
    return mockAIResponses.budget;
  }
  if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
    return mockAIResponses.savings;
  }
  if (lowerMessage.includes('split') || lowerMessage.includes('owe') || lowerMessage.includes('friend')) {
    return mockAIResponses.splits;
  }
  
  return mockAIResponses.default;
};

