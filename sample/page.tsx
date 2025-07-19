"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleGoogleAuth = async () => {
    setIsLoading("google")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    window.location.href = "/"
  }

  const handleAppleAuth = async () => {
    setIsLoading("apple")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    window.location.href = "/onboarding"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
      {/* Status Bar Safe Area */}
      <div className="fixed top-0 left-0 right-0 h-safe-top bg-gradient-to-r from-purple-500 to-pink-500 z-50"></div>

      <div className="w-full px-6 pt-safe-top">
        <div className="space-y-8 max-w-sm mx-auto">
          {/* Logo and Welcome */}
          <div className="text-center pt-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">B</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              BudgetBuddy
            </h1>
            <p className="text-gray-600 text-lg">Your Gen Z finance companion</p>
            <p className="text-sm text-gray-500 mt-2">Track, split, and save like a pro 💪</p>
          </div>

          {/* Auth Card */}
          <Card className="border-0 shadow-xl mx-2">
            <CardContent className="p-6 space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome back!</h2>
                <p className="text-gray-600 text-sm">Sign in to continue your money journey</p>
              </div>

              {/* Google Sign In */}
              <Button
                onClick={handleGoogleAuth}
                disabled={isLoading !== null}
                className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm relative text-base"
              >
                {isLoading === "google" ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm">
                      Continue with Google
                      <br />
                      <span className="text-xs text-gray-500">(Demo: Sarah's Account)</span>
                    </span>
                  </div>
                )}
              </Button>

              {/* Apple Sign In */}
              <Button
                onClick={handleAppleAuth}
                disabled={isLoading !== null}
                className="w-full h-14 bg-black hover:bg-gray-800 text-white relative text-base"
              >
                {isLoading === "apple" ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span className="text-sm">
                      Continue with Apple
                      <br />
                      <span className="text-xs text-gray-300">(Demo: New User)</span>
                    </span>
                  </div>
                )}
              </Button>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-purple-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="grid grid-cols-3 gap-4 text-center px-4 pb-8">
            <div className="space-y-2">
              <div className="w-14 h-14 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
                <span className="text-purple-600 text-2xl">📊</span>
              </div>
              <p className="text-xs text-gray-600">Smart Insights</p>
            </div>
            <div className="space-y-2">
              <div className="w-14 h-14 bg-pink-100 rounded-full mx-auto flex items-center justify-center">
                <span className="text-pink-600 text-2xl">👥</span>
              </div>
              <p className="text-xs text-gray-600">Split Bills</p>
            </div>
            <div className="space-y-2">
              <div className="w-14 h-14 bg-orange-100 rounded-full mx-auto flex items-center justify-center">
                <span className="text-orange-600 text-2xl">🎯</span>
              </div>
              <p className="text-xs text-gray-600">Reach Goals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
