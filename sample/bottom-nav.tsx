"use client"

import { Home, CreditCard, Users, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/transactions", icon: CreditCard, label: "Transactions" },
  { href: "/split-settle", icon: Users, label: "Split" },
  { href: "/profile", icon: User, label: "Profile" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 px-2 py-1 z-50 safe-area-pb">
      <div className="flex justify-around items-center">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors min-h-[60px] justify-center",
                isActive ? "text-purple-600 bg-purple-50" : "text-gray-500 hover:text-gray-700",
              )}
            >
              <Icon size={22} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
