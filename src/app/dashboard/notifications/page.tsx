"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks/use-savings"
import { notificationService } from "@/lib/api/services"
import { toast } from "sonner"
import { Bell, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { formatDate } from "@/lib/utils"

const icons: any = { success: CheckCircle, warning: AlertTriangle, info: Info, error: AlertTriangle }
const colors: any = { success: "text-emerald-500", warning: "text-amber-500", info: "text-blue-500", error: "text-red-500" }

export default function NotificationsPage() {
  const { data: notifs, refetch } = useNotifications()

  const markAll = async () => {
    try { await notificationService.markAllRead(); toast.success("All marked read"); refetch() } catch(e:any){ toast.error(e.message) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold flex items-center gap-2"><Bell className="h-6 w-6" /> Notifications</h1><p className="text-sm text-muted-foreground">Rent reminders, goal milestones, yield updates.</p></div>
        <Button variant="outline" size="sm" onClick={markAll}>Mark all read</Button>
      </div>

      <div className="space-y-3">
        {notifs?.map(n => {
          const Icon = icons[n.type] || Info
          return (
            <Card key={n.id} className={n.read ? "opacity-70" : "border-primary/30"}>
              <CardContent className="p-4 flex gap-3">
                <div className={`h-8 w-8 rounded-full bg-muted grid place-items-center ${colors[n.type]}`}><Icon className="h-4 w-4" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><p className="font-medium text-sm">{n.title}</p>{!n.read && <Badge variant="default" className="text-[10px]">New</Badge>}</div>
                  <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{formatDate(n.createdAt)}</p>
                </div>
                {!n.read && <Button variant="ghost" size="sm" onClick={async()=>{ await notificationService.markRead(n.id); refetch() }}>Mark read</Button>}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
