/**
 * SEP-10 auth integration tests
 *
 * These tests exercise the full challenge → sign → verify → me flow using
 * real Ed25519 keypairs from @stellar/stellar-sdk, covering all acceptance
 * criteria from Issue #1.
 *
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from "vitest"
import { Keypair } from "@stellar/stellar-sdk"
import { storeChallenge, consumeChallenge, _clearStore, CHALLENGE_TTL_MS } from "@/lib/auth/challenge-store"
import { signJwt, verifyJwt } from "@/lib/auth/jwt"

// ---------------------------------------------------------------------------
// Helpers that mirror what the route handlers do
// ---------------------------------------------------------------------------

function issueChallenge(publicKey: string): string {
  const nonce = Math.random().toString(36).slice(2)
  const challenge = `rentar.io SEP-10 auth | ${publicKey} | ${Date.now()} | ${nonce}`
  storeChallenge(publicKey, challenge)
  return challenge
}

function verifySep10(
  publicKey: string,
  signedChallengeBase64: string
): { ok: true; token: string } | { ok: false; message: string; status: number } {
  // 1. Consume challenge (TTL + replay protection)
  const stored = consumeChallenge(publicKey)
  if (!stored.ok) {
    const messages = {
      not_found: "No pending challenge for this public key",
      expired: "Challenge has expired",
      already_used: "Challenge has already been used",
    } as const
    return { ok: false, message: messages[stored.reason], status: 401 }
  }

  // 2. Verify Ed25519 signature
  let isValid = false
  try {
    const keypair = Keypair.fromPublicKey(publicKey)
    const challengeBuffer = Buffer.from(stored.challenge)
    const sigBuffer = Buffer.from(signedChallengeBase64, "base64")
    isValid = keypair.verify(challengeBuffer, sigBuffer)
  } catch {
    return { ok: false, message: "Invalid signature", status: 401 }
  }

  if (!isValid) return { ok: false, message: "Invalid signature", status: 401 }

  // 3. Issue JWT
  return { ok: true, token: signJwt(publicKey) }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  _clearStore()
  vi.useRealTimers()
})

describe("SEP-10 full flow — valid signature", () => {
  it("authenticates successfully with a correct signature", () => {
    const keypair = Keypair.random()
    const challenge = issueChallenge(keypair.publicKey())

    // Client signs the challenge (mirrors Freighter / WalletConnect behaviour)
    const sig = keypair.sign(Buffer.from(challenge))
    const signedChallengeBase64 = sig.toString("base64")

    const result = verifySep10(keypair.publicKey(), signedChallengeBase64)
    expect(result.ok).toBe(true)
    if (result.ok) {
      // Token must be a valid JWT
      const verified = verifyJwt(result.token)
      expect(verified.ok).toBe(true)
      if (verified.ok) expect(verified.payload.sub).toBe(keypair.publicKey())
    }
  })

  it("JWT issued after successful auth can be used by /me route logic", () => {
    const keypair = Keypair.random()
    const challenge = issueChallenge(keypair.publicKey())
    const sig = keypair.sign(Buffer.from(challenge)).toString("base64")

    const authResult = verifySep10(keypair.publicKey(), sig)
    expect(authResult.ok).toBe(true)
    if (!authResult.ok) return

    const meResult = verifyJwt(authResult.token)
    expect(meResult.ok).toBe(true)
    if (meResult.ok) expect(meResult.payload.sub).toBe(keypair.publicKey())
  })
})

describe("SEP-10 — invalid signature cases", () => {
  it("rejects a signature from a different keypair", () => {
    const legitKeypair = Keypair.random()
    const attackerKeypair = Keypair.random()

    const challenge = issueChallenge(legitKeypair.publicKey())

    // Attacker signs with their own key but submits the legit public key
    const sig = attackerKeypair.sign(Buffer.from(challenge)).toString("base64")

    const result = verifySep10(legitKeypair.publicKey(), sig)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(401)
      expect(result.message).toBe("Invalid signature")
    }
  })

  it("rejects a completely bogus base64 signature", () => {
    const keypair = Keypair.random()
    issueChallenge(keypair.publicKey())

    const result = verifySep10(keypair.publicKey(), "bm90YXNpZ25hdHVyZQ==") // "notasignature"
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.status).toBe(401)
  })

  it("rejects when no challenge has been issued for the public key", () => {
    const keypair = Keypair.random()
    const fakeChallenge = "rentar.io SEP-10 auth | forged"
    const sig = keypair.sign(Buffer.from(fakeChallenge)).toString("base64")

    const result = verifySep10(keypair.publicKey(), sig)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(401)
      expect(result.message).toContain("No pending challenge")
    }
  })
})

describe("SEP-10 — replay protection", () => {
  it("rejects a second verify attempt with the same challenge", () => {
    const keypair = Keypair.random()
    const challenge = issueChallenge(keypair.publicKey())
    const sig = keypair.sign(Buffer.from(challenge)).toString("base64")

    // First attempt — should succeed
    const first = verifySep10(keypair.publicKey(), sig)
    expect(first.ok).toBe(true)

    // Re-issue challenge for second attempt (store cleared automatically by consume)
    // But the attacker tries WITHOUT a new challenge — store marks it used
    const second = verifySep10(keypair.publicKey(), sig)
    expect(second.ok).toBe(false)
    if (!second.ok) {
      expect(second.status).toBe(401)
      expect(second.message).toContain("already been used")
    }
  })
})

describe("SEP-10 — TTL expiry", () => {
  it("rejects a challenge that has expired", () => {
    vi.useFakeTimers()
    const keypair = Keypair.random()
    const challenge = issueChallenge(keypair.publicKey())
    const sig = keypair.sign(Buffer.from(challenge)).toString("base64")

    // Expire the challenge
    vi.advanceTimersByTime(CHALLENGE_TTL_MS + 100)

    const result = verifySep10(keypair.publicKey(), sig)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(401)
      expect(result.message).toContain("expired")
    }
  })
})

describe("/me — JWT validation", () => {
  it("accepts a freshly issued valid JWT", () => {
    const keypair = Keypair.random()
    const token = signJwt(keypair.publicKey())
    const result = verifyJwt(token)
    expect(result.ok).toBe(true)
  })

  it("rejects a token with a tampered subject", () => {
    const keypair = Keypair.random()
    const otherKeypair = Keypair.random()

    const token = signJwt(keypair.publicKey())
    const [header, payload, sig] = token.split(".")

    // Replace the sub claim with a different public key
    const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString())
    decodedPayload.sub = otherKeypair.publicKey()
    const tamperedPayload = Buffer.from(JSON.stringify(decodedPayload)).toString("base64url")

    const result = verifyJwt(`${header}.${tamperedPayload}.${sig}`)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe("invalid_signature")
  })

  it("rejects an expired JWT", () => {
    vi.useFakeTimers()
    const keypair = Keypair.random()
    const token = signJwt(keypair.publicKey())

    vi.advanceTimersByTime(25 * 60 * 60 * 1000) // 25 hours

    const result = verifyJwt(token)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe("expired")
  })
})
