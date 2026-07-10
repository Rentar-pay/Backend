// @ts-nocheck
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30 * 1000,
  webServer: {
    command: "npm run build && npm start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:3000",
  },
});
