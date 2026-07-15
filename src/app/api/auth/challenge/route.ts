import { NextRequest, NextResponse } from "next/server"
import { StrKey } from "@stellar/stellar-sdk"
import { storeChallenge } from "@/lib/auth/challenge-store"
import { randomBytes } from "crypto"

/**
 * POST /api/auth/challenge
 *
 * Issues a SEP-10 challenge for the given Stellar public key.
 * The challenge is stored server-side with a 5-minute TTL so it can be
 * validated at verify time, preventing forged or replayed challenges.
 *
 * Body: { publicKey: string }
 * Response: { challenge: string }
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const publicKey: unknown = body?.publicKey

  if (typeof publicKey !== "string" || !publicKey.trim()) {
    return NextResponse.json({ message: "publicKey required" }, { status: 400 })
  }

  // Validate it is a well-formed Stellar public key (Ed25519)
  if (!StrKey.isValidEd25519PublicKey(publicKey)) {
    return NextResponse.json({ message: "Invalid Stellar public key" }, { status: 400 })
  }

  // Build a challenge that matches what Freighter / WalletConnect will sign:
  // a UTF-8 string the client signs with Keypair.sign() (Buffer.from(challenge)).
  const nonce = randomBytes(32).toString("hex")
  const challenge = `rentar.io SEP-10 auth | ${publicKey} | ${Date.now()} | ${nonce}`

  storeChallenge(publicKey, challenge)

  return NextResponse.json({ challenge })
}
