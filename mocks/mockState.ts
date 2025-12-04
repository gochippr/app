/**
 * Mock State Manager
 * 
 * Manages mutable mock data state that can change during the session.
 * This allows simulating actions like linking new bank accounts.
 */

import { Account, UserBalance } from "@/services/accountService";
import { Transaction } from "@/services/transactionService";

// Bank templates for when users "link" new accounts
const BANK_TEMPLATES = [
  { name: "Chase", institution_id: "ins_chase", subtype: "checking" },
  { name: "Bank of America", institution_id: "ins_bofa", subtype: "checking" },
  { name: "Wells Fargo", institution_id: "ins_wells", subtype: "checking" },
  { name: "Citi", institution_id: "ins_citi", subtype: "checking" },
  { name: "Capital One", institution_id: "ins_capital_one", subtype: "savings" },
];

// Generate random balance between min and max
const randomBalance = (min: number, max: number) => 
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

// Generate a random 4-digit mask
const randomMask = () => 
  Math.floor(1000 + Math.random() * 9000).toString();

// State storage
let linkedAccounts: Account[] = [];
let accountBalances: Map<string, number> = new Map();
let additionalTransactions: Transaction[] = [];
let linkCount = 0;

/**
 * Initialize mock state with default accounts
 */
export function initializeMockState(defaultAccounts: Account[]) {
  if (linkedAccounts.length === 0) {
    linkedAccounts = [...defaultAccounts];
    // Set initial balances
    accountBalances.set("account-001", 5234.67);
    accountBalances.set("account-002", 12450.00);
    accountBalances.set("account-003", -1842.32);
  }
}

/**
 * Get all linked accounts
 */
export function getLinkedAccounts(): Account[] {
  return linkedAccounts;
}

/**
 * Get user balance summary
 */
export function getUserBalanceSummary(): UserBalance {
  let totalBalance = 0;
  accountBalances.forEach((balance) => {
    totalBalance += balance;
  });

  return {
    total_balance: Math.round(totalBalance * 100) / 100,
    friend_credit: 245.50,
    friend_debt: 87.25,
    real_credit_available: Math.round((totalBalance + 245.50) * 100) / 100,
  };
}

/**
 * Get balance for a specific account
 */
export function getAccountBalance(accountId: string): number {
  return accountBalances.get(accountId) ?? 0;
}

/**
 * Link a new bank account (simulates Plaid flow completion)
 */
export function linkNewAccount(bankName: string): Account {
  linkCount++;
  const template = BANK_TEMPLATES.find(b => b.name === bankName) || BANK_TEMPLATES[0];
  const accountId = `account-new-${linkCount}-${Date.now()}`;
  const balance = randomBalance(1000, 15000);
  
  const newAccount: Account = {
    id: accountId,
    user_id: "mock-user-123",
    name: `${bankName} ${template.subtype === "savings" ? "Savings" : "Checking"}`,
    type: "personal",
    description: `Newly linked ${bankName} account`,
    external_account_id: `plaid-${accountId}`,
    external_institution_id: template.institution_id,
    mask: randomMask(),
    official_name: `${bankName} ${template.subtype === "savings" ? "High-Yield Savings" : "Premier Checking"}`,
    subtype: template.subtype,
    verification_status: "verified",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  linkedAccounts.push(newAccount);
  accountBalances.set(accountId, balance);

  // Add some transactions for the new account
  addTransactionsForAccount(accountId, bankName);

  console.log(`[MockState] Linked new account: ${bankName} with balance $${balance.toFixed(2)}`);
  
  return newAccount;
}

/**
 * Add sample transactions for a newly linked account
 */
function addTransactionsForAccount(accountId: string, bankName: string) {
  const today = new Date();
  const daysAgo = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  const newTransactions: Transaction[] = [
    {
      id: `txn-new-${accountId}-1`,
      account_id: accountId,
      amount: randomBalance(50, 200),
      currency: "USD",
      type: "debit",
      merchant_name: "Trader Joe's",
      description: "Groceries",
      category: "Food & Drink",
      posted_date: daysAgo(1),
      pending: false,
      created_at: daysAgo(1),
    },
    {
      id: `txn-new-${accountId}-2`,
      account_id: accountId,
      amount: randomBalance(20, 80),
      currency: "USD",
      type: "debit",
      merchant_name: "Amazon",
      description: "Online purchase",
      category: "Shopping",
      posted_date: daysAgo(3),
      pending: false,
      created_at: daysAgo(3),
    },
    {
      id: `txn-new-${accountId}-3`,
      account_id: accountId,
      amount: randomBalance(10, 50),
      currency: "USD",
      type: "debit",
      merchant_name: "Uber Eats",
      description: "Food delivery",
      category: "Food & Drink",
      posted_date: daysAgo(5),
      pending: false,
      created_at: daysAgo(5),
    },
  ];

  additionalTransactions.push(...newTransactions);
}

/**
 * Get additional transactions from newly linked accounts
 */
export function getAdditionalTransactions(): Transaction[] {
  return additionalTransactions;
}

/**
 * Get all account balances for the accounts response
 */
export function getAllAccountBalances() {
  return linkedAccounts.map(account => ({
    account_id: account.id,
    account_name: account.name,
    account_type: account.subtype || "checking",
    current_balance: accountBalances.get(account.id) ?? 0,
    available_balance: accountBalances.get(account.id) ?? 0,
    currency: "USD",
  }));
}

/**
 * Reset mock state (useful for testing)
 */
export function resetMockState() {
  linkedAccounts = [];
  accountBalances.clear();
  additionalTransactions = [];
  linkCount = 0;
}

