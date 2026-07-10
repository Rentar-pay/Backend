"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAnalytics } from "@/hooks/use-savings"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics()

  if (isLoading) return <Skeleton className="h-[400px]" />

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-sm text-muted-foreground">Spending, yield, rent punctuality.</p></div>

      <Tabs defaultValue="overview">
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="rent">Rent History</TabsTrigger><TabsTrigger value="yield">Yield</TabsTrigger></TabsList>

        <TabsContent value="overview" className="mt-6 grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Savings Trend</CardTitle><CardDescription>Monthly growth</CardDescription></CardHeader>
            <CardContent className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data?.savingsHistory}><XAxis dataKey="date" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Area dataKey="amount" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" /></AreaChart></ResponsiveContainer></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Spending Breakdown</CardTitle></CardHeader>
            <CardContent className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data?.spendingByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{data?.spendingByCategory.map((_,i)=><Cell key={i} fill={`hsl(${262 + i*30} 70% 60%)`} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rent" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Rent Payment History</CardTitle><CardDescription>On-time vs late</CardDescription></CardHeader>
            <CardContent className="h-[350px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={data?.rentPaymentHistory}><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yield" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Yield Earned Over Time</CardTitle><CardDescription>Soroban vault yield</CardDescription></CardHeader>
            <CardContent className="h-[350px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={data?.yieldEarned}><XAxis dataKey="date" fontSize={10} /><YAxis /><Tooltip /><Line type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
