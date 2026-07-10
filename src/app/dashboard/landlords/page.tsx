"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLandlords } from "@/hooks/use-savings"
import { landlordService } from "@/lib/api/services"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Users, Wallet, Mail, MapPin, Plus, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function LandlordsPage() {
  const { data: landlords, refetch } = useLandlords()
  const qc = useQueryClient()
  const [form, setForm] = useState({ name: "", walletAddress: "", email: "", propertyAddress: "", rentAmount: "", dueDay: "1" })

  const handleCreate = async () => {
    if (!form.name || !form.walletAddress) return toast.error("Name and wallet required")
    try {
      await landlordService.create({ ...form, rentAmount: Number(form.rentAmount), dueDay: Number(form.dueDay) })
      toast.success("Landlord added")
      qc.invalidateQueries({ queryKey: ["landlords"] })
      setForm({ name: "", walletAddress: "", email: "", propertyAddress: "", rentAmount: "", dueDay: "1" })
    } catch (e:any) { toast.error(e.message) }
  }

  const handleDelete = async (id: string) => {
    try {
      await landlordService.delete(id)
      toast.success("Landlord removed")
      qc.invalidateQueries({ queryKey: ["landlords"] })
    } catch (e:any) { toast.error(e.message) }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6" /> Landlord Management</h1>
          <p className="text-sm text-muted-foreground">Manage verified landlords, wallets, auto-pay settings.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {landlords?.map(l => (
            <Card key={l.id}>
              <CardContent className="p-6 flex justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2"><h3 className="font-semibold">{l.name}</h3><Badge variant={l.autoPayEnabled ? "success" : "secondary"}>{l.autoPayEnabled ? "Auto-pay" : "Manual"}</Badge></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Wallet className="h-3 w-3" /> {l.walletAddress}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {l.email}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {l.propertyAddress}</span>
                    <span>Due day: {l.dueDay} • ${l.rentAmount}/mo</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(l.id)}><Trash className="h-4 w-4 text-destructive" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Plus className="h-4 w-4" /> Add Landlord</CardTitle>
            <CardDescription>Wallet verification via Stellar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label>Name</Label><Input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Alex Morgan" /></div>
            <div className="space-y-1"><Label>Wallet Address *</Label><Input value={form.walletAddress} onChange={e=>setForm({...form, walletAddress:e.target.value})} placeholder="G..." /></div>
            <div className="space-y-1"><Label>Email</Label><Input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="landlord@email.com" /></div>
            <div className="space-y-1"><Label>Property Address</Label><Input value={form.propertyAddress} onChange={e=>setForm({...form, propertyAddress:e.target.value})} placeholder="123 Main St..." /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Rent Amount</Label><Input type="number" value={form.rentAmount} onChange={e=>setForm({...form, rentAmount:e.target.value})} placeholder="1500" /></div>
              <div className="space-y-1"><Label>Due Day</Label><Input type="number" value={form.dueDay} onChange={e=>setForm({...form, dueDay:e.target.value})} placeholder="1" /></div>
            </div>
            <Button onClick={handleCreate} className="w-full">Add Landlord</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
