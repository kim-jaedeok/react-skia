/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["{src,scripts}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules/", "dist/", "scripts/"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/__tests__/", "dist/", "scripts/"],
    },
    reporters: process.env.CI ? ["verbose", "json"] : ["default"],
    outputFile: {
      json: "./test-results.json",
    },
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
