"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, PiggyBank, Home, BarChart3, User } from "lucide-react"

const items = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/dashboard/savings", icon: PiggyBank, label: "Savings" },
  { href: "/dashboard/rent", icon: Home, label: "Rent" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Stats" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-lg lg:hidden">
      <div className="grid grid-cols-5 gap-1 p-2">
        {items.map((item) => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 rounded-lg py-2 text-xs", active ? "text-primary bg-primary/10" : "text-muted-foreground")}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
