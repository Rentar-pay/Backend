import { NextResponse } from "next/server"
import { mockLandlords } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json([
    { dueDate: new Date(Date.now() + 3*24*60*60*1000).toISOString(), amount: 1500, landlord: mockLandlords[0] },
    { dueDate: new Date(Date.now() + 15*24*60*60*1000).toISOString(), amount: 2200, landlord: mockLandlords[1] },
  ])
}
