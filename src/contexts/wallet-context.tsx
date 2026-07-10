"use client"
import { createContext, useContext, useState, ReactNode } from "react"
import { connectFreighter, signWithFreighter, isFreighterInstalled } from "@/lib/wallet/freighter"
import { walletConnectService } from "@/lib/wallet/walletconnect"
import { useAuth } from "./auth-context"
import { toast } from "sonner"

type WalletType = "freighter" | "walletconnect" | null

interface WalletContextType {
  publicKey: string | null
  walletType: WalletType
  isConnecting: boolean
  isFreighterAvailable: boolean
  connectFreighter: () => Promise<void>
  connectWalletConnect: () => Promise<void>
  signMessage: (message: string) => Promise<string>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<WalletType>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { login, getChallengeForKey, logout } = useAuth()

  const handleSep10Login = async (pk: string, signer: (msg: string) => Promise<string>) => {
    const challenge = await getChallengeForKey(pk)
    const signed = await signer(challenge)
    await login(pk, signed)
  }

  const connectFreighterWallet = async () => {
    setIsConnecting(true)
    try {
      const pk = await connectFreighter()
      setPublicKey(pk)
      setWalletType("freighter")
      await handleSep10Login(pk, signWithFreighter)
      toast.success("Connected with Freighter")
    } catch (e: any) {
      toast.error(e.message || "Failed to connect Freighter")
      throw e
    } finally {
      setIsConnecting(false)
    }
  }

  const connectWC = async () => {
    setIsConnecting(true)
    try {
      const session = await walletConnectService.connect()
      setPublicKey(session.publicKey)
      setWalletType("walletconnect")
      await handleSep10Login(session.publicKey, walletConnectService.signMessage)
      toast.success("Connected with WalletConnect")
    } catch (e: any) {
      toast.error(e.message || "Failed to connect via WalletConnect")
      throw e
    } finally {
      setIsConnecting(false)
    }
  }

  const signMessage = async (message: string) => {
    if (walletType === "freighter") return signWithFreighter(message)
    if (walletType === "walletconnect") return walletConnectService.signMessage(message)
    throw new Error("No wallet connected")
  }

  const disconnect = () => {
    if (walletType === "walletconnect") walletConnectService.disconnect()
    setPublicKey(null)
    setWalletType(null)
    logout()
    toast.success("Wallet disconnected")
  }

  return (
    <WalletContext.Provider value={{
      publicKey,
      walletType,
      isConnecting,
      isFreighterAvailable: isFreighterInstalled(),
      connectFreighter: connectFreighterWallet,
      connectWalletConnect: connectWC,
      signMessage,
      disconnect
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error("useWallet must be used within WalletProvider")
  return ctx
}
