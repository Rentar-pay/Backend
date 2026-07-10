"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { adminService } from "@/lib/api/services"
import { Users, PiggyBank, ArrowLeftRight, Target } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: adminService.getStats })
  const { data: users, isLoading: usersLoading } = useQuery({ queryKey: ["admin-users"], queryFn: adminService.getUsers })

  if (statsLoading) return <Skeleton className="h-32" />

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-sm text-muted-foreground">Platform overview — requires admin role.</p></div>
        <Link href="/dashboard"><Button variant="outline">Back to App</Button></Link>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.totalUsers}</div><p className="text-xs text-muted-foreground">+12% from last month</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Saved</CardTitle><PiggyBank className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(stats?.totalSaved || 0)}</div><p className="text-xs text-muted-foreground">Across all vaults</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Transactions</CardTitle><ArrowLeftRight className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.totalTransactions}</div><p className="text-xs text-muted-foreground">All time</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Goals</CardTitle><Target className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.activeGoals}</div><p className="text-xs text-muted-foreground">Currently active</p></CardContent></Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList><TabsTrigger value="users">Users</TabsTrigger><TabsTrigger value="system">System</TabsTrigger></TabsList>
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
            <CardContent>
              {usersLoading ? <Skeleton className="h-64" /> : (
                <div className="space-y-2 max-h-[500px] overflow-auto">
                  {users?.map(u => (
                    <div key={u.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div><p className="text-sm font-medium">{u.displayName}</p><p className="text-xs text-muted-foreground font-mono">{u.publicKey.slice(0,20)}... • {u.email}</p></div>
                      <Badge variant={u.kycStatus==="verified" ? "success" : u.kycStatus==="pending" ? "warning" : "secondary"}>{u.kycStatus}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="system" className="mt-6">
          <Card><CardContent className="p-6 space-y-2 text-sm"><p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p><p><strong>Network:</strong> {process.env.NEXT_PUBLIC_NETWORK}</p><p><strong>Contract ID:</strong> {process.env.NEXT_PUBLIC_CONTRACT_ID}</p><p><strong>Version:</strong> 1.0.0-beta</p><p className="text-muted-foreground mt-4">Frontend only talks to Rentar REST API. Blockchain interactions via Freighter signing.</p></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
