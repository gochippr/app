"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, MessageCircle, CheckCircle, Clock, Plus, Zap } from "lucide-react"

const activeSplits = [
  {
    id: 1,
    title: "Netflix Subscription",
    amount: 15.99,
    participants: ["You", "Alex", "Sam", "Jordan"],
    yourShare: 4.0,
    status: "pending",
    dueDate: "2024-01-20",
  },
  {
    id: 2,
    title: "Dinner at Olive Garden",
    amount: 89.5,
    participants: ["You", "Emma", "Mike"],
    yourShare: 29.83,
    status: "settled",
    dueDate: "2024-01-15",
  },
  {
    id: 3,
    title: "Uber to Concert",
    amount: 25.0,
    participants: ["You", "Sarah"],
    yourShare: 12.5,
    status: "pending",
    dueDate: "2024-01-18",
  },
]

const suggestedSplits = [
  {
    id: 1,
    merchant: "Starbucks",
    amount: 18.47,
    date: "2024-01-15",
    confidence: 85,
    suggestedParticipants: ["Emma", "Alex"],
  },
  {
    id: 2,
    merchant: "Movie Tickets",
    amount: 32.0,
    date: "2024-01-14",
    confidence: 92,
    suggestedParticipants: ["Mike", "Jordan"],
  },
]

export default function SplitSettlePage() {
  const [showSuggestions, setShowSuggestions] = useState(true)

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Split & Settle
        </h1>
        <p className="text-gray-600 mt-1">Manage shared expenses</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">$67.50</p>
            <p className="text-sm text-green-700">You're owed</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">$23.75</p>
            <p className="text-sm text-red-700">You owe</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      {showSuggestions && suggestedSplits.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Zap className="mr-2 text-purple-600" size={20} />
              AI Split Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestedSplits.map((suggestion) => (
              <div key={suggestion.id} className="bg-white rounded-lg p-3 border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{suggestion.merchant}</p>
                    <p className="text-xs text-gray-600">{suggestion.date}</p>
                  </div>
                  <p className="font-bold text-purple-600">${suggestion.amount}</p>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {suggestion.confidence}% confident
                  </Badge>
                  <div className="flex -space-x-1">
                    {suggestion.suggestedParticipants.map((participant, index) => (
                      <Avatar key={index} className="w-6 h-6 border-2 border-white">
                        <AvatarFallback className="text-xs">{participant[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    Confirm Split
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Not a Split
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active Splits */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center">
              <Users className="mr-2 text-purple-600" size={20} />
              Active Splits
            </span>
            <Button size="sm" variant="outline">
              <Plus size={16} className="mr-1" />
              New Split
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeSplits.map((split) => (
            <div key={split.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-sm">{split.title}</p>
                  <p className="text-xs text-gray-600">Due: {split.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">${split.amount}</p>
                  <p className="text-xs text-gray-600">Your share: ${split.yourShare}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex -space-x-1">
                  {split.participants.map((participant, index) => (
                    <Avatar key={index} className="w-8 h-8 border-2 border-white">
                      <AvatarFallback className="text-xs">{participant[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Badge
                  variant={split.status === "settled" ? "default" : "secondary"}
                  className={split.status === "settled" ? "bg-green-100 text-green-700" : ""}
                >
                  {split.status === "settled" ? (
                    <>
                      <CheckCircle size={12} className="mr-1" />
                      Settled
                    </>
                  ) : (
                    <>
                      <Clock size={12} className="mr-1" />
                      Pending
                    </>
                  )}
                </Badge>
              </div>

              {split.status === "pending" && (
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <MessageCircle size={14} className="mr-1" />
                    Remind
                  </Button>
                  <Button size="sm" className="flex-1">
                    Mark Paid
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-16 flex-col bg-transparent">
          <MessageCircle size={20} className="mb-1" />
          <span className="text-xs">Send Reminder</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col bg-transparent">
          <Users size={20} className="mb-1" />
          <span className="text-xs">Settle All</span>
        </Button>
      </div>
    </div>
  )
}
