import { useAuth } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import logo from "../assets/images/logo.png";

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
    setIsLoading("google");
    try {
      await signIn();
    } catch (error) {
      console.error("Google auth error:", error);
      Alert.alert("Error", "Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading("apple");
    try {
      Alert.alert("Coming Soon", "Apple Sign In will be available soon!");
    } catch (error) {
      console.error("Apple auth error:", error);
      Alert.alert("Error", "Failed to sign in with Apple. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <View>
      <SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View
            className="h-full w-full flex flex-col items-center justify-between p-4"
            style={[
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View className="w-full  flex flex-col items-center justify-center gap-8">
              <View className="flex flex-col items-center justify-center gap-3">
                <Image source={logo} className="size-[200px] mb-[-90px]" />
                <Text className="text-5xl font-bold text-[#253628]">
                  Chippr
                </Text>
                <Text className="text-xl font-semibold text-[#4D5562]">
                  Finance made social
                </Text>
              </View>
              {/* Google Sign In */}
              <View className="w-[95%] flex flex-col items-center justify-center gap-4 p-8 bg-white rounded-xl">
                <View className="flex flex-col items-center justify-center gap-2">
                  <Text className="text-3xl font-bold text-[#253628]">
                    Welcome back!
                  </Text>
                  <Text className="text-lg font-medium text-[#4D5562]">
                    Sign in to continue
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-[90%] flex-row items-center justify-center gap-4 p-4 border-[1.25px] border-gray-300 rounded-xl"
                  onPress={handleGoogleAuth}
                  disabled={isLoading !== null || authLoading}
                >
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                  <Text className="text-xl font-semibold text-[#253628]">
                    Continue with Google
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-[95%] flex flex-row items-start justify-center gap-4 px-10 py-6  bg-white rounded-xl">
                <View className="size-8 flex items-center justify-center rounded-full bg-[#9DC4D5]">
                  <Text className="text-sm">🔒</Text>
                </View>
                <View className="flex flex-col">
                  <Text className="text-lg leading-1 text-[#4D5562]">
                    <Text className="font-medium text-[#253628]">
                      Secure & Private:{" "}
                    </Text>
                    We never store your Google credentials. Your financial data
                    is encrypted and protected.
                  </Text>
                </View>
              </View>
            </View>
            <Text className="text-sm font-semibold text-[#4D5562] mt-auto">
              By continuing, you agree to our Terms and Privacy Policy.
            </Text>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;
