"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSavingsGoals, useCreateGoal } from "@/hooks/use-savings"
import { useLandlords } from "@/hooks/use-savings"
import { toast } from "sonner"
import { GoalsList } from "@/components/dashboard/goals-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GoalsPage() {
  const { data: landlords } = useLandlords()
  const createGoal = useCreateGoal()
  const [form, setForm] = useState({ title: "", targetAmount: "", monthlyRent: "", deadline: "", landlordId: "", description: "" })

  const handleCreate = () => {
    if (!form.title || !form.targetAmount) return toast.error("Title and target required")
    createGoal.mutate({
      title: form.title,
      targetAmount: Number(form.targetAmount),
      monthlyRent: Number(form.monthlyRent),
      deadline: form.deadline ? new Date(form.deadline).toISOString() : new Date(Date.now()+90*24*3600*1000).toISOString(),
      landlordId: form.landlordId,
    }, {
      onSuccess: () => {
        toast.success("Goal created! Soroban vault initiated via API.")
        setForm({ title: "", targetAmount: "", monthlyRent: "", deadline: "", landlordId: "", description: "" })
      },
      onError: (e: any) => toast.error(e.message)
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Savings Goals</h1>
        <p className="text-sm text-muted-foreground">Create rent vaults on Soroban via Rentar API. Wallet only used for signing.</p>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">My Goals</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <GoalsList />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Create Savings Goal</CardTitle>
              <CardDescription>Define rent target. API will create Soroban contract vault. You sign deposit transactions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Goal Title *</Label>
                <Input placeholder="e.g. Downtown Loft 3 months rent" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Target Amount (USD) *</Label><Input type="number" placeholder="4500" value={form.targetAmount} onChange={e=>setForm({...form, targetAmount:e.target.value})} /></div>
                <div className="space-y-2"><Label>Monthly Rent</Label><Input type="number" placeholder="1500" value={form.monthlyRent} onChange={e=>setForm({...form, monthlyRent:e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={e=>setForm({...form, deadline:e.target.value})} /></div>
                <div className="space-y-2">
                  <Label>Landlord (optional)</Label>
                  <select className="flex h-9 w-full rounded-lg border bg-transparent px-3 text-sm" value={form.landlordId} onChange={e=>setForm({...form, landlordId:e.target.value})}>
                    <option value="">Select landlord</option>
                    {landlords?.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Why is this goal important?" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} /></div>
              <Button onClick={handleCreate} disabled={createGoal.isPending} className="w-full">{createGoal.isPending ? "Creating vault..." : "Create Goal"}</Button>
              <p className="text-xs text-muted-foreground">Contract ID: {process.env.NEXT_PUBLIC_CONTRACT_ID || "CFAKE"} • Network: {process.env.NEXT_PUBLIC_NETWORK}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
