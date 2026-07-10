export function HowItWorks() {
  const steps = [
    { n: "01", title: "Connect Wallet", desc: "Freighter or WalletConnect. SEP-10 challenge signed locally, verified server-side." },
    { n: "02", title: "Create Goal", desc: "Set rent amount, target, deadline, and link landlord. API creates Soroban vault." },
    { n: "03", title: "Auto Save & Earn", desc: "Deposit XLM/USDC. Funds earn yield via Soroban DeFi strategies." },
    { n: "04", title: "One-Click Rent Pay", desc: "When due, sign transaction to pay landlord directly on-chain. Done!" },
  ]
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">How Rentar Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border p-6 bg-card">
              <span className="text-5xl font-black text-muted/60">{s.n}</span>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              {s.n !== "04" && <div className="hidden md:block absolute top-12 -right-3 h-1 w-6 bg-border" />}
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border bg-primary text-primary-foreground p-8 text-center">
          <p className="text-sm uppercase tracking-widest opacity-70">Security Model</p>
          <p className="mt-2 max-w-2xl mx-auto">Frontend never touches blockchain except for wallet signing. All business logic via REST API. Contract ID: <code className="bg-white/20 px-2 py-1 rounded text-xs">{process.env.NEXT_PUBLIC_CONTRACT_ID || "C...RENTAR"}</code></p>
        </div>
      </div>
    </section>
  )
}
