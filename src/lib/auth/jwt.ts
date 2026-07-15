/**
 * Minimal HS256 JWT implementation using Node's built-in `crypto` module.
 * We don't have `jose` or `jsonwebtoken` in this project, so we roll a
 * standards-compliant HS256 JWT ourselves.
 */
import { createHmac, timingSafeEqual } from "crypto"

// Secret loaded from env; must be at least 32 bytes for HS256 security.
// In production, set a long random value via JWT_SECRET env var.
function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be set in production and be >= 32 chars")
    }
    // Dev/test fallback — NOT secure, only for local development
    return "rentar-dev-secret-key-change-in-production-please"
  }
  return secret
}

function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function base64UrlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/")
  const padding = (4 - (padded.length % 4)) % 4
  return Buffer.from(padded + "=".repeat(padding), "base64")
}

export interface JwtPayload {
  sub: string    // Stellar public key
  iat: number    // issued-at (seconds)
  exp: number    // expiry (seconds)
}

const JWT_EXPIRY_SECONDS = 60 * 60 * 24 // 24 hours

export function signJwt(publicKey: string): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const now = Math.floor(Date.now() / 1000)
  const payload = base64UrlEncode(
    JSON.stringify({ sub: publicKey, iat: now, exp: now + JWT_EXPIRY_SECONDS } satisfies JwtPayload)
  )
  const signingInput = `${header}.${payload}`
  const signature = base64UrlEncode(
    createHmac("sha256", getSecret()).update(signingInput).digest()
  )
  return `${signingInput}.${signature}`
}

export type VerifyResult =
  | { ok: true; payload: JwtPayload }
  | { ok: false; reason: "malformed" | "invalid_signature" | "expired" }

export function verifyJwt(token: string): VerifyResult {
  const parts = token.split(".")
  if (parts.length !== 3) return { ok: false, reason: "malformed" }

  const [header, payload, receivedSig] = parts
  const signingInput = `${header}.${payload}`

  // Constant-time comparison to prevent timing attacks
  const expectedSig = base64UrlEncode(
    createHmac("sha256", getSecret()).update(signingInput).digest()
  )
  const a = Buffer.from(receivedSig)
  const b = Buffer.from(expectedSig)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "invalid_signature" }
  }

  let parsed: JwtPayload
  try {
    parsed = JSON.parse(base64UrlDecode(payload).toString("utf8")) as JwtPayload
  } catch {
    return { ok: false, reason: "malformed" }
  }

  if (Math.floor(Date.now() / 1000) > parsed.exp) {
    return { ok: false, reason: "expired" }
  }

  return { ok: true, payload: parsed }
}
