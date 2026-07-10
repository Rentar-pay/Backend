import { NextRequest, NextResponse } from "next/server"
import { mockTransactions } from "@/lib/mock-data"

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type")
  let txs = mockTransactions
  if (type && type !== "all") txs = txs.filter(t => t.type === type)
  return NextResponse.json({ transactions: txs, total: txs.length })
}
