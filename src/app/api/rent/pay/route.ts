import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { landlordId, amount, goalId } = await req.json()
  return NextResponse.json({
    id: `tx_rent_${Date.now()}`,
    type: "rent_payment",
    amount,
    status: "completed",
    timestamp: new Date().toISOString(),
    goalId,
    description: `Rent payment $${amount} to ${landlordId}`,
    txHash: `rent_hash_${Math.random().toString(36).slice(2)}`
  })
}
