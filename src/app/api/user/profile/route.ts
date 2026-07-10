import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    id: "user_demo",
    publicKey: "GDEMO...",
    displayName: "Demo User",
    email: "demo@rentar.io",
    createdAt: new Date().toISOString(),
    kycStatus: "verified"
  })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({ id: "user_demo", ...body })
}
