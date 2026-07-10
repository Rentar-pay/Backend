import { PiggyBank, ShieldCheck, Wallet, BarChart3, Clock, Sparkles } from "lucide-react"

const features = [
  { icon: PiggyBank, title: "Goal-Based Savings", desc: "Create multiple rent vaults with target amounts, deadlines, and auto-contributions from Stellar." },
  { icon: ShieldCheck, title: "SEP-10 Secure Login", desc: "No passwords. Authenticate with Freighter signing. Military-grade challenge verification." },
  { icon: Wallet, title: "Freighter + WalletConnect", desc: "Connect any Stellar wallet. Sign transactions only — funds never leave your control until you pay." },
  { icon: Clock, title: "Auto Rent Payments", desc: "Schedule on-chain rent transfers. Never late, never stressed. Smart reminders included." },
  { icon: BarChart3, title: "Analytics & Yield", desc: "Visualize savings growth, yield earned via Soroban DeFi, and spending patterns with Recharts." },
  { icon: Sparkles, title: "Landlord Management", desc: "Add landlords, verify wallets, set due dates, enable auto-pay. All in one beautiful dashboard." },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30 border-y">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything to master your rent</h2>
          <p className="mt-4 text-muted-foreground">Built on Stellar Soroban smart contracts. Frontend talks only to Rentar API — blockchain interaction limited to wallet signing.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border bg-card p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
