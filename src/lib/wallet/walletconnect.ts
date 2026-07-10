"use client"

// Simplified WalletConnect mock for demo - in production you'd use @walletconnect/sign-client
export interface WCConnection {
  topic: string
  publicKey: string
}

let wcSession: WCConnection | null = null

export const walletConnectService = {
  async connect(): Promise<WCConnection> {
    // Simulate WC modal flow
    return new Promise((resolve) => {
      const mockKey = `G${Math.random().toString(36).substring(2, 15).toUpperCase()}${Math.random().toString(36).substring(2, 30).toUpperCase()}`
      const session = { topic: `wc-${Date.now()}`, publicKey: mockKey.padEnd(56, 'X').slice(0,56) }
      wcSession = session
      setTimeout(() => resolve(session), 800)
    })
  },
  
  async disconnect() {
    wcSession = null
  },

  getSession() {
    return wcSession
  },

  async signMessage(message: string): Promise<string> {
    if (!wcSession) throw new Error("No WalletConnect session")
    // Mock signature - in production this would go through WC sign client
    return `signed_${btoa(message).slice(0,20)}_${Date.now()}`
  }
}
