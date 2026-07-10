import * as StellarSdk from "@stellar/stellar-sdk"

export const getNetworkPassphrase = () => {
  const network = process.env.NEXT_PUBLIC_NETWORK || "testnet"
  return network === "mainnet"
    ? StellarSdk.Networks.PUBLIC
    : StellarSdk.Networks.TESTNET
}

export const getHorizonUrl = () => {
  const network = process.env.NEXT_PUBLIC_NETWORK || "testnet"
  return network === "mainnet"
    ? "https://horizon.stellar.org"
    : "https://horizon-testnet.stellar.org"
}

export const truncateStellarAddress = (addr: string) => {
  if (!addr) return ""
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

// SEP-10 Web Auth simulation (client side signing handled via Freighter)
export const buildSep10Challenge = (publicKey: string): string => {
  // In real implementation, this would fetch from server
  // For demo, we create a challenge payload
  return `rentar.io auth challenge for ${publicKey} at ${Date.now()} - Please sign this to authenticate`
}

export const isValidPublicKey = (key: string) => {
  try {
    return StellarSdk.StrKey.isValidEd25519PublicKey(key)
  } catch {
    return false
  }
}
