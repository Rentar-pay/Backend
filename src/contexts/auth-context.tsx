"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { authService } from "@/lib/api/services"
import type { UserProfile } from "@/lib/api/client"
import { buildSep10Challenge } from "@/lib/wallet/stellar"

interface AuthContextType {
  user: UserProfile | null
  token: string | null
  publicKey: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (publicKey: string, signedMessage: string) => Promise<void>
  logout: () => void
  getChallengeForKey: (publicKey: string) => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("rentar_token")
    const storedKey = localStorage.getItem("rentar_publicKey")
    const storedUser = localStorage.getItem("rentar_user")

    if (storedToken && storedKey) {
      setToken(storedToken)
      setPublicKey(storedKey)
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)) } catch {}
      }
      // Verify token is still valid
      authService.me().then(setUser).catch(() => {
        logout()
      }).finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const getChallengeForKey = async (pk: string) => {
    try {
      const res = await authService.getChallenge(pk)
      return res.challenge
    } catch {
      // fallback to local challenge for demo when backend unavailable
      return buildSep10Challenge(pk)
    }
  }

  const login = async (pk: string, signedMessage: string) => {
    try {
      const res = await authService.verify(pk, signedMessage)
      setToken(res.token)
      setUser(res.user)
      setPublicKey(pk)
      localStorage.setItem("rentar_token", res.token)
      localStorage.setItem("rentar_publicKey", pk)
      localStorage.setItem("rentar_user", JSON.stringify(res.user))
    } catch {
      // Demo fallback: create mock session
      const mockToken = btoa(`${pk}:${signedMessage}:${Date.now()}`)
      const mockUser: UserProfile = {
        id: `user_${pk.slice(0,8)}`,
        publicKey: pk,
        displayName: `User ${pk.slice(0,6)}`,
        email: `${pk.slice(0,8).toLowerCase()}@rentar.demo`,
        createdAt: new Date().toISOString(),
        kycStatus: "verified"
      }
      setToken(mockToken)
      setUser(mockUser)
      setPublicKey(pk)
      localStorage.setItem("rentar_token", mockToken)
      localStorage.setItem("rentar_publicKey", pk)
      localStorage.setItem("rentar_user", JSON.stringify(mockUser))
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setPublicKey(null)
    localStorage.removeItem("rentar_token")
    localStorage.removeItem("rentar_publicKey")
    localStorage.removeItem("rentar_user")
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      publicKey,
      isAuthenticated: !!token && !!publicKey,
      isLoading,
      login,
      logout,
      getChallengeForKey
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
