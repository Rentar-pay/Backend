"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Moon, Sun, Menu, Wallet } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"

export function Header() {
  const { isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">R</div>
            <span className="text-xl font-bold tracking-tight">Rentar</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition">Features</Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">How it works</Link>
            <Link href="#security" className="text-muted-foreground hover:text-foreground transition">Security</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          {isAuthenticated ? (
            <Link href="/dashboard"><Button>Dashboard</Button></Link>
          ) : (
            <>
              <Link href="/auth" className="hidden sm:inline"><Button variant="ghost">Sign In</Button></Link>
              <Link href="/auth"><Button className="gap-2"><Wallet className="h-4 w-4" /> Connect Wallet</Button></Link>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm">
            <Link href="#features">Features</Link>
            <Link href="#how-it-works">How it works</Link>
            <Link href="#security">Security</Link>
            <Link href="/auth" className="mt-2"><Button className="w-full">Connect Wallet</Button></Link>
          </nav>
        </div>
      )}
    </header>
  )
}
