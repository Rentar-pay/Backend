"use client"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { SavingsChart } from "@/components/dashboard/savings-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnalytics, useSavingsGoals } from "@/hooks/use-savings"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

export default function SavingsPage() {
  const { data: analytics, isLoading } = useAnalytics()
  const { data: goals } = useSavingsGoals()

  if (isLoading) return <Skeleton className="h-[400px]" />

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Savings Overview</h1>
        <p className="text-sm text-muted-foreground">Track yield, allocation, and growth.</p>
      </div>

      <OverviewCards />

      <div className="grid lg:grid-cols-2 gap-6">
        <SavingsChart />
        <Card>
          <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics?.spendingByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {analytics?.spendingByCategory.map((_, i) => <Cell key={i} fill={`hsl(${262 + i*20} 83% 58%)`} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Yield Earned (Weekly)</CardTitle></CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics?.yieldEarned}>
              <XAxis dataKey="date" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="yield" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Goals Summary</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {goals?.map(g => (
            <div key={g.id} className="border rounded-lg p-4">
              <p className="font-medium">{g.title}</p>
              <p className="text-sm text-muted-foreground">{g.progress}% complete • {new Date(g.deadline).toLocaleDateString()}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
