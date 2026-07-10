"use client"

export interface FreighterApi {
  isConnected: () => Promise<{ isConnected: boolean }>
  getPublicKey: () => Promise<string>
  signTransaction: (xdr: string, opts?: { networkPassphrase?: string }) => Promise<string>
  signAuthEntry: (authEntry: string, opts?: { networkPassphrase?: string }) => Promise<string>
  signMessage: (message: string, opts?: { networkPassphrase?: string }) => Promise<string>
}

declare global {
  interface Window {
    freighterApi?: FreighterApi
  }
}

export const isFreighterInstalled = () => typeof window !== "undefined" && !!window.freighterApi

export const getFreighterPublicKey = async (): Promise<string> => {
  if (!window.freighterApi) throw new Error("Freighter not installed")
  const { isConnected } = await window.freighterApi.isConnected()
  if (!isConnected) throw new Error("Freighter not connected")
  return await window.freighterApi.getPublicKey()
}

export const signWithFreighter = async (message: string): Promise<string> => {
  if (!window.freighterApi) throw new Error("Freighter not installed")
  const networkPassphrase = process.env.NEXT_PUBLIC_NETWORK === "mainnet"
    ? "Public Global Stellar Network ; September 2015"
    : "Test SDF Network ; September 2015"
  return await window.freighterApi.signMessage(message, { networkPassphrase })
}

export const connectFreighter = async (): Promise<string> => {
  if (!isFreighterInstalled()) {
    window.open("https://www.freighter.app/", "_blank")
    throw new Error("Please install Freighter wallet")
  }
  try {
    return await getFreighterPublicKey()
  } catch {
    throw new Error("Please unlock Freighter and try again")
  }
}
