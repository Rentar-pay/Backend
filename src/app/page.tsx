import { Header } from "@/components/layout/header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />

        <section id="security" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold">Built for Security & Compliance</h2>
                <ul className="mt-6 space-y-4">
                  {[
                    "SEP-10 authentication — no passwords stored",
                    "Non-custodial — you sign, you own",
                    "Soroban smart contracts audited",
                    "API never exposes private keys",
                    "Dark mode, a11y, responsive by default",
                  ].map((t) => (
                    <li key={t} className="flex gap-3 text-sm"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> {t}</li>
                  ))}
                </ul>
                <div className="mt-8 flex gap-3">
                  <Link href="/auth"><Button>Launch App</Button></Link>
                  <Link href="https://github.com" target="_blank"><Button variant="outline">View Audit</Button></Link>
                </div>
              </div>
              <Card className="p-6 space-y-4">
                <div className="flex gap-1 text-amber-400"><Star className="h-4 w-4 fill-amber-400" /><Star className="h-4 w-4 fill-amber-400" /><Star className="h-4 w-4 fill-amber-400" /><Star className="h-4 w-4 fill-amber-400" /><Star className="h-4 w-4 fill-amber-400" /></div>
                <p className="text-sm leading-relaxed">“Rentar helped me save $5,400 for rent and never miss a payment. The auto-save and yield is genius. Stellar integration is seamless.”</p>
                <div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-primary/20" /><div><p className="text-sm font-medium">Jordan Lee</p><p className="text-xs text-muted-foreground">Brooklyn, NY</p></div></div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 text-center border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold">Ready to never miss rent?</h2>
            <p className="mt-3 text-muted-foreground">Connect Freighter in 30 seconds. Start saving today.</p>
            <div className="mt-8"><Link href="/auth"><Button size="lg" className="h-12 px-8">Connect Wallet & Start</Button></Link></div>
            <p className="mt-4 text-xs text-muted-foreground">Network: {process.env.NEXT_PUBLIC_NETWORK || "testnet"} • Contract: {process.env.NEXT_PUBLIC_CONTRACT_ID || "CDC...RENTAR"} • API: {process.env.NEXT_PUBLIC_API_URL || "/api"}</p>
          </div>
        </section>
      </main>
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between gap-6 text-sm text-muted-foreground">
          <div><div className="flex items-center gap-2 text-foreground font-bold"><div className="h-6 w-6 rounded bg-primary text-primary-foreground grid place-items-center text-xs">R</div> Rentar</div><p className="mt-2 max-w-xs">Rent savings infrastructure on Stellar. Not a bank. DeFi yields not guaranteed.</p></div>
          <div className="grid grid-cols-2 gap-8">
            <div><p className="font-medium text-foreground">Product</p><ul className="mt-2 space-y-1"><li>Dashboard</li><li>Docs</li><li>API</li></ul></div>
            <div><p className="font-medium text-foreground">Legal</p><ul className="mt-2 space-y-1"><li>Privacy</li><li>Terms</li><li>Security</li></ul></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
