import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "Rentar — Rent Savings on Stellar",
  description: "Never miss rent again. Save smarter on Stellar with auto-savings, yield, and direct landlord payments.",
  keywords: ["rent", "stellar", "soroban", "savings", "defi", "freighter"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
