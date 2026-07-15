/**
 * Challenge Store — unit/integration tests
 *
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  storeChallenge,
  consumeChallenge,
  _clearStore,
  CHALLENGE_TTL_MS,
} from "@/lib/auth/challenge-store"

const TEST_KEY = "GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37"
const TEST_CHALLENGE = "rentar.io SEP-10 auth | nonce-abc123"

beforeEach(() => {
  _clearStore()
  vi.useRealTimers()
})

describe("storeChallenge / consumeChallenge", () => {
  it("returns the stored challenge when valid", () => {
    storeChallenge(TEST_KEY, TEST_CHALLENGE)
    const result = consumeChallenge(TEST_KEY)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.challenge).toBe(TEST_CHALLENGE)
  })

  it("returns not_found when no challenge has been stored", () => {
    const result = consumeChallenge(TEST_KEY)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe("not_found")
  })

  it("enforces replay protection — second consume returns already_used", () => {
    storeChallenge(TEST_KEY, TEST_CHALLENGE)
    const first = consumeChallenge(TEST_KEY)
    expect(first.ok).toBe(true)

    const second = consumeChallenge(TEST_KEY)
    expect(second.ok).toBe(false)
    if (!second.ok) expect(second.reason).toBe("already_used")
  })

  it("returns expired when TTL has elapsed", () => {
    vi.useFakeTimers()
    storeChallenge(TEST_KEY, TEST_CHALLENGE)

    // Advance clock past the TTL
    vi.advanceTimersByTime(CHALLENGE_TTL_MS + 1)

    const result = consumeChallenge(TEST_KEY)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toBe("expired")
  })

  it("accepts challenge issued just before expiry", () => {
    vi.useFakeTimers()
    storeChallenge(TEST_KEY, TEST_CHALLENGE)

    // Advance to 1ms before expiry — should still be valid
    vi.advanceTimersByTime(CHALLENGE_TTL_MS - 1)

    const result = consumeChallenge(TEST_KEY)
    expect(result.ok).toBe(true)
  })
})
