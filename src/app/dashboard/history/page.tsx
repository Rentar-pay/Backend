"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTransactions } from "@/hooks/use-savings"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowUpRight, ArrowDownLeft, Home, TrendingUp, ExternalLink } from "lucide-react"

const typeIcons: any = { deposit: ArrowDownLeft, withdrawal: ArrowUpRight, rent_payment: Home, yield: TrendingUp }

export default function HistoryPage() {
  const [filter, setFilter] = useState("all")
  const { data, isLoading } = useTransactions(filter === "all" ? {} : { type: filter })

  if (isLoading) return <div className="space-y-3">{[...Array(5)].map((_,i)=><Skeleton key={i} className="h-16" />)}</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-sm text-muted-foreground">All deposits, withdrawals, rent payments, and yield.</p>
      </div>

      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="deposit">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
          <TabsTrigger value="rent_payment">Rent</TabsTrigger>
          <TabsTrigger value="yield">Yield</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <Card>
            <CardHeader><CardTitle>{data?.total || 0} Transactions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {data?.transactions.map(tx => {
                const Icon = typeIcons[tx.type] || ArrowDownLeft
                return (
                  <div key={tx.id} className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition">
                    <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center text-primary"><Icon className="h-5 w-5" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">{formatDate(tx.timestamp)} • <Badge variant="outline" className="text-[10px]">{tx.type}</Badge> <Badge variant={tx.status==="completed" ? "success" : "secondary"} className="text-[10px]">{tx.status}</Badge></p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${tx.type==="withdrawal" || tx.type==="rent_payment" ? "text-destructive" : "text-emerald-600"}`}>{tx.type==="withdrawal" || tx.type==="rent_payment" ? "-" : "+"}{formatCurrency(tx.amount)}</p>
                      {tx.txHash && <a href={`https://stellar.expert/explorer/testnet/tx/${tx.txHash}`} target="_blank" className="text-xs text-primary flex items-center gap-1">{tx.txHash.slice(0,8)}... <ExternalLink className="h-3 w-3" /></a>}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
