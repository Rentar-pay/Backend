"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { userService } from "@/lib/api/services"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, publicKey } = useAuth()
  const [form, setForm] = useState({ displayName: user?.displayName || "", email: user?.email || "" })

  const handleSave = async () => {
    try { await userService.updateProfile(form); toast.success("Profile updated") } catch(e:any){ toast.error(e.message) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold">Profile</h1><p className="text-sm text-muted-foreground">Manage your Stellar identity.</p></div>

      <Card>
        <CardHeader className="flex flex-row gap-4 items-center">
          <Avatar className="h-16 w-16"><AvatarFallback className="text-xl">{user?.displayName?.[0] || "U"}</AvatarFallback></Avatar>
          <div>
            <CardTitle>{user?.displayName || "Demo User"}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2"><span className="font-mono text-xs break-all">{publicKey || user?.publicKey}</span><Badge variant="success">{user?.kycStatus}</Badge></CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Display Name</Label><Input value={form.displayName} onChange={e=>setForm({...form, displayName:e.target.value})} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /></div>
          </div>
          <div className="space-y-2"><Label>Wallet Address (public)</Label><Input value={publicKey || ""} disabled className="font-mono text-xs" /></div>
          <div className="rounded-lg bg-muted p-3 text-xs">Network: {process.env.NEXT_PUBLIC_NETWORK} • Contract: {process.env.NEXT_PUBLIC_CONTRACT_ID} • Your keys never leave wallet. Only signed challenges sent to API.</div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
