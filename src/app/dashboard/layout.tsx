"use client"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Search, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { DashboardSkeleton } from "@/components/shared/skeletons"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth")
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return <div className="p-8"><DashboardSkeleton /></div>
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="lg:hidden flex items-center gap-2 font-bold"><div className="h-6 w-6 rounded bg-primary text-primary-foreground grid place-items-center text-xs">R</div> Rentar</Link>
            <div className="hidden md:flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground"><Search className="h-4 w-4" /> Search goals, landlords...</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
              <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
            </Button>
            <Link href="/dashboard/notifications"><Button variant="ghost" size="icon" className="relative"><Bell className="h-4 w-4" /><span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" /></Button></Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">{children}</main>
        <MobileNav />
      </div>
    </div>
  )
}
