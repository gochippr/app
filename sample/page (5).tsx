import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Target } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Status Bar Safe Area */}
      <div className="h-safe-top bg-gradient-to-r from-purple-500 to-pink-500"></div>

      <div className="px-4 space-y-4">
        {/* Header */}
        <div className="text-center py-6 pt-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Hey Sarah! 👋
          </h1>
          <p className="text-gray-600 mt-1">Let's check your money vibes</p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 mx-2">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-purple-100 text-sm">Current Balance</p>
              <h2 className="text-3xl font-bold mt-1">$2,847.50</h2>
              <div className="flex items-center justify-center mt-2 text-green-200">
                <TrendingUp size={16} className="mr-1" />
                <span className="text-sm">+$127 this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Snapshot */}
        <Card className="mx-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Target className="mr-2 text-purple-600" size={20} />
              Budget Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly Budget</span>
                <span className="font-medium">$1,847 / $2,000</span>
              </div>
              <Progress value={92} className="h-3" />
              <p className="text-xs text-gray-600 mt-1">$153 left for this month</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center text-orange-700">
                <AlertTriangle size={16} className="mr-2" />
                <span className="text-sm font-medium">Overspending Alert!</span>
              </div>
              <p className="text-xs text-orange-600 mt-1">You're $47 over budget on dining this week</p>
            </div>
          </CardContent>
        </Card>

        {/* Spending Insights */}
        <Card className="mx-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-pink-500 rounded-full mr-3"></div>
                <span className="text-sm">Dining & Food</span>
              </div>
              <span className="text-sm font-medium">$347 (35%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm">Entertainment</span>
              </div>
              <span className="text-sm font-medium">$198 (20%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm">Shopping</span>
              </div>
              <span className="text-sm font-medium">$156 (16%)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm">Transport</span>
              </div>
              <span className="text-sm font-medium">$89 (9%)</span>
            </div>
          </CardContent>
        </Card>

        {/* Debt & Shared Expenses */}
        <Card className="mx-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Split & Settle Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800">You're owed</p>
                <p className="text-xl font-bold text-green-600">$67.50</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                3 pending
              </Badge>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-800">You owe</p>
                <p className="text-xl font-bold text-red-600">$23.75</p>
              </div>
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                1 pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="mx-2 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Goals 🎯</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Emergency Fund</span>
                <span className="font-medium">$1,200 / $2,000</span>
              </div>
              <Progress value={60} className="h-3" />
              <p className="text-xs text-gray-600 mt-1">60% complete - You're crushing it! 💪</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Vacation Fund</span>
                <span className="font-medium">$340 / $1,500</span>
              </div>
              <Progress value={23} className="h-3" />
              <p className="text-xs text-gray-600 mt-1">23% complete - Keep going! ✈️</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
