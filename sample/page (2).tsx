"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import {
  Trophy,
  Flame,
  Target,
  Coffee,
  Share2,
  Settings,
  HelpCircle,
  Shield,
  Bell,
  CreditCard,
  LogOut,
} from "lucide-react"

const achievements = [
  {
    id: 1,
    title: "Coffee Conqueror",
    description: "Spent less than $50 on coffee this month",
    icon: Coffee,
    earned: true,
    date: "Jan 2024",
    memeStyle: "☕ Coffee Boss",
  },
  {
    id: 2,
    title: "Savings Streak",
    description: "7 days of staying under budget",
    icon: Flame,
    earned: true,
    date: "Jan 2024",
    memeStyle: "🔥 Budget Beast",
  },
  {
    id: 3,
    title: "Goal Getter",
    description: "Reached your first savings goal",
    icon: Target,
    earned: false,
    date: null,
    memeStyle: "🎯 Money Master",
  },
]

export default function ProfilePage() {
  const router = useRouter()

  const handleSignOut = () => {
    // Clear any stored user data/tokens here
    // For now, we'll just redirect to auth page
    router.push("/auth")
  }

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center py-4">
        <Avatar className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500">
          <AvatarFallback className="text-white text-xl font-bold">S</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">Sarah Johnson</h1>
        <p className="text-gray-600">Budget Ninja 🥷</p>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Trophy className="mr-2 text-yellow-500" size={20} />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned
                    ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${achievement.earned ? "bg-yellow-100" : "bg-gray-100"}`}>
                    <IconComponent size={20} className={achievement.earned ? "text-yellow-600" : "text-gray-400"} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      {achievement.earned && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">{achievement.memeStyle}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                    {achievement.earned && (
                      <div className="flex items-center space-x-2 mt-2">
                        <p className="text-xs text-gray-500">Earned {achievement.date}</p>
                        <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                          <Share2 size={12} className="mr-1" />
                          Share
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Current Challenge */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Target className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="font-medium text-purple-800">January Challenge</p>
              <p className="text-sm text-purple-600">Spend less than $100 on Starbucks</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span className="font-medium">$67 / $100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: "67%" }}></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">$33 left - You're doing great! ☕</p>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Settings className="mr-2 text-gray-600" size={20} />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell size={20} className="text-gray-600" />
              <div>
                <p className="font-medium text-sm">Push Notifications</p>
                <p className="text-xs text-gray-600">Budget alerts and reminders</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard size={20} className="text-gray-600" />
              <div>
                <p className="font-medium text-sm">Bank Connections</p>
                <p className="text-xs text-gray-600">Manage linked accounts</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target size={20} className="text-gray-600" />
              <div>
                <p className="font-medium text-sm">Budget Settings</p>
                <p className="text-xs text-gray-600">Fixed/flexible budget options</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield size={20} className="text-gray-600" />
              <div>
                <p className="font-medium text-sm">Privacy & Security</p>
                <p className="text-xs text-gray-600">Account security settings</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              View
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LogOut size={20} className="text-red-600" />
              <div>
                <p className="font-medium text-sm text-red-600">Sign Out</p>
                <p className="text-xs text-gray-600">Log out of your account</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <HelpCircle className="mr-2 text-gray-600" size={20} />
            Support & Help
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <HelpCircle size={16} className="mr-2" />
            FAQ & Help Center
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Contact Support
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Send Feedback
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="text-center text-xs text-gray-500 pb-4">
        <p>BudgetBuddy v2.1.0</p>
        <p>Made with 💜 for Gen Z</p>
      </div>
    </div>
  )
}
