import { BACKEND_URL } from "@/utils/constants";

export default class MockProtectedApi {
  static async getProtectedData(fetchWithAuth: (url: string, options: RequestInit) =>
    Promise<Response>): Promise<Object> {

    try {
        const response = await fetchWithAuth(`${BACKEND_URL}/protected`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch protected data");
        }

        return response.json();
    } catch (error) {
        return { error: error instanceof Error ? error.message : "Unknown error"}
    }
  }
}