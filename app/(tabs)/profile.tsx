import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/context/auth";
import { syncAccounts } from "@/services/accountService";
import {
  FriendRelationship,
  acceptFriendRequest,
  denyFriendRequest,
  getFriendRequests,
  getFriends,
  sendFriendRequest,
} from "@/services/friendService";
import { deleteCurrentUser } from "@/services/userService";

export default function ProfilePage() {
  const { user, signOut, fetchWithAuth } = useAuth();
  const router = useRouter();

  const [friends, setFriends] = useState<FriendRelationship[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<
    FriendRelationship[]
  >([]);
  const [outgoingRequests, setOutgoingRequests] = useState<
    FriendRelationship[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null
  );
  const [requestEmail, setRequestEmail] = useState<string>("");
  const [lastError, setLastError] = useState<string | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);

  const friendCount = useMemo(() => friends.length, [friends.length]);

  const loadFriendData = useCallback(
    async (options?: { skipLoadingState?: boolean }) => {
      if (!fetchWithAuth) {
        return;
      }
      const skipLoading = options?.skipLoadingState ?? false;
      if (!skipLoading) {
        setIsLoading(true);
      }

      try {
        setLastError(null);
        const [friendsData, requestsData] = await Promise.all([
          getFriends(fetchWithAuth),
          getFriendRequests(fetchWithAuth),
        ]);
        setFriends(friendsData);
        setIncomingRequests(requestsData.incoming);
        setOutgoingRequests(requestsData.outgoing);
      } catch (error) {
        console.error("Friends load error:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load friends at this time.";
        setLastError(message);
      } finally {
        if (!skipLoading) {
          setIsLoading(false);
        }
        setIsRefreshing(false);
      }
    },
    [fetchWithAuth]
  );

  useEffect(() => {
    loadFriendData();
  }, [loadFriendData]);

  const handleRefresh = useCallback(() => {
    if (!fetchWithAuth) {
      return;
    }
    setIsRefreshing(true);
    loadFriendData({ skipLoadingState: true });
  }, [fetchWithAuth, loadFriendData]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Sign out error:", error);
      Alert.alert("Sign out failed", "Please try again.");
    }
  }, [router, signOut]);

  const handleSync = useCallback(async () => {
    if (!fetchWithAuth) {
      return;
    }
    try {
      await syncAccounts(fetchWithAuth);
      Alert.alert("Sync complete", "Accounts synced successfully!");
    } catch (error) {
      console.error("Sync error:", error);
      Alert.alert("Sync failed", "Unable to sync accounts. Please try again.");
    }
  }, [fetchWithAuth]);

  const handleSendRequest = useCallback(async () => {
    if (!fetchWithAuth) {
      return;
    }
    const trimmedEmail = requestEmail.trim();
    if (!trimmedEmail) {
      Alert.alert("Add Friend", "Please enter an email address.");
      return;
    }

    setIsSendingRequest(true);
    try {
      await sendFriendRequest(fetchWithAuth, trimmedEmail);
      setRequestEmail("");
      await loadFriendData({ skipLoadingState: true });
      Alert.alert("Friend Request", "Invitation sent!");
    } catch (error) {
      console.error("Send friend request error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send friend request.";
      Alert.alert("Friend Request", message);
    } finally {
      setIsSendingRequest(false);
    }
  }, [fetchWithAuth, loadFriendData, requestEmail]);

  const handleAcceptRequest = useCallback(
    async (friendUserId: string) => {
      if (!fetchWithAuth) {
        return;
      }
      setProcessingRequestId(friendUserId);
      try {
        await acceptFriendRequest(fetchWithAuth, friendUserId);
        await loadFriendData({ skipLoadingState: true });
      } catch (error) {
        console.error("Accept friend request error:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to accept friend request.";
        Alert.alert("Friend Request", message);
      } finally {
        setProcessingRequestId(null);
      }
    },
    [fetchWithAuth, loadFriendData]
  );

  const handleDenyRequest = useCallback(
    async (friendUserId: string) => {
      if (!fetchWithAuth) {
        return;
      }
      setProcessingRequestId(friendUserId);
      try {
        await denyFriendRequest(fetchWithAuth, friendUserId);
        await loadFriendData({ skipLoadingState: true });
      } catch (error) {
        console.error("Deny friend request error:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to deny friend request.";
        Alert.alert("Friend Request", message);
      } finally {
        setProcessingRequestId(null);
      }
    },
    [fetchWithAuth, loadFriendData]
  );

  const performDeleteAccount = useCallback(async () => {
    if (!fetchWithAuth) {
      return;
    }
    setIsDeletingAccount(true);
    try {
      await deleteCurrentUser(fetchWithAuth);
      await signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Delete account error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete account.";
      Alert.alert("Delete Account", message);
    } finally {
      setIsDeletingAccount(false);
    }
  }, [fetchWithAuth, router, signOut]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      "Delete Account",
      "This will permanently remove your data, including transactions, splits, and friendships. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            performDeleteAccount();
          },
        },
      ]
    );
  }, [performDeleteAccount]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View className="px-4 pt-4">
          <Text className="w-full text-3xl font-bold text-[#253628]">
            Profile
          </Text>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase() ||
                    "U"}
                </Text>
              </View>
              <Pressable style={styles.editAvatarButton}>
                <Ionicons name="camera-outline" size={20} color="#203627" />
              </Pressable>
            </View>

            <Text style={styles.userName}>{user?.name || "User"}</Text>
            <Text style={styles.userEmail}>
              {user?.email || "user@example.com"}
            </Text>
          </View>

          {lastError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{lastError}</Text>
            </View>
          ) : null}

          {/* Add Friend */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Add a friend</Text>
            <Text style={styles.sectionSubtitle}>Send an invite by email</Text>
            <View style={styles.addFriendRow}>
              <TextInput
                style={styles.addFriendInput}
                placeholder="friend@example.com"
                placeholderTextColor="#8B938E"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={requestEmail}
                onChangeText={setRequestEmail}
              />
              <Pressable
                onPress={handleSendRequest}
                disabled={isSendingRequest || !requestEmail.trim()}
                style={({ pressed }) => [
                  styles.addFriendButton,
                  (isSendingRequest || !requestEmail.trim()) &&
                    styles.addFriendButtonDisabled,
                  pressed &&
                    !(isSendingRequest || !requestEmail.trim()) &&
                    styles.pressed,
                ]}
              >
                {isSendingRequest ? (
                  <ActivityIndicator size="small" color="#203627" />
                ) : (
                  <Text style={styles.addFriendButtonText}>Send</Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* Friends List */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Friends</Text>
              {isLoading && !isRefreshing ? (
                <ActivityIndicator size="small" color="#203627" />
              ) : null}
            </View>
            {friends.length === 0 && !isLoading ? (
              <Text style={styles.emptyText}>
                No friends yet. Invite someone to get started.
              </Text>
            ) : (
              friends.map((friend) => (
                <View key={friend.friend.id} style={styles.friendRow}>
                  <View style={styles.friendAvatar}>
                    <Text style={styles.friendAvatarText}>
                      {friend.friend.name?.charAt(0).toUpperCase() ||
                        friend.friend.email.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>
                      {friend.friend.name || "Friend"}
                    </Text>
                    <Text style={styles.friendEmail}>
                      {friend.friend.email}
                    </Text>
                  </View>
                  <View style={styles.friendStatusPill}>
                    <Text style={styles.friendStatusText}>Accepted</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Incoming Friend Requests */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Friend requests</Text>
            {incomingRequests.length === 0 ? (
              <Text style={styles.emptyText}>No pending requests.</Text>
            ) : (
              incomingRequests.map((request) => {
                const isProcessing = processingRequestId === request.friend.id;
                return (
                  <View key={request.friend.id} style={styles.requestRow}>
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendName}>
                        {request.friend.name || "Friend"}
                      </Text>
                      <Text style={styles.friendEmail}>
                        {request.friend.email}
                      </Text>
                    </View>
                    <View style={styles.requestActions}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.primaryAction,
                          pressed && !isProcessing && styles.pressed,
                        ]}
                        disabled={isProcessing}
                        onPress={() => handleAcceptRequest(request.friend.id)}
                      >
                        {isProcessing ? (
                          <ActivityIndicator size="small" color="#EFEFEF" />
                        ) : (
                          <Text style={styles.primaryActionText}>Accept</Text>
                        )}
                      </Pressable>
                      <Pressable
                        style={({ pressed }) => [
                          styles.secondaryAction,
                          pressed && !isProcessing && styles.pressed,
                        ]}
                        disabled={isProcessing}
                        onPress={() => handleDenyRequest(request.friend.id)}
                      >
                        <Text style={styles.secondaryActionText}>Deny</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* Outgoing Requests */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sent requests</Text>
            {outgoingRequests.length === 0 ? (
              <Text style={styles.emptyText}>No pending invites.</Text>
            ) : (
              outgoingRequests.map((request) => (
                <View key={request.friend.id} style={styles.friendRow}>
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>
                      {request.friend.name || "Friend"}
                    </Text>
                    <Text style={styles.friendEmail}>
                      {request.friend.email}
                    </Text>
                  </View>
                  <View style={styles.friendStatusPillPending}>
                    <Text style={styles.friendStatusTextPending}>Pending</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Pressable 
              style={styles.menuItem}
              onPress={() => router.push("/(tabs)/plaid-link")}
            >
              <View style={[styles.menuIcon, { backgroundColor: "#9DC4D5" }]}>
                <Ionicons
                  name="wallet-outline"
                  size={20}
                  color="#203627"
                />
              </View>
              <Text style={styles.menuText}>Link Bank Account</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#203627"
                style={{ opacity: 0.3 }}
              />
            </Pressable>

            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: "#E8FF40" }]}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#203627"
                />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#203627"
                style={{ opacity: 0.3 }}
              />
            </Pressable>

            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: "#9DC4D5" }]}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#203627"
                />
              </View>
              <Text style={styles.menuText}>Privacy & Security</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#203627"
                style={{ opacity: 0.3 }}
              />
            </Pressable>

            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: "#FFB6C1" }]}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#203627"
                />
              </View>
              <Text style={styles.menuText}>Help & Support</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#203627"
                style={{ opacity: 0.3 }}
              />
            </Pressable>

            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: "#98FB98" }]}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#203627"
                />
              </View>
              <Text style={styles.menuText}>About</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#203627"
                style={{ opacity: 0.3 }}
              />
            </Pressable>
          </View>

          {/* Danger Zone */}
          <View style={styles.dangerSection}>
            <Pressable
              style={[
                styles.dangerItem,
                isDeletingAccount ? { opacity: 0.6 } : null,
              ]}
              disabled={isDeletingAccount}
              onPress={handleDeleteAccount}
            >
              {isDeletingAccount ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
              )}
              <Text style={styles.dangerText}>
                {isDeletingAccount ? "Deleting..." : "Delete Account"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.dangerSection}>
            <Pressable style={styles.dangerItem} onPress={handleSync}>
              <Ionicons name="sync" size={20} color="#DC2626" />
              <Text style={styles.dangerText}>Sync Account</Text>
            </Pressable>
          </View>

          {/* App Version */}
          <View style={styles.versionSection}>
            <Text style={styles.versionText}>Chippr v1.0.0</Text>
            <Text style={styles.versionSubtext}>Made with ❤️ for you</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
  safeArea: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EFEFEF",
  },
  signOutButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(157, 196, 213, 0.2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: "#E8FF40",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#203627",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#203627",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#203627",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#203627",
  },
  userEmail: {
    marginTop: 6,
    fontSize: 16,
    color: "#6C7280",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#203627",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#203627",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#6C7280",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(32, 54, 39, 0.12)",
  },
  errorContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(220, 38, 38, 0.08)",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 14,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#203627",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#203627",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6C7280",
    marginBottom: 12,
  },
  addFriendRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  addFriendInput: {
    flex: 1,
    backgroundColor: "#F4F5F4",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#203627",
  },
  addFriendButton: {
    backgroundColor: "#E8FF40",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  addFriendButtonDisabled: {
    backgroundColor: "#C8CFB0",
  },
  addFriendButtonText: {
    fontWeight: "600",
    color: "#203627",
  },
  pressed: {
    opacity: 0.85,
  },
  emptyText: {
    fontSize: 14,
    color: "#6C7280",
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8FF40",
    justifyContent: "center",
    alignItems: "center",
  },
  friendAvatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#203627",
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#203627",
  },
  friendEmail: {
    fontSize: 13,
    color: "#6C7280",
  },
  friendStatusPill: {
    backgroundColor: "rgba(32, 54, 39, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  friendStatusPillPending: {
    backgroundColor: "rgba(232, 255, 64, 0.25)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  friendStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#203627",
  },
  friendStatusTextPending: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7A8900",
  },
  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  primaryAction: {
    backgroundColor: "#203627",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryActionText: {
    color: "#EFEFEF",
    fontWeight: "600",
  },
  secondaryAction: {
    backgroundColor: "rgba(32, 54, 39, 0.08)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryActionText: {
    color: "#203627",
    fontWeight: "600",
  },
  menuSection: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 4,
    paddingVertical: 4,
    shadowColor: "#203627",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#203627",
  },
  dangerSection: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#203627",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
  versionSection: {
    alignItems: "center",
    marginVertical: 24,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6C7280",
  },
  versionSubtext: {
    fontSize: 12,
    color: "#9AA0A9",
    marginTop: 4,
  },
});
