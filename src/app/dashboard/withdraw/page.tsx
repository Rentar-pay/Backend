"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSavingsGoals, useWithdraw } from "@/hooks/use-savings"
import { toast } from "sonner"
import { ArrowUpFromLine, AlertTriangle } from "lucide-react"

export default function WithdrawPage() {
  const { data: goals } = useSavingsGoals()
  const withdraw = useWithdraw()
  const [selected, setSelected] = useState("")
  const [amount, setAmount] = useState("")

  const handleWithdraw = () => {
    if (!selected || !amount) return toast.error("Select goal and amount")
    withdraw.mutate({ goalId: selected, amount: Number(amount) }, {
      onSuccess: (tx) => toast.success(`Withdrew $${amount}. Tx ${tx.txHash}`),
      onError: (e:any) => toast.error(e.message)
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><ArrowUpFromLine className="h-6 w-6" /> Withdraw</h1>
        <p className="text-sm text-muted-foreground">Withdraw from vault. Early withdrawal may forfeit yield.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
          <CardDescription>Sign withdrawal with wallet. API processes Soroban unlock.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Goal</Label>
            <select className="flex h-9 w-full rounded-lg border px-3 text-sm" value={selected} onChange={e=>setSelected(e.target.value)}>
              <option value="">Select goal</option>
              {goals?.map(g => <option key={g.id} value={g.id}>{g.title} - Available ${g.currentAmount}</option>)}
            </select>
          </div>
          <div className="space-y-2"><Label>Amount</Label><Input type="number" placeholder="200" value={amount} onChange={e=>setAmount(e.target.value)} /></div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 p-3 text-xs flex gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /> Withdrawing below rent due may risk late payment. Ensure emergency buffer remains.</div>
          <Button variant="destructive" onClick={handleWithdraw} disabled={withdraw.isPending} className="w-full">{withdraw.isPending ? "Processing..." : "Withdraw"}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
