"use client"

import { useState } from "react"
import { View, Text, ScrollView } from "react-native"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth"
import { useRouter } from "expo-router"

export default function AuthView() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { signIn, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const handleGoogleAuth = async () => {
    setIsLoading("google")
    try {
      signIn()
      // Navigation will be handled by the auth context/state changes
    } catch (error) {
      console.error("Google auth error:", error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleAppleAuth = async () => {
    setIsLoading("apple")
    // Simulate Apple auth flow - replace with actual implementation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/main")
    setIsLoading(null)
  }

  return (
    <View className="flex-1 bg-indigo-600">
      {/* Clean gradient background */}
      <View className="absolute inset-0 bg-indigo-600"></View>
      <View className="absolute inset-0 bg-purple-600 opacity-20"></View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-8">
          <View className="w-full max-w-md mx-auto space-y-12">
            {/* Clean Logo and Branding */}
            <View className="items-center space-y-8">
              {/* Modern logo design */}
              <View className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <Text className="text-4xl">💰</Text>
              </View>
              
              {/* Clean typography hierarchy */}
              <View className="space-y-4 text-center">
                <Text className="text-4xl font-bold text-white text-center">
                  BudgetBuddy
                </Text>
                <Text className="text-lg text-indigo-100 text-center font-medium">
                  Your smart money companion
                </Text>
                <Text className="text-base text-indigo-200 text-center px-4 leading-relaxed">
                  Track expenses, split bills, and reach your financial goals with ease
                </Text>
              </View>
            </View>

            {/* Clean Auth Card */}
            <Card className="bg-white rounded-2xl shadow-xl">
              <CardContent className="p-8 space-y-8">
                {/* Welcome Header */}
                <View className="text-center space-y-2">
                  <Text className="text-2xl font-bold text-gray-900">Get Started</Text>
                  <Text className="text-gray-600 text-base">
                    Choose your preferred way to sign in
                  </Text>
                </View>

                {/* Auth Buttons */}
                <View className="space-y-4">
                  {/* Google Button */}
                  <Button
                    onPress={handleGoogleAuth}
                    disabled={isLoading !== null || authLoading}
                    variant="outline"
                    className="w-full h-14 bg-white border-2 border-gray-200 rounded-xl shadow-sm"
                  >
                    {isLoading === "google" || authLoading ? (
                      <View className="flex flex-row items-center space-x-3">
                        <View className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></View>
                        <Text className="text-gray-700 font-semibold">Signing in...</Text>
                      </View>
                    ) : (
                      <View className="flex flex-row items-center space-x-4">
                        <View className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                          <Text className="text-white font-bold text-lg">G</Text>
                        </View>
                        <Text className="text-gray-900 font-semibold text-lg flex-1 text-left">
                          Continue with Google
                        </Text>
                      </View>
                    )}
                  </Button>

                  {/* Apple Button */}
                  <Button
                    onPress={handleAppleAuth}
                    disabled={isLoading !== null}
                    className="w-full h-14 bg-black rounded-xl shadow-sm"
                  >
                    {isLoading === "apple" ? (
                      <View className="flex flex-row items-center space-x-3">
                        <View className="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin"></View>
                        <Text className="text-white font-semibold">Signing in...</Text>
                      </View>
                    ) : (
                      <View className="flex flex-row items-center space-x-4">
                        <View className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Text className="text-black text-lg">🍎</Text>
                        </View>
                        <Text className="text-white font-semibold text-lg flex-1 text-left">
                          Continue with Apple
                        </Text>
                      </View>
                    )}
                  </Button>
                </View>

                {/* Terms */}
                <View className="pt-4 border-t border-gray-100">
                  <Text className="text-center text-xs text-gray-500 leading-relaxed">
                    By continuing, you agree to our{" "}
                    <Text className="text-indigo-600 font-medium">Terms of Service</Text>
                    {" "}and{" "}
                    <Text className="text-indigo-600 font-medium">Privacy Policy</Text>
                  </Text>
                </View>
              </CardContent>
            </Card>

            {/* Clean Features Section */}
            <View className="space-y-6">
              <Text className="text-center text-xl font-bold text-white">
                Why choose BudgetBuddy?
              </Text>
              
              <View className="flex flex-row justify-between space-x-4">
                <View className="items-center space-y-3 flex-1">
                  <View className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Text className="text-2xl">📊</Text>
                  </View>
                  <View className="space-y-1">
                    <Text className="text-sm font-semibold text-white text-center">Smart Tracking</Text>
                    <Text className="text-xs text-indigo-200 text-center">Easy expense monitoring</Text>
                  </View>
                </View>
                
                <View className="items-center space-y-3 flex-1">
                  <View className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Text className="text-2xl">👥</Text>
                  </View>
                  <View className="space-y-1">
                    <Text className="text-sm font-semibold text-white text-center">Split Bills</Text>
                    <Text className="text-xs text-indigo-200 text-center">Group expense sharing</Text>
                  </View>
                </View>
                
                <View className="items-center space-y-3 flex-1">
                  <View className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Text className="text-2xl">🎯</Text>
                  </View>
                  <View className="space-y-1">
                    <Text className="text-sm font-semibold text-white text-center">Reach Goals</Text>
                    <Text className="text-xs text-indigo-200 text-center">Automated savings</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}