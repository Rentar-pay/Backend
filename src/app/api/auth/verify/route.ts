import { NextRequest, NextResponse } from "next/server"
import { Keypair, StrKey } from "@stellar/stellar-sdk"
import { consumeChallenge } from "@/lib/auth/challenge-store"
import { signJwt } from "@/lib/auth/jwt"

/**
 * POST /api/auth/verify
 *
 * Verifies a SEP-10 challenge response:
 *   1. Looks up the stored challenge for the public key (TTL + replay protection)
 *   2. Validates the Ed25519 signature produced by the client's Stellar keypair
 *   3. Issues a signed HS256 JWT on success
 *
 * Body: { publicKey: string, signedChallenge: string (base64) }
 * Response 200: { token: string, user: { ... } }
 * Response 400: missing / malformed params
 * Response 401: invalid signature, expired challenge, or replay attempt
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { publicKey, signedChallenge } = (body ?? {}) as Record<string, unknown>

  if (typeof publicKey !== "string" || typeof signedChallenge !== "string") {
    return NextResponse.json({ message: "publicKey and signedChallenge are required" }, { status: 400 })
  }

  // Validate public key format before touching crypto primitives
  if (!StrKey.isValidEd25519PublicKey(publicKey)) {
    return NextResponse.json({ message: "Invalid Stellar public key" }, { status: 400 })
  }

  // --- Step 1: retrieve and consume the stored challenge ---
  const result = consumeChallenge(publicKey)
  if (!result.ok) {
    const messages: Record<typeof result.reason, string> = {
      not_found: "No pending challenge for this public key — request a new challenge first",
      expired: "Challenge has expired — request a new challenge",
      already_used: "Challenge has already been used — request a new challenge",
    }
    return NextResponse.json({ message: messages[result.reason] }, { status: 401 })
  }

  // --- Step 2: verify the Ed25519 signature ---
  let signatureBuffer: Buffer
  try {
    signatureBuffer = Buffer.from(signedChallenge, "base64")
    if (signatureBuffer.length === 0) throw new Error("empty")
  } catch {
    return NextResponse.json({ message: "signedChallenge must be a valid base64-encoded signature" }, { status: 400 })
  }

  let isValid = false
  try {
    const keypair = Keypair.fromPublicKey(publicKey)
    const challengeBuffer = Buffer.from(result.challenge)
    isValid = keypair.verify(challengeBuffer, signatureBuffer)
  } catch {
    // fromPublicKey throws on an invalid key; treat as auth failure
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
  }

  if (!isValid) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
  }

  // --- Step 3: issue a signed JWT ---
  const token = signJwt(publicKey)

  return NextResponse.json({
    token,
    user: {
      id: `user_${publicKey.slice(0, 8)}`,
      publicKey,
      displayName: `Stellar User ${publicKey.slice(0, 6)}`,
      email: `${publicKey.slice(0, 8).toLowerCase()}@rentar.demo`,
      createdAt: new Date().toISOString(),
      kycStatus: "verified",
    },
  })
}
