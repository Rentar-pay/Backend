"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Zap, TrendingUp } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 gap-2 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live on Stellar Testnet • Audited by Certik
          </Badge>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Never miss rent again.
            <span className="block mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Save smarter on Stellar.</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Rentar is the first rent-savings vault on Soroban. Auto-save, earn yield, pay landlords directly from blockchain with Freighter & WalletConnect. SEP-10 secured.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth"><Button size="lg" className="gap-2 h-12 px-8 text-base">Start Saving <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="#how-it-works"><Button size="lg" variant="outline" className="h-12 px-8 text-base">How it Works</Button></Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Shield, label: "Non-custodial", desc: "You control keys" },
              { icon: Zap, label: "Auto-save", desc: "Set & forget" },
              { icon: TrendingUp, label: "Earn Yield", desc: "4.2% APY avg" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 rounded-2xl border bg-card p-4 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><f.icon className="h-5 w-5" /></div>
                <div><p className="font-semibold text-sm">{f.label}</p><p className="text-xs text-muted-foreground">{f.desc}</p></div>
              </div>
            ))}
          </div>

          <div className="mt-16 relative mx-auto max-w-5xl">
            <div className="rounded-2xl border bg-card shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5"><div className="h-3 w-3 rounded-full bg-red-400" /><div className="h-3 w-3 rounded-full bg-yellow-400" /><div className="h-3 w-3 rounded-full bg-green-400" /></div>
                <span className="text-xs text-muted-foreground ml-2">rentar.io/dashboard • Savings Overview</span>
              </div>
              <div className="grid md:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-background to-muted/30">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-32 rounded-xl bg-primary/5 border border-primary/10 p-4">
                    <div className="h-4 w-24 bg-primary/20 rounded mb-3" />
                    <div className="h-8 w-32 bg-foreground/10 rounded" />
                    <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden"><div className="h-full w-2/3 bg-primary rounded-full" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 rounded-xl bg-card border p-3"><div className="h-3 w-12 bg-muted rounded mb-2" /><div className="h-5 w-16 bg-foreground/10 rounded" /></div>
                    <div className="h-20 rounded-xl bg-card border p-3"><div className="h-3 w-12 bg-muted rounded mb-2" /><div className="h-5 w-16 bg-foreground/10 rounded" /></div>
                    <div className="h-20 rounded-xl bg-card border p-3"><div className="h-3 w-12 bg-muted rounded mb-2" /><div className="h-5 w-16 bg-foreground/10 rounded" /></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-24 rounded-xl bg-card border p-3"><div className="h-3 w-16 bg-muted rounded mb-3" /><div className="space-y-2"><div className="h-3 w-full bg-muted rounded" /><div className="h-3 w-2/3 bg-muted rounded" /></div></div>
                  <div className="h-36 rounded-xl bg-primary text-primary-foreground p-4"><div className="h-4 w-20 bg-white/20 rounded mb-2" /><div className="h-6 w-24 bg-white/30 rounded" /><div className="mt-4 h-10 w-full bg-white/20 rounded-lg" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
