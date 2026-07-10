"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSavingsGoals, useDeposit } from "@/hooks/use-savings"
import { toast } from "sonner"
import { ArrowDownToLine, Wallet, Info } from "lucide-react"

export default function DepositPage() {
  const { data: goals } = useSavingsGoals()
  const deposit = useDeposit()
  const [selected, setSelected] = useState("")
  const [amount, setAmount] = useState("")

  const handleDeposit = () => {
    if (!selected || !amount) return toast.error("Select goal and amount")
    deposit.mutate({ goalId: selected, amount: Number(amount) }, {
      onSuccess: (tx) => {
        toast.success(`Deposited $${amount}. Tx: ${tx.txHash}`)
        setAmount("")
      },
      onError: (e:any) => toast.error(e.message)
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><ArrowDownToLine className="h-6 w-6 text-primary" /> Deposit Flow</h1>
        <p className="text-sm text-muted-foreground">Add funds to Soroban vault via API. Sign with Freighter.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Deposit to Goal</CardTitle>
            <CardDescription>Funds will be locked in rent vault and earn yield.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Goal</Label>
              <select className="flex h-9 w-full rounded-lg border px-3 text-sm" value={selected} onChange={e=>setSelected(e.target.value)}>
                <option value="">Choose goal</option>
                {goals?.map(g => <option key={g.id} value={g.id}>{g.title} - ${g.currentAmount}/${g.targetAmount}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Amount (USDC / XLM)</Label>
              <Input type="number" placeholder="500" value={amount} onChange={e=>setAmount(e.target.value)} />
            </div>
            <div className="rounded-lg bg-muted p-3 text-xs flex gap-2"><Info className="h-4 w-4 shrink-0" /> Deposit triggers Soroban contract call via backend. Your wallet will prompt to sign transaction.</div>
            <Button onClick={handleDeposit} disabled={deposit.isPending} className="w-full">{deposit.isPending ? "Depositing..." : `Deposit $${amount || "0"}`}</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Wallet className="h-4 w-4" /> Wallet</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Connected via {process.env.NEXT_PUBLIC_NETWORK || "testnet"}. Balance fetched via Horizon. Deposit is non-custodial escrow until rent payment.
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-4">
              <p className="font-semibold">Estimated Yield</p>
              <p className="text-2xl font-bold mt-1">4.2% APY</p>
              <p className="text-xs opacity-80 mt-1">Depositing $500 earns ~$1.75/mo</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
