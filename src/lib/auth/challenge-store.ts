/**
 * Server-side SEP-10 challenge store with TTL and replay protection.
 *
 * In production this should be backed by Redis or a DB. For this Next.js
 * deployment the module-level Map acts as an in-process store that persists
 * across requests within the same server instance, which is sufficient for
 * development / single-instance deployments.
 */

export const CHALLENGE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface ChallengeEntry {
  challenge: string
  expiresAt: number
  used: boolean
}

// Module-level singleton — survives hot-reload in dev (globalThis trick)
declare global {
  // eslint-disable-next-line no-var
  var __sep10ChallengeStore: Map<string, ChallengeEntry> | undefined
}

function getStore(): Map<string, ChallengeEntry> {
  if (!globalThis.__sep10ChallengeStore) {
    globalThis.__sep10ChallengeStore = new Map()
  }
  return globalThis.__sep10ChallengeStore
}

/** Persist a newly issued challenge for a given public key. */
export function storeChallenge(publicKey: string, challenge: string): void {
  const store = getStore()
  store.set(publicKey, {
    challenge,
    expiresAt: Date.now() + CHALLENGE_TTL_MS,
    used: false,
  })
}

export type ConsumeResult =
  | { ok: true; challenge: string }
  | { ok: false; reason: "not_found" | "expired" | "already_used" }

/**
 * Look up, validate, and atomically mark a challenge as consumed.
 * A challenge may only be used once (replay protection).
 */
export function consumeChallenge(publicKey: string): ConsumeResult {
  const store = getStore()
  const entry = store.get(publicKey)

  if (!entry) return { ok: false, reason: "not_found" }
  if (Date.now() > entry.expiresAt) {
    store.delete(publicKey)
    return { ok: false, reason: "expired" }
  }
  if (entry.used) return { ok: false, reason: "already_used" }

  // Mark consumed — do NOT delete so a second attempt is caught as "already_used"
  entry.used = true
  store.set(publicKey, entry)

  return { ok: true, challenge: entry.challenge }
}

/** Expose internal state for tests only. */
export function _clearStore(): void {
  getStore().clear()
}
