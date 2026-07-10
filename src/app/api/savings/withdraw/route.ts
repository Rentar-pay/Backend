import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { goalId, amount } = await req.json()
  return NextResponse.json({
    id: `tx_${Date.now()}`,
    type: "withdrawal",
    amount,
    status: "completed",
    timestamp: new Date().toISOString(),
    goalId,
    description: `Withdrawal of $${amount}`,
    txHash: `hash_${Math.random().toString(36).slice(2)}`
  })
}
