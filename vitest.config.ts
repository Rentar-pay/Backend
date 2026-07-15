import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    // Default environment for component tests
    environment: "jsdom",
    globals: true,
    // Per-file environment overrides via @vitest-environment docblock
    environmentOptions: {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
