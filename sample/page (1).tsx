"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, DollarSign, Target, Sparkles } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Welcome to BudgetBuddy! 🎉",
    subtitle: "Let's get you set up in just a few steps",
    component: "welcome",
  },
  {
    id: 2,
    title: "What's your name?",
    subtitle: "We'll use this to personalize your experience",
    component: "name",
  },
  {
    id: 3,
    title: "Set your monthly budget",
    subtitle: "Don't worry, you can change this anytime",
    component: "budget",
  },
  {
    id: 4,
    title: "What's your main goal?",
    subtitle: "We'll help you track your progress",
    component: "goal",
  },
  {
    id: 5,
    title: "You're all set! 🚀",
    subtitle: "Ready to take control of your finances?",
    component: "complete",
  },
]

const goalOptions = [
  { id: "emergency", title: "Build Emergency Fund", icon: "🛡️", description: "Save for unexpected expenses" },
  { id: "vacation", title: "Save for Vacation", icon: "✈️", description: "Plan your dream trip" },
  { id: "debt", title: "Pay Off Debt", icon: "💳", description: "Become debt-free" },
  { id: "general", title: "General Savings", icon: "💰", description: "Build wealth over time" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    monthlyBudget: "",
    goal: "",
    goalAmount: "",
  })

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      window.location.href = "/"
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const renderStepContent = () => {
    const step = steps[currentStep - 1]

    switch (step.component) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <div className="w-28 h-28 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
              <Sparkles className="text-white" size={36} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Welcome to the future of budgeting!</h2>
              <p className="text-gray-600 text-base leading-relaxed">
                BudgetBuddy helps Gen Z manage money like a pro. Track spending, split bills with friends, and reach
                your financial goals with AI-powered insights.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center pt-4">
              <div className="space-y-3">
                <div className="text-3xl">🤖</div>
                <p className="text-sm text-gray-600">AI Insights</p>
              </div>
              <div className="space-y-3">
                <div className="text-3xl">👥</div>
                <p className="text-sm text-gray-600">Split Bills</p>
              </div>
              <div className="space-y-3">
                <div className="text-3xl">🎯</div>
                <p className="text-sm text-gray-600">Reach Goals</p>
              </div>
            </div>
          </div>
        )

      case "name":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👋</span>
              </div>
            </div>
            <div className="space-y-4">
              <Label htmlFor="name" className="text-base font-medium">
                First Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your first name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="h-14 text-base"
              />
            </div>
          </div>
        )

      case "budget":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="text-green-600" size={28} />
              </div>
            </div>
            <div className="space-y-4">
              <Label htmlFor="budget" className="text-base font-medium">
                Monthly Budget
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="budget"
                  type="number"
                  placeholder="2000"
                  value={formData.monthlyBudget}
                  onChange={(e) => updateFormData("monthlyBudget", e.target.value)}
                  className="h-14 text-base pl-12"
                />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                This helps us track your spending and send helpful alerts when you're close to your limit.
              </p>
            </div>
          </div>
        )

      case "goal":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="text-blue-600" size={28} />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-base font-medium">Choose your primary goal</Label>
              <div className="grid grid-cols-1 gap-4">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => updateFormData("goal", goal.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.goal === goal.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{goal.icon}</span>
                      <div>
                        <p className="font-medium text-base">{goal.title}</p>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {formData.goal && (
                <div className="space-y-3 pt-4">
                  <Label htmlFor="goalAmount" className="text-sm font-medium">
                    Target Amount (optional)
                  </Label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="goalAmount"
                      type="number"
                      placeholder="1000"
                      value={formData.goalAmount}
                      onChange={(e) => updateFormData("goalAmount", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "complete":
        return (
          <div className="text-center space-y-8">
            <div className="w-28 h-28 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto flex items-center justify-center">
              <span className="text-white text-4xl">🎉</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">You're ready to go, {formData.name || "there"}!</h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Your BudgetBuddy account is all set up. Start tracking your expenses, splitting bills with friends, and
                crushing your financial goals!
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="font-medium text-purple-800 mb-4 text-lg">Your Setup Summary:</h3>
              <div className="space-y-2 text-sm text-purple-700">
                <p>💰 Monthly Budget: ${formData.monthlyBudget || "Not set"}</p>
                <p>🎯 Primary Goal: {goalOptions.find((g) => g.id === formData.goal)?.title || "Not selected"}</p>
                {formData.goalAmount && <p>💵 Target Amount: ${formData.goalAmount}</p>}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true
      case 2:
        return formData.name.trim().length > 0
      case 3:
        return formData.monthlyBudget.trim().length > 0
      case 4:
        return formData.goal.length > 0
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Status Bar Safe Area */}
      <div className="h-safe-top bg-gradient-to-r from-purple-500 to-pink-500"></div>

      <div className="px-6 pt-8">
        <div className="max-w-sm mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span>
                Step {currentStep} of {steps.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Main Card */}
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="mb-8">
                <h1 className="text-xl font-bold text-gray-800 mb-2">{steps[currentStep - 1].title}</h1>
                <p className="text-gray-600 text-sm leading-relaxed">{steps[currentStep - 1].subtitle}</p>
              </div>

              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 gap-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="bg-transparent h-12 px-6"
                >
                  <ChevronLeft size={18} className="mr-1" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12 px-6 flex-1"
                >
                  {currentStep === steps.length ? "Get Started" : "Continue"}
                  {currentStep !== steps.length && <ChevronRight size={18} className="ml-1" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skip Option */}
          {currentStep > 1 && currentStep < steps.length && (
            <div className="text-center mt-6 pb-8">
              <button
                onClick={() => setCurrentStep(steps.length)}
                className="text-sm text-gray-500 hover:text-gray-700 underline py-4"
              >
                Skip setup for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
