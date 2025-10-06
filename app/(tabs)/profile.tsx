import { useAuth } from '@/context/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { syncAccounts } from '@/services/accountService';

export default function ProfilePage() {
  const { user, signOut, fetchWithAuth } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSync = async () => {
    if (!fetchWithAuth) return;
    try {
      await syncAccounts(fetchWithAuth);
      alert('Accounts synced successfully!');
    } catch (error) {
      console.error('Sync error:', error);
      alert('Failed to sync accounts. Please try again.');
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable onPress={handleSignOut} style={styles.signOutButton}>
            <Ionicons name="log-out-outline" size={24} color="#EFEFEF" />
          </Pressable>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <Pressable style={styles.editAvatarButton}>
                <Ionicons name="camera-outline" size={20} color="#203627" />
              </Pressable>
            </View>
            
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Splits</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>$234</Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Friends</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: '#E8FF40' }]}>
                <Ionicons name="notifications-outline" size={20} color="#203627" />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#203627" style={{ opacity: 0.3 }} />
            </Pressable>

            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: '#9DC4D5' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#203627" />
              </View>
              <Text style={styles.menuText}>Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={20} color="#203627" style={{ opacity: 0.3 }} />
            </Pressable>

            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFB6C1' }]}>
                <Ionicons name="help-circle-outline" size={20} color="#203627" />
              </View>
              <Text style={styles.menuText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#203627" style={{ opacity: 0.3 }} />
            </Pressable>

            <Pressable style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: '#98FB98' }]}>
                <Ionicons name="information-circle-outline" size={20} color="#203627" />
              </View>
              <Text style={styles.menuText}>About</Text>
              <Ionicons name="chevron-forward" size={20} color="#203627" style={{ opacity: 0.3 }} />
            </Pressable>
          </View>

          {/* Danger Zone */}
          <View style={styles.dangerSection}>
            <Pressable style={styles.dangerItem}>
              <Ionicons name="trash-outline" size={20} color="#DC2626" />
              <Text style={styles.dangerText}>Delete Account</Text>
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
    backgroundColor: '#EFEFEF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: '#203627',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EFEFEF',
  },
  signOutButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(157, 196, 213, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: '#E8FF40',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#203627',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#203627',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#203627',
    opacity: 0.6,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#203627',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#203627',
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#203627',
    opacity: 0.1,
    marginHorizontal: 16,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#203627',
  },
  dangerSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DC2626',
    gap: 8,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#DC2626',
  },
  versionSection: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#203627',
    opacity: 0.5,
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#203627',
    opacity: 0.4,
  },
});