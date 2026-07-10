import { NextRequest, NextResponse } from "next/server"
import { mockSavingsGoals } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(mockSavingsGoals)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const newGoal = {
    id: `goal_${Date.now()}`,
    userId: "user_demo",
    title: body.title || "New Goal",
    targetAmount: body.targetAmount || 1000,
    currentAmount: 0,
    monthlyRent: body.monthlyRent || 0,
    deadline: body.deadline || new Date(Date.now() + 90*24*60*60*1000).toISOString(),
    status: "active" as const,
    createdAt: new Date().toISOString(),
    progress: 0,
    landlordId: body.landlordId,
  }
  return NextResponse.json(newGoal, { status: 201 })
}
