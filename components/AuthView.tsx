import { useAuth } from '@/context/auth';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleGoogleAuth = async () => {
    setIsLoading('google');
    try {
      await signIn();
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
      Alert.alert('Coming Soon', 'Apple Sign In will be available soon!');
    } catch (error) {
      console.error('Apple auth error:', error);
      Alert.alert('Error', 'Failed to sign in with Apple. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>B</Text>
              </View>
              <Text style={styles.appName}>BudgetBuddy</Text>
              <Text style={styles.tagline}>Your Gen Z finance companion</Text>
              <Text style={styles.subTagline}>Track, split, and save like a pro 💪</Text>
            </View>

            {/* Auth Card */}
            <View style={styles.authCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.welcomeTitle}>Welcome back!</Text>
                <Text style={styles.welcomeSubtitle}>Sign in to continue your money journey</Text>
              </View>

              {/* Google Sign In */}
              <TouchableOpacity 
                style={[styles.authButton, styles.googleButton]}
                onPress={handleGoogleAuth}
                disabled={isLoading !== null || authLoading}
                activeOpacity={0.8}
              >
                {(isLoading === 'google' || authLoading) ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator color="#203627" />
                    <Text style={styles.loadingText}>Signing in...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <View style={styles.googleIcon}>
                      <Ionicons name="logo-google" size={24} color="#DB4437" />
                    </View>
                    <View style={styles.buttonTextContainer}>
                      <Text style={styles.buttonText}>Continue with Google</Text>
                      <Text style={styles.buttonSubtext}>(Demo: Sarah&apos;s Account)</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              {/* Apple Sign In */}
              <TouchableOpacity 
                style={[styles.authButton, styles.appleButton]}
                onPress={handleAppleAuth}
                disabled={isLoading !== null || authLoading}
                activeOpacity={0.8}
              >
                {isLoading === 'apple' ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator color="#EFEFEF" />
                    <Text style={[styles.loadingText, styles.appleLoadingText]}>Signing in...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons name="logo-apple" size={24} color="#EFEFEF" />
                    <View style={styles.buttonTextContainer}>
                      <Text style={[styles.buttonText, styles.appleButtonText]}>Continue with Apple</Text>
                      <Text style={[styles.buttonSubtext, styles.appleButtonSubtext]}>(Demo: New User)</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>

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

            {/* Features Preview */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, styles.featureIcon1]}>
                  <Text style={styles.featureEmoji}>📊</Text>
                </View>
                <Text style={styles.featureText}>Smart Insights</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, styles.featureIcon2]}>
                  <Text style={styles.featureEmoji}>👥</Text>
                </View>
                <Text style={styles.featureText}>Split Bills</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, styles.featureIcon3]}>
                  <Text style={styles.featureEmoji}>🎯</Text>
                </View>
                <Text style={styles.featureText}>Reach Goals</Text>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
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
    paddingTop: 20,
  },
  logoCircle: {
    width: 96,
    height: 96,
    backgroundColor: '#E8FF40',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#203627',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#203627',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#203627',
    opacity: 0.8,
  },
  subTagline: {
    fontSize: 14,
    color: '#203627',
    opacity: 0.6,
    marginTop: 4,
  },
  authCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    marginHorizontal: 8,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#203627',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#203627',
    opacity: 0.7,
    textAlign: 'center',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#9DC4D5',
  },
  appleButton: {
    backgroundColor: '#203627',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 12,
  },
  buttonTextContainer: {
    alignItems: 'flex-start',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#203627',
  },
  buttonSubtext: {
    fontSize: 12,
    color: '#203627',
    opacity: 0.6,
    marginTop: 2,
  },
  appleButtonText: {
    color: '#EFEFEF',
  },
  appleButtonSubtext: {
    color: '#EFEFEF',
    opacity: 0.8,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#203627',
    marginLeft: 12,
  },
  appleLoadingText: {
    color: '#EFEFEF',
  },
  termsContainer: {
    marginTop: 24,
    paddingTop: 16,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#203627',
    opacity: 0.6,
    lineHeight: 18,
  },
  termsLink: {
    color: '#9DC4D5',
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 48,
    paddingHorizontal: 12,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon1: {
    backgroundColor: '#9DC4D5',
  },
  featureIcon2: {
    backgroundColor: '#E8FF40',
  },
  featureIcon3: {
    backgroundColor: '#203627',
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 12,
    color: '#203627',
    opacity: 0.8,
  },
});

export default AuthScreen;