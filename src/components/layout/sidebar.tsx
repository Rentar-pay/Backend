"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  PiggyBank, 
  Target, 
  ArrowDownUp, 
  Home, 
  Users, 
  History, 
  Bell, 
  BarChart3, 
  User, 
  Settings, 
  Wallet,
  Shield,
  LogOut
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useWallet } from "@/contexts/wallet-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/savings", label: "Savings", icon: PiggyBank },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/deposit", label: "Deposit", icon: ArrowDownUp },
  { href: "/dashboard/rent", label: "Rent Pay", icon: Home },
  { href: "/dashboard/landlords", label: "Landlords", icon: Users },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
]

const bottomItems = [
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Admin", icon: Shield, adminOnly: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { disconnect } = useWallet()

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-muted/20">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">R</div>
        <span className="font-bold">Rentar</span>
        <span className="ml-auto text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">BETA</span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors", isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <Separator className="my-4" />
        <nav className="grid gap-1 px-3">
          {bottomItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", pathname === item.href ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-card border p-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
            {user?.displayName?.[0] || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.displayName || "Demo User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.publicKey?.slice(0,12)}...</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={disconnect}><LogOut className="h-3 w-3" /></Button>
        </div>
      </div>
    </aside>
  )
}
