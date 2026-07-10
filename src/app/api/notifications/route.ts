import { NextResponse } from "next/server"
import { mockNotifications } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(mockNotifications)
}
