/**
 * JWT utility — unit tests for signJwt / verifyJwt
 *
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { signJwt, verifyJwt } from "@/lib/auth/jwt"

const TEST_PUBLIC_KEY = "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37"

beforeEach(() => {
  vi.useRealTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe("signJwt / verifyJwt", () => {
  it("signs and verifies a valid token", () => {
    const token = signJwt(TEST_PUBLIC_KEY)
    expect(typeof token).toBe("string")
    expect(token.split(".")).toHaveLength(3)

    const result = verifyJwt(token)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.payload.sub).toBe(TEST_PUBLIC_KEY)
      expect(typeof result.payload.iat).toBe("number")
      expect(typeof result.payload.exp).toBe("number")
      expect(result.payload.exp).toBeGreaterThan(result.payload.iat)
    }
  })

  it("rejects a token with a tampered payload", () => {
    const token = signJwt(TEST_PUBLIC_KEY)
    const parts = token.split(".")

    // Tamper the payload (flip one char)
    const tampered = parts[1].slice(0, -2) + "xx"
    const tamperedToken = `${parts[0]}.${tampered}.${parts[2]}`

    const result = verifyJwt(tamperedToken)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe("invalid_signature")
  })

  it("rejects a token with a tampered signature", () => {
    const token = signJwt(TEST_PUBLIC_KEY)
    const parts = token.split(".")
    const badSig = parts[2].slice(0, -2) + "zz"
    const tamperedToken = `${parts[0]}.${parts[1]}.${badSig}`

    const result = verifyJwt(tamperedToken)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe("invalid_signature")
  })

  it("rejects a malformed token (not 3 parts)", () => {
    const result = verifyJwt("not.a.valid.jwt.token")
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe("malformed")
  })

  it("rejects an expired token", () => {
    vi.useFakeTimers()
    const token = signJwt(TEST_PUBLIC_KEY)

    // Advance past 24-hour expiry
    vi.advanceTimersByTime(25 * 60 * 60 * 1000)

    const result = verifyJwt(token)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe("expired")
  })

  it("rejects an empty string", () => {
    const result = verifyJwt("")
    expect(result.ok).toBe(false)
  })
})
