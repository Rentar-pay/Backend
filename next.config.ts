import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK || "testnet",
    NEXT_PUBLIC_CONTRACT_ID: process.env.NEXT_PUBLIC_CONTRACT_ID || "CDUMMY",
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
