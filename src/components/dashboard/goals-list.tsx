"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSavingsGoals, useDeposit } from "@/hooks/use-savings"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { Target, Plus } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function GoalsList() {
  const { data: goals, isLoading } = useSavingsGoals()
  const { mutate: deposit, isPending } = useDeposit()
  const [depositAmounts, setDepositAmounts] = useState<Record<string,string>>({})

  if (isLoading) return <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-40" /></CardContent></Card>

  if (!goals || goals.length === 0) {
    return <EmptyState icon={<Target className="h-10 w-10 mx-auto" />} title="No savings goals" description="Create your first rent savings goal to start auto-saving and earning yield on Stellar." action={{ label: "Create Goal", onClick: () => window.location.href = "/dashboard/goals" }} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {goals.map((goal) => (
        <Card key={goal.id} className="hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">{goal.title}</CardTitle>
            <Badge variant={goal.status === "completed" ? "success" : "secondary"}>{goal.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
            <div className="flex gap-2">
              <Input placeholder="Amount" type="number" value={depositAmounts[goal.id] || ""} onChange={(e) => setDepositAmounts({ ...depositAmounts, [goal.id]: e.target.value })} className="flex-1" />
              <Button disabled={isPending} onClick={() => {
                const amt = Number(depositAmounts[goal.id])
                if (!amt) return toast.error("Enter amount")
                deposit({ goalId: goal.id, amount: amt }, { onSuccess: () => { toast.success(`Deposited $${amt}`); setDepositAmounts({ ...depositAmounts, [goal.id]: "" }) } })
              }}>Deposit</Button>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Monthly Rent: {formatCurrency(goal.monthlyRent)}</span>
              <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
      <Card className="border-dashed flex flex-col items-center justify-center p-8">
        <Link href="/dashboard/goals"><Button variant="outline" className="gap-2"><Plus className="h-4 w-4" /> New Goal</Button></Link>
      </Card>
    </div>
  )
}
