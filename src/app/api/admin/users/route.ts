import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(Array.from({ length: 20 }, (_, i) => ({
    id: `user_${i}`,
    publicKey: `G${Math.random().toString(36).substring(2).toUpperCase()}...`,
    displayName: `User ${i+1}`,
    email: `user${i+1}@rentar.demo`,
    createdAt: new Date(Date.now() - i*24*60*60*1000).toISOString(),
    kycStatus: i % 3 === 0 ? "verified" : i % 3 === 1 ? "pending" : "unverified"
  })))
}
