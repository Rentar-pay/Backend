import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  // decode mock
  return NextResponse.json({
    id: "user_demo",
    publicKey: "GDEMO...",
    displayName: "Demo User",
    email: "demo@rentar.io",
    createdAt: new Date().toISOString(),
    kycStatus: "verified"
  })
}
