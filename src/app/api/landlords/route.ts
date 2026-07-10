import { NextRequest, NextResponse } from "next/server"
import { mockLandlords } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(mockLandlords)
}
export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({ id: `landlord_${Date.now()}`, ...body }, { status: 201 })
}
