import { tokenCache } from "@/utils/cache";
import { BACKEND_URL } from "@/utils/constants";
import {
  AuthError,
  AuthRequestConfig,
  DiscoveryDocument,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
// Remove the router import - we'll handle navigation differently
import * as WebBrowser from "expo-web-browser";
import * as jose from "jose";
import * as React from "react";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  provider?: string;
  exp?: number;
  cookieExpiration?: number;
};

const AuthContext = React.createContext({
  user: null as AuthUser | null,
  signIn: async () => {},
  signOut: async () => {},
  fetchWithAuth: (url: string, options: RequestInit) =>
    Promise.resolve(new Response()),
  isLoading: false,
  error: null as AuthError | null,
});

const config: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri(),
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${BACKEND_URL}/auth/authorize/google`,
  tokenEndpoint: `${BACKEND_URL}/auth/token`,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);
  const [request, response, promptAsync] = useAuthRequest(config, discovery);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<AuthError | null>(null);
  // Remove router from here - navigation will be handled by the root layout
  const isWeb = Platform.OS === "web";
  const refreshInProgressRef = React.useRef(false);

  React.useEffect(() => {
    handleResponse();
  }, [response]);

  // Check if user is authenticated
  React.useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      try {
        const storedRefreshToken = await tokenCache?.getToken("refreshToken");
        if (storedRefreshToken) {
          setRefreshToken(storedRefreshToken);
          await refreshTokens(storedRefreshToken);
        }
      } catch (error) {
        // Silent error handling
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, [isWeb]);

  const refreshTokens = React.useCallback(async (overrideToken?: string): Promise<string | null> => {
    if (refreshInProgressRef.current) {
      // If a refresh is already in progress, wait for it to complete
      return new Promise<string | null>((resolve) => {
        const interval = setInterval(() => {
          if (!refreshInProgressRef.current) {
            clearInterval(interval);
            resolve(accessToken);
          }
        }, 100);
      });
    }

    refreshInProgressRef.current = true;
    const currentRefreshToken = refreshToken || overrideToken;
    console.log("Refreshing tokens with refresh token");
    try {
      if (!currentRefreshToken) {
        console.log("No refresh token available, cannot refresh.");
        signOut();
        return null;
      }

      const refreshResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: "native",
          refreshToken: currentRefreshToken,
        }),
      });

      if (!refreshResponse.ok) {
        signOut();
        return null;
      }

      // Refresh the tokens in state and cache
      const tokens = await refreshResponse.json();
      const newAccessToken = tokens.accessToken;
      const newRefreshToken = tokens.refreshToken;

      if (newAccessToken) setAccessToken(newAccessToken);
      if (newRefreshToken) setRefreshToken(newRefreshToken);

      // Save both tokens to cache
      if (newAccessToken)
        await tokenCache?.saveToken("accessToken", newAccessToken);
      if (newRefreshToken)
        await tokenCache?.saveToken("refreshToken", newRefreshToken);

      // Update user data from the new access token
      if (newAccessToken) {
        const decoded = jose.decodeJwt(newAccessToken);
        setUser(decoded as AuthUser);
      }

      return newAccessToken; // Return the new access token
    } catch (error) {
      console.error("Error refreshing token:", error);
      signOut();
    } finally {
      refreshInProgressRef.current = false;
    }
    return null;
  }, [refreshToken]);

  const handleNativeTokens = async (tokens: {
    accessToken: string;
    refreshToken: string;
  }) => {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      tokens;

    // Store tokens in state
    if (newAccessToken) setAccessToken(newAccessToken);
    if (newRefreshToken) setRefreshToken(newRefreshToken);

    // Save tokens to secure storage for persistence
    if (newAccessToken)
      await tokenCache?.saveToken("accessToken", newAccessToken);
    if (newRefreshToken)
      await tokenCache?.saveToken("refreshToken", newRefreshToken);

    // Decode the JWT access token to get user information
    if (newAccessToken) {
      const decoded = jose.decodeJwt(newAccessToken);
      setUser(decoded as AuthUser);
    }
  };

  async function handleResponse() {
    // This function is called when Google redirects back to our app
    // The response contains the authorization code that we'll exchange for tokens
    // Note: Cross-Origin-Opener-Policy (COOP) warnings in the console are expected
    // and don't affect functionality - they're browser security warnings
    if (response?.type === "success") {
      try {
        setIsLoading(true);
        // Extract the authorization code from the response
        // This code is what we'll exchange for access and refresh tokens
        const { code } = response.params;

        // Create form data to send to our token endpoint
        // We include both the code and platform information
        // The platform info helps our server handle web vs native differently
        const formData = new FormData();
        formData.append("code", code);

        // Add platform information for the backend to handle appropriately
        if (isWeb) {
          formData.append("platform", "web");
        }

        // Get the code verifier from the request object
        // This is the same verifier that was used to generate the code challenge
        if (request?.codeVerifier) {
          formData.append("code_verifier", request.codeVerifier);
        }

        // Send the authorization code to our token endpoint
        // The server will exchange this code with Google for access and refresh tokens
        // For web: credentials are included to handle cookies
        // For native: we'll receive the tokens directly in the response
        const tokenResponse = await fetch(`${BACKEND_URL}/auth/token`, {
          method: "POST",
          body: formData,
          credentials: isWeb ? "include" : "same-origin", // Include cookies for web
        });

        if (isWeb) {
          // For web: The server sets the tokens in HTTP-only cookies
          // We just need to get the user data from the response
          const userData = await tokenResponse.json();

          if (userData.success) {
            // Fetch the session to get user data
            // This ensures we have the most up-to-date user information
            const sessionResponse = await fetch(`${BACKEND_URL}/auth/session`, {
              method: "GET",
              credentials: "include",
            });

            if (sessionResponse.ok) {
              const sessionData = await sessionResponse.json();
              setUser(sessionData as AuthUser);

              // Force a small delay to ensure state is updated before any API calls
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          }
        } else {
          // For native: The server returns both tokens in the response
          // We need to store these tokens securely and decode the user data
          const tokens = await tokenResponse.json();
          await handleNativeTokens(tokens);
        }
      } catch (e) {
        // Silent error
      } finally {
        setIsLoading(false);
      }
    } else if (response?.type === "cancel") {
      alert("Sign in cancelled");
    } else if (response?.type === "error") {
      setError(response?.error as AuthError);
    }
  }

  const fetchWithAuth = async (url: string, options: RequestInit) => {
    // For native: Use token in Authorization header
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await fetch(url, {
      ...options,
      headers: headers,
      credentials: "include",
    });

    // If the response indicates an authentication error, try to refresh the token
    if (response.status === 401) {
      // Try to refresh the token and get the new token directly
      const newAccessToken = await refreshTokens();

      if (user) {
        // Retry the original request with the new token
        const retryHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return await fetch(url, {
          ...options,
          headers: retryHeaders,
          credentials: "include",
        });
      }
    }

    return response;
  };

  const signIn = async () => {
    try {
      if (!request) {
        return;
      }

      await promptAsync();
    } catch (e) {
      console.log(e);
    }
  };

  const signOut = async () => {
    // For native: Clear both tokens from cache
    await tokenCache?.deleteToken("accessToken");
    await tokenCache?.deleteToken("refreshToken");

    // Clear state
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
