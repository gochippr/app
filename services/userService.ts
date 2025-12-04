import { BACKEND_URL } from "@/utils/constants";

const DEFAULT_ERROR = "Failed to delete account";

async function parseError(response: Response, fallback: string): Promise<never> {
  try {
    const data = await response.json();
    const detail = (data && (data.detail || data.message)) as string | undefined;
    throw new Error(detail || fallback);
  } catch {
    const text = await response.text();
    throw new Error(text || fallback);
  }
}

export async function deleteCurrentUser(
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>
): Promise<void> {
  const response = await fetchWithAuth(`${BACKEND_URL}/users/me`, {
    method: "DELETE",
  });

  if (!response.ok) {
    await parseError(response, DEFAULT_ERROR);
  }
}
