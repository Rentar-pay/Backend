import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { publicKey, signedChallenge } = await req.json()
  if (!publicKey || !signedChallenge) return NextResponse.json({ message: "Missing params" }, { status: 400 })
  const token = Buffer.from(`${publicKey}:${signedChallenge}:${Date.now()}`).toString("base64")
  return NextResponse.json({
    token,
    user: {
      id: `user_${publicKey.slice(0,8)}`,
      publicKey,
      displayName: `Stellar User ${publicKey.slice(0,6)}`,
      email: `${publicKey.slice(0,8).toLowerCase()}@rentar.demo`,
      createdAt: new Date().toISOString(),
      kycStatus: "verified"
    }
  })
}
