import { BACKEND_URL } from "@/utils/constants";

export interface FriendUser {
  id: string;
  email: string;
  name?: string | null;
  photo_url?: string | null;
}

export interface FriendRelationship {
  friend: FriendUser;
  status: "pending" | "accepted" | "blocked";
  initiator_user_id: string;
  created_at: string;
  updated_at: string;
  is_incoming_request: boolean;
  is_outgoing_request: boolean;
}

export interface FriendListResponse {
  friends: FriendRelationship[];
}

export interface FriendRequestListResponse {
  incoming: FriendRelationship[];
  outgoing: FriendRelationship[];
}

export async function getFriends(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<FriendRelationship[]> {
  const response = await fetchWithAuth(`${BACKEND_URL}/friends`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch friends");
  }

  const body: FriendListResponse = await response.json();
  return body.friends;
}

export async function getFriendRequests(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<FriendRequestListResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/friends/requests`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch friend requests");
  }

  return response.json();
}

export async function sendFriendRequest(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>,
  email: string
): Promise<FriendRelationship> {
  const response = await fetchWithAuth(`${BACKEND_URL}/friends/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw await parseError(response, "Failed to send friend request");
  }

  return response.json();
}

export async function acceptFriendRequest(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>,
  friendUserId: string
): Promise<FriendRelationship> {
  const response = await fetchWithAuth(
    `${BACKEND_URL}/friends/requests/${friendUserId}/accept`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw await parseError(response, "Failed to accept friend request");
  }

  return response.json();
}

export async function denyFriendRequest(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>,
  friendUserId: string
): Promise<void> {
  const response = await fetchWithAuth(
    `${BACKEND_URL}/friends/requests/${friendUserId}/deny`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw await parseError(response, "Failed to deny friend request");
  }
}

async function parseError(response: Response, fallback: string): Promise<Error> {
  try {
    const data = await response.json();
    const detail = (data && (data.detail || data.message)) as string | undefined;
    return new Error(detail || fallback);
  } catch (_jsonError) {
    const message = await response.text();
    return new Error(message || fallback);
  }
}
