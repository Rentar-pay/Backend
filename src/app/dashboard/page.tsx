"use client"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { SavingsChart } from "@/components/dashboard/savings-chart"
import { GoalsList } from "@/components/dashboard/goals-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUpcomingRent, useNotifications } from "@/hooks/use-savings"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Clock, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { data: upcoming } = useUpcomingRent()
  const { data: notifications } = useNotifications()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back. Your rent savings overview.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/deposit"><Button>Deposit</Button></Link>
          <Link href="/dashboard/rent"><Button variant="outline">Pay Rent</Button></Link>
        </div>
      </div>

      <OverviewCards />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SavingsChart />
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Active Goals</h2>
              <Link href="/dashboard/goals"><Button variant="ghost" size="sm">View all</Button></Link>
            </div>
            <GoalsList />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Upcoming Rent</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {upcoming?.map((item, i) => (
                <div key={i} className="flex justify-between items-center rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{item.landlord.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.amount)}</p>
                    <Badge variant={i===0 ? "warning" : "secondary"} className="text-[10px]">{i===0 ? "Due soon" : "Upcoming"}</Badge>
                  </div>
                </div>
              )) || <p className="text-sm text-muted-foreground">No upcoming rent</p>}
              <Link href="/dashboard/rent"><Button className="w-full" size="sm">Pay Now</Button></Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {notifications?.slice(0,3).map((n) => (
                <div key={n.id} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
              ))}
              <Link href="/dashboard/notifications"><Button variant="ghost" size="sm" className="w-full">View all</Button></Link>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-semibold">Need Emergency Buffer?</h3>
              <p className="text-sm opacity-80 mt-1">Create an emergency fund goal to cover 2 months rent instantly.</p>
              <Link href="/dashboard/goals"><Button variant="secondary" size="sm" className="mt-4">Create Buffer Goal</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
