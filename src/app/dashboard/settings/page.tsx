"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { useState } from "react"
import { Moon, Sun, Bell, Shield, Trash } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-sm text-muted-foreground">Preferences, notifications, security.</p></div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Sun className="h-4 w-4" /> Appearance</CardTitle><CardDescription>Dark mode and accessibility.</CardDescription></CardHeader>
        <CardContent className="flex gap-2">
          <Button variant={theme==="light" ? "default" : "outline"} onClick={()=>setTheme("light")} className="gap-2"><Sun className="h-4 w-4" /> Light</Button>
          <Button variant={theme==="dark" ? "default" : "outline"} onClick={()=>setTheme("dark")} className="gap-2"><Moon className="h-4 w-4" /> Dark</Button>
          <Button variant={theme==="system" ? "default" : "outline"} onClick={()=>setTheme("system")}>System</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Rent Due Reminders</p><p className="text-xs text-muted-foreground">3 days before due date</p></div><input type="checkbox" checked={notifications} onChange={e=>setNotifications(e.target.checked)} className="h-4 w-4" /></div>
          <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Yield Updates</p><p className="text-xs text-muted-foreground">Weekly yield earned</p></div><input type="checkbox" defaultChecked className="h-4 w-4" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" /> Security</CardTitle><CardDescription>SEP-10 session management.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>API URL</Label><Input value={process.env.NEXT_PUBLIC_API_URL || "/api"} disabled /></div>
          <div className="space-y-2"><Label>Contract ID</Label><Input value={process.env.NEXT_PUBLIC_CONTRACT_ID || "CDUMMY"} disabled className="font-mono text-xs" /></div>
          <p className="text-xs text-muted-foreground">Frontend communicates only with Rentar REST API. No direct blockchain calls except wallet signing.</p>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><Trash className="h-4 w-4" /> Danger Zone</CardTitle></CardHeader>
        <CardContent><Button variant="destructive" size="sm">Clear Local Data</Button></CardContent>
      </Card>
    </div>
  )
}
