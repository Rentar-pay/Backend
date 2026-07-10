"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnalytics } from "@/hooks/use-savings"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

export function SavingsChart() {
  const { data, isLoading } = useAnalytics("12m")

  if (isLoading) return <Card><CardContent className="p-6"><Skeleton className="h-[300px]" /></CardContent></Card>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Growth</CardTitle>
        <p className="text-sm text-muted-foreground">Your rent savings over time</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.savingsHistory}>
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
              <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
