import { BACKEND_URL } from "@/utils/constants";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatResponse {
  reply: string;
}

export async function sendChatMessage(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>,
  messages: ChatMessage[],
): Promise<ChatResponse> {
  const response = await fetchWithAuth(`${BACKEND_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    try {
      const data = await response.json();
      throw new Error(data?.detail || "Failed to get AI response");
    } catch (err) {
      if (err instanceof Error && err.message !== "Failed to get AI response") {
        throw err;
      }
      const fallback = await response.text();
      throw new Error(fallback || "Failed to get AI response");
    }
  }

  return response.json();
}
