"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLandlords, useUpcomingRent, usePayRent, useSavingsGoals } from "@/hooks/use-savings"
import { toast } from "sonner"
import { Home, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

export default function RentPayPage() {
  const { data: landlords } = useLandlords()
  const { data: upcoming } = useUpcomingRent()
  const { data: goals } = useSavingsGoals()
  const payRent = usePayRent()
  const [landlordId, setLandlordId] = useState("")
  const [amount, setAmount] = useState("")
  const [goalId, setGoalId] = useState("")

  const handlePay = () => {
    if (!landlordId || !amount) return toast.error("Select landlord and amount")
    payRent.mutate({ landlordId, amount: Number(amount), goalId }, {
      onSuccess: (tx) => toast.success(`Rent paid! Tx ${tx.txHash}`),
      onError: (e:any) => toast.error(e.message)
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Home className="h-6 w-6" /> Rent Payment Flow</h1>
        <p className="text-sm text-muted-foreground">Pay landlords directly on Stellar. Signed via wallet, settled via Soroban.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Pay Rent</CardTitle><CardDescription>Direct on-chain transfer to landlord wallet.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Landlord</Label>
              <select className="flex h-9 w-full rounded-lg border px-3 text-sm" value={landlordId} onChange={e=>setLandlordId(e.target.value)}>
                <option value="">Select landlord</option>
                {landlords?.map(l => <option key={l.id} value={l.id}>{l.name} - {formatCurrency(l.rentAmount)}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Amount</Label><Input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="1500" /></div>
              <div className="space-y-2"><Label>Use Savings Goal (optional)</Label>
                <select className="flex h-9 w-full rounded-lg border px-3 text-sm" value={goalId} onChange={e=>setGoalId(e.target.value)}>
                  <option value="">External wallet</option>
                  {goals?.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>
            </div>
            <Button onClick={handlePay} disabled={payRent.isPending} className="w-full">{payRent.isPending ? "Paying..." : `Pay ${amount ? formatCurrency(Number(amount)) : "Rent"}`}</Button>
            <p className="text-xs text-muted-foreground">Contract: {process.env.NEXT_PUBLIC_CONTRACT_ID} - signing requested via Freighter popup.</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Upcoming</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {upcoming?.map((u,i) => (
                <div key={i} className="flex justify-between border rounded-lg p-3 text-sm">
                  <div><p className="font-medium">{u.landlord.name}</p><p className="text-xs text-muted-foreground">{new Date(u.dueDate).toLocaleDateString()}</p></div>
                  <div className="text-right"><p>{formatCurrency(u.amount)}</p>{i===0 && <Badge variant="warning" className="text-[10px]">Due in 3d</Badge>}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200">
            <CardContent className="p-4 flex gap-2 text-sm"><CheckCircle className="h-5 w-5 text-emerald-600" /> 6 months on-time payments. Keep streak for landlord trust score +10%</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
