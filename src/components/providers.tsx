"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { useState } from "react"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { WalletProvider } from "@/contexts/wallet-context"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <WalletProvider>
            {children}
            <Toaster richColors position="top-right" />
          </WalletProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
