import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    totalUsers: 1248,
    totalSaved: 2_450_000,
    totalTransactions: 8943,
    activeGoals: 892
  })
}
