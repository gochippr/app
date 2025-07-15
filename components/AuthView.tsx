import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const AuthScreen: React.FC = () => {
  const { signIn, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const handleGoogleAuth = async () => {
    setIsLoading('google');
    try {
      signIn();
      // Navigation will be handled by the auth context/state changes
    } catch (error) {
      console.error('Google auth error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading('apple');
    try {
      // TODO: Implement Apple Sign In
      Alert.alert('Coming Soon', 'Apple Sign In will be available soon!');
    } catch (error) {
      console.error('Apple auth error:', error);
      Alert.alert('Error', 'Failed to sign in with Apple. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <LinearGradient colors={['#1E1B4B', '#312E81', '#1E1B4B']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            {/* Logo Section */}
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6', '#EC4899']}
                style={styles.logoGradient}
              >
                <Ionicons name="wallet" size={40} color="white" />
              </LinearGradient>
              <Text style={styles.logoText}>GoChippr</Text>
              <Text style={styles.tagline}>Split expenses effortlessly</Text>
            </Animated.View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Welcome to GoChippr</Text>
              <Text style={styles.subtitle}>
                Sign in to start splitting expenses with friends
              </Text>

              {/* Social Login */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>continue with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity 
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={handleGoogleAuth}
                  disabled={isLoading !== null || authLoading}
                >
                  {(isLoading === 'google' || authLoading) ? (
                    <ActivityIndicator color="#DB4437" />
                  ) : (
                    <>
                      <Ionicons name="logo-google" size={24} color="#DB4437" />
                      <Text style={styles.socialButtonText}>Continue with Google</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.socialButton, styles.appleButton]}
                  onPress={handleAppleAuth}
                  disabled={isLoading !== null || authLoading}
                >
                  {isLoading === 'apple' ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Ionicons name="logo-apple" size={24} color="white" />
                      <Text style={[styles.socialButtonText, styles.appleButtonText]}>Continue with Apple</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Terms */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' and '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Ionicons name="people" size={20} color="#8B5CF6" />
                <Text style={styles.featureText}>Split expenses</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="calculator" size={20} color="#8B5CF6" />
                <Text style={styles.featureText}>Track debts</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark" size={20} color="#8B5CF6" />
                <Text style={styles.featureText}>Bank-level security</Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#94A3B8',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 32,
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#64748B',
    fontSize: 12,
    marginHorizontal: 16,
  },
  socialContainer: {
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  googleButton: {
    backgroundColor: 'white',
  },
  appleButton: {
    backgroundColor: 'black',
  },
  socialButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#3C4043',
  },
  appleButtonText: {
    color: 'white',
  },
  termsContainer: {
    paddingTop: 8,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  termsLink: {
    color: '#8B5CF6',
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    color: '#94A3B8',
    fontSize: 13,
  },
});

export default AuthScreen;