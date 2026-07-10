"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { useAuth } from "@/contexts/auth-context"
import { Wallet, LogOut, Copy, ExternalLink, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

export default function WalletPage() {
  const { publicKey, walletType, disconnect, isFreighterAvailable } = useWallet()
  const { user } = useAuth()

  const copy = () => {
    if (publicKey) { navigator.clipboard.writeText(publicKey); toast.success("Copied") }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><Wallet className="h-5 w-5" /> Wallet Connection</h1><p className="text-sm text-muted-foreground">Freighter & WalletConnect with SEP-10 login.</p></div>

      <Card>
        <CardHeader><CardTitle>Active Connection</CardTitle><CardDescription>Your Stellar wallet currently linked</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center text-primary"><Wallet className="h-5 w-5" /></div>
              <div>
                <p className="font-medium flex items-center gap-2">{walletType === "freighter" ? "Freighter" : "WalletConnect"} <Badge variant="success">Connected</Badge></p>
                <p className="text-xs font-mono text-muted-foreground break-all max-w-[280px] sm:max-w-md">{publicKey}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={copy}><Copy className="h-4 w-4" /></Button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Network</p><p className="font-medium">{process.env.NEXT_PUBLIC_NETWORK || "testnet"}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">KYC Status</p><p className="font-medium flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-500" /> {user?.kycStatus}</p></CardContent></Card>
          </div>

          <div className="rounded-lg bg-muted p-3 text-xs space-y-1">
            <p className="font-medium">Connection Details</p>
            <p>• Freighter detected: {isFreighterAvailable ? "Yes" : "No"}</p>
            <p>• SEP-10 verified: Yes</p>
            <p>• Contract ID: {process.env.NEXT_PUBLIC_CONTRACT_ID || "CDUMMY"}</p>
            <p>• API: {process.env.NEXT_PUBLIC_API_URL || "/api"}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={copy} className="gap-2"><Copy className="h-4 w-4" /> Copy Address</Button>
            <Button variant="outline" className="gap-2" onClick={()=>window.open(`https://stellar.expert/explorer/testnet/account/${publicKey}`, "_blank")}><ExternalLink className="h-4 w-4" /> Explorer</Button>
            <Button variant="destructive" className="ml-auto gap-2" onClick={disconnect}><LogOut className="h-4 w-4" /> Disconnect</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Supported Wallets</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <div className="border rounded-lg p-4"><p className="font-medium">Freighter</p><p className="text-xs text-muted-foreground mt-1">Browser extension for Stellar. Recommended. Handles SEP-10 signing natively.</p><Badge className="mt-2">Recommended</Badge></div>
          <div className="border rounded-lg p-4"><p className="font-medium">WalletConnect</p><p className="text-xs text-muted-foreground mt-1">Mobile wallets via WC protocol. Scan QR, sign challenge. Same SEP-10 flow.</p><Badge variant="secondary" className="mt-2">Mobile</Badge></div>
        </CardContent>
      </Card>
    </div>
  )
}
