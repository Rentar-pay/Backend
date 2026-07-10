"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PiggyBank, Target, TrendingUp, Calendar } from "lucide-react"
import { useSavingsOverview } from "@/hooks/use-savings"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"

export function OverviewCards() {
  const { data, isLoading } = useSavingsOverview()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_,i) => <Card key={i}><CardContent className="p-6"><Skeleton className="h-20" /></CardContent></Card>)}
      </div>
    )
  }

  const cards = [
    { title: "Total Saved", value: formatCurrency(data?.totalSaved || 0), icon: PiggyBank, change: `+${data?.completionRate || 0}% to goal`, color: "text-emerald-600" },
    { title: "Active Goals", value: data?.activeGoals || 0, icon: Target, change: `${data?.totalTarget ? formatCurrency(data.totalTarget - (data.totalSaved||0)) : "$0"} to target`, color: "text-violet-600" },
    { title: "Monthly Yield", value: formatCurrency(data?.monthlyYield || 0), icon: TrendingUp, change: "4.2% APY", color: "text-blue-600" },
    { title: "Next Rent Due", value: data?.nextRentAmount ? formatCurrency(data.nextRentAmount) : "$0", icon: Calendar, change: data?.nextRentDue ? new Date(data.nextRentDue).toLocaleDateString() : "Soon", color: "text-amber-600" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
            <c.icon className={`h-4 w-4 ${c.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{c.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{c.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
