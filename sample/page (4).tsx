"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Coffee, Gamepad2, Car, ShoppingBag, Users } from "lucide-react"

const transactions = [
  {
    id: 1,
    merchant: "Starbucks",
    amount: -5.47,
    category: "Dining",
    date: "2024-01-15",
    icon: Coffee,
    split: false,
    aiCategorized: true,
  },
  {
    id: 2,
    merchant: "Netflix",
    amount: -15.99,
    category: "Entertainment",
    date: "2024-01-14",
    icon: Gamepad2,
    split: true,
    aiCategorized: true,
  },
  {
    id: 3,
    merchant: "Uber",
    amount: -12.5,
    category: "Transport",
    date: "2024-01-14",
    icon: Car,
    split: false,
    aiCategorized: true,
  },
  {
    id: 4,
    merchant: "Target",
    amount: -67.89,
    category: "Shopping",
    date: "2024-01-13",
    icon: ShoppingBag,
    split: false,
    aiCategorized: true,
  },
  {
    id: 5,
    merchant: "Salary Deposit",
    amount: 2500.0,
    category: "Income",
    date: "2024-01-12",
    icon: Plus,
    split: false,
    aiCategorized: true,
  },
]

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Dining", "Entertainment", "Transport", "Shopping", "Income"]

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || transaction.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Transactions
        </h1>
        <p className="text-gray-600 mt-1">Track your spending habits</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Add Transaction Button */}
      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
        <Plus className="mr-2" size={20} />
        Add Manual Transaction
      </Button>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => {
          const IconComponent = transaction.icon
          return (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${transaction.amount > 0 ? "bg-green-100" : "bg-gray-100"}`}>
                      <IconComponent
                        size={20}
                        className={transaction.amount > 0 ? "text-green-600" : "text-gray-600"}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.merchant}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                        {transaction.split && (
                          <Badge variant="outline" className="text-xs">
                            <Users size={10} className="mr-1" />
                            Split
                          </Badge>
                        )}
                        {transaction.aiCategorized && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600">
                            AI
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium text-blue-800">AI Insight</p>
          </div>
          <p className="text-sm text-blue-700">
            You've spent 23% more on coffee this week compared to last week. Consider brewing at home to save $15/week!
            ☕
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
