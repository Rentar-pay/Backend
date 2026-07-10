import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { publicKey } = await req.json()
  if (!publicKey) return NextResponse.json({ message: "publicKey required" }, { status: 400 })
  const challenge = `rentar.io - SEP-10 challenge for ${publicKey} at ${Date.now()} - Nonce: ${Math.random().toString(36).slice(2)}`
  return NextResponse.json({ challenge, token: `challenge_token_${Date.now()}` })
}
