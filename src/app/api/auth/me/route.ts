import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/auth/jwt"

/**
 * GET /api/auth/me
 *
 * Returns the authenticated user derived from the Bearer JWT.
 * The JWT signature is cryptographically validated; expired or tampered
 * tokens are rejected with 401.
 *
 * Header: Authorization: Bearer <token>
 * Response 200: { id, publicKey, displayName, email, createdAt, kycStatus }
 * Response 401: missing / invalid / expired token
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const token = auth.slice(7) // strip "Bearer "
  const result = verifyJwt(token)

  if (!result.ok) {
    const messages: Record<typeof result.reason, string> = {
      malformed: "Malformed token",
      invalid_signature: "Invalid token",
      expired: "Token has expired",
    }
    return NextResponse.json({ message: messages[result.reason] }, { status: 401 })
  }

  const { sub: publicKey } = result.payload

  return NextResponse.json({
    id: `user_${publicKey.slice(0, 8)}`,
    publicKey,
    displayName: `Stellar User ${publicKey.slice(0, 6)}`,
    email: `${publicKey.slice(0, 8).toLowerCase()}@rentar.demo`,
    createdAt: new Date().toISOString(),
    kycStatus: "verified",
  })
}
