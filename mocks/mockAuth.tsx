/**
 * Mock Auth Provider
 * 
 * Provides a mock authentication context for development without a backend.
 * Mimics the real auth provider's interface but uses mock data.
 */

import * as React from "react";
import { mockUser, mockAccounts, mockTransactions, mockTransactionSummary } from "./data";
import { simulateDelay } from "./config";
import { 
  initializeMockState, 
  getLinkedAccounts, 
  getUserBalanceSummary,
  getAdditionalTransactions,
  getAllAccountBalances
} from "./mockState";
import type { AuthUser } from "@/context/auth";
import { AuthError } from "expo-auth-session";

const MockAuthContext = React.createContext({
  user: null as AuthUser | null,
  signIn: async () => {},
  signOut: async () => {},
  fetchWithAuth: (url: string, options: RequestInit) =>
    Promise.resolve(new Response()),
  isLoading: false,
  error: null as AuthError | null,
});

export const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthUser | null>(mockUser);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error] = React.useState<AuthError | null>(null);

  // Initialize mock state with default accounts
  React.useEffect(() => {
    initializeMockState(mockAccounts);
  }, []);

  // Mock fetchWithAuth that intercepts API calls and returns mock data
  const fetchWithAuth = React.useCallback(async (url: string, options: RequestInit): Promise<Response> => {
    await simulateDelay();
    
    // Import mock data dynamically to avoid circular dependencies
    const mockData = await import("./data");
    
    // Parse the URL to determine which endpoint is being called
    const urlPath = url.replace(/^https?:\/\/[^/]+/, "");
    
    // Handle different API endpoints
    if (urlPath.includes("/transactions/summary")) {
      // Calculate updated summary based on all transactions including new ones
      const additionalTxns = getAdditionalTransactions();
      const additionalSpent = additionalTxns.reduce((sum, t) => sum + t.amount, 0);
      const updatedSummary = {
        ...mockTransactionSummary,
        total_spent: mockTransactionSummary.total_spent + additionalSpent,
      };
      return createMockResponse(updatedSummary);
    }
    
    if (urlPath.includes("/transactions")) {
      // Combine original transactions with new ones from linked accounts
      const additionalTxns = getAdditionalTransactions();
      const allTransactions = [...additionalTxns, ...mockTransactions];
      return createMockResponse({ transactions: allTransactions });
    }
    
    if (urlPath.includes("/accounts/balance")) {
      // Get dynamic balance from mock state
      return createMockResponse(getUserBalanceSummary());
    }
    
    if (urlPath.includes("/accounts")) {
      // Get dynamic accounts from mock state (includes newly linked accounts)
      return createMockResponse({ accounts: getLinkedAccounts() });
    }
    
    if (urlPath.includes("/friends/requests")) {
      if (options.method === "POST") {
        // Mock sending a friend request
        return createMockResponse({
          friend: {
            id: "new-friend-" + Date.now(),
            email: JSON.parse(options.body as string)?.email || "new@friend.com",
            name: null,
            photo_url: null,
          },
          status: "pending",
          initiator_user_id: "mock-user-123",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_incoming_request: false,
          is_outgoing_request: true,
        });
      }
      return createMockResponse(mockData.mockFriendRequests);
    }
    
    if (urlPath.match(/\/friends\/requests\/[^/]+\/accept/)) {
      return createMockResponse({
        friend: mockData.mockFriends[0].friend,
        status: "accepted",
        initiator_user_id: "mock-user-123",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_incoming_request: false,
        is_outgoing_request: false,
      });
    }
    
    if (urlPath.match(/\/friends\/requests\/[^/]+\/deny/)) {
      return createMockResponse({});
    }
    
    // NOTE: Order matters! More specific paths must come before less specific ones
    
    // Splits endpoints (must come before /friends check)
    if (urlPath.includes("/splits/summary")) {
      return createMockResponse(mockData.mockFriendsSplitSummary.totals);
    }
    
    if (urlPath.includes("/splits/friends/")) {
      const friendId = urlPath.split("/splits/friends/")[1]?.split("/")[0];
      return createMockResponse(mockData.getMockFriendSplits(friendId || "friend-001"));
    }
    
    if (urlPath.includes("/splits/friends")) {
      return createMockResponse(mockData.mockFriendsSplitSummary);
    }
    
    // Friends endpoints (after splits to avoid matching /splits/friends)
    if (urlPath.includes("/friends")) {
      return createMockResponse({ friends: mockData.mockFriends });
    }
    
    if (urlPath.match(/\/splits\/transactions\/[^/]+/)) {
      const transactionId = urlPath.split("/splits/transactions/")[1]?.split("/")[0];
      if (options.method === "POST") {
        // Mock upsert - just return the current state
        return createMockResponse(mockData.getMockTransactionSplits(transactionId || "txn-001"));
      }
      return createMockResponse(mockData.getMockTransactionSplits(transactionId || "txn-001"));
    }
    
    if (urlPath.match(/\/splits\/[^/]+$/)) {
      const splitId = urlPath.split("/splits/")[1];
      return createMockResponse(mockData.getMockSplitDetail(splitId || "split-001"));
    }
    
    if (urlPath.includes("/users/accounts")) {
      // Return dynamic accounts and balances
      const accounts = getLinkedAccounts();
      const balances = getAllAccountBalances();
      return createMockResponse({
        accounts,
        balances,
        total_accounts: accounts.length,
        ingestion_started: true,
      });
    }
    
    if (urlPath.includes("/users/me") && options.method === "DELETE") {
      return createMockResponse({});
    }
    
    if (urlPath.includes("/ai/chat")) {
      const body = JSON.parse(options.body as string);
      const lastMessage = body.messages?.[body.messages.length - 1]?.content || "";
      return createMockResponse({ reply: mockData.getMockAIResponse(lastMessage) });
    }
    
    if (urlPath.includes("/plaid/create_link_token")) {
      return createMockResponse({
        link_token: "mock-link-token-" + Date.now(),
        expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      });
    }
    
    if (urlPath.includes("/plaid/exchange_public_token")) {
      return createMockResponse({
        item_id: "mock-item-" + Date.now(),
        access_token: "mock-access-token",
        db_id: 1,
      });
    }
    
    if (urlPath.includes("/plaid/sync")) {
      return createMockResponse({});
    }
    
    if (urlPath.includes("/protected")) {
      return createMockResponse({ message: "Mock protected data", user: mockData.mockUser });
    }
    
    // Default response for unknown endpoints
    console.warn(`[MockAuth] Unhandled endpoint: ${urlPath}`);
    return createMockResponse({ message: "Mock response" });
  }, []);

  const signIn = React.useCallback(async () => {
    setIsLoading(true);
    await simulateDelay();
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  const signOut = React.useCallback(async () => {
    setIsLoading(true);
    await simulateDelay();
    setUser(null);
    setIsLoading(false);
  }, []);

  return (
    <MockAuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoading,
        error,
        fetchWithAuth,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = () => {
  const context = React.useContext(MockAuthContext);
  if (!context) {
    throw new Error("useMockAuth must be used within a MockAuthProvider");
  }
  return context;
};

// Helper function to create mock Response objects
function createMockResponse(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

