import { NextResponse } from "next/server"
import { mockOverview } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(mockOverview)
}
