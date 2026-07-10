"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { useAuth } from "@/contexts/auth-context"
import { Wallet, ExternalLink, ShieldCheck, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const { connectFreighter, connectWalletConnect, isConnecting, isFreighterAvailable } = useWallet()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    router.push("/dashboard")
    return null
  }

  const handleFreighter = async () => {
    setError(null)
    try {
      await connectFreighter()
      router.push("/dashboard")
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleWC = async () => {
    setError(null)
    try {
      await connectWalletConnect()
      router.push("/dashboard")
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-primary/5 via-background to-indigo-50 dark:to-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl"><div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">R</div> Rentar</Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Connect Wallet</h1>
          <p className="mt-2 text-sm text-muted-foreground">SEP-10 secure login — sign a challenge with your wallet. No passwords.</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-500" /> Stellar Wallet</CardTitle>
            <CardDescription>Choose Freighter (recommended) or WalletConnect. We only request signature.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleFreighter} disabled={isConnecting} className="w-full h-12 justify-between">
              <span className="flex items-center gap-2"><Wallet className="h-4 w-4" /> Freighter Wallet</span>
              {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs opacity-70">{isFreighterAvailable ? "Detected" : "Install"}</span>}
            </Button>

            <Button onClick={handleWC} disabled={isConnecting} variant="outline" className="w-full h-12 justify-between">
              <span className="flex items-center gap-2"><ExternalLink className="h-4 w-4" /> WalletConnect</span>
              {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs">Stellar compatible</span>}
            </Button>

            {error && <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">{error}</div>}

            <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground mb-1">How SEP-10 Login Works:</p>
              1. We request a challenge from API<br/>2. Your wallet signs it locally<br/>3. API verifies signature & issues JWT<br/>Blockchain touched only for signing.
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Network: <code className="bg-muted px-1 rounded">{process.env.NEXT_PUBLIC_NETWORK || "testnet"}</code> • Contract: <code className="bg-muted px-1 rounded truncate">{(process.env.NEXT_PUBLIC_CONTRACT_ID || "CDC...").slice(0,10)}...</code>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">By connecting, you agree to Terms & Privacy. Demo mode available if backend unreachable.</p>
      </div>
    </div>
  )
}
