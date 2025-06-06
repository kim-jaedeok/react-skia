import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { URL, fileURLToPath } from "node:url";
import { join, resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    dts({
      include: ["src/**/*"],
      exclude: [
        "src/**/__tests__/**/*",
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
      ],
      outDir: "dist",
      copyDtsFiles: true,
    }),
    {
      name: "copy-canvaskit-wasm",
      generateBundle() {
        try {
          // Get the path to canvaskit-wasm module
          const currentDir = fileURLToPath(new URL(".", import.meta.url));
          const wasmPath = join(
            currentDir,
            "node_modules",
            "canvaskit-wasm",
            "bin",
            "canvaskit.wasm",
          );

          // Copy CanvasKit WASM files to dist
          this.emitFile({
            type: "asset",
            fileName: "canvaskit.wasm",
            source: readFileSync(wasmPath),
          });
        } catch (error) {
          console.error("Failed to copy canvaskit.wasm:", error);
        }
      },
    },
    {
      name: "copy-package-json",
      generateBundle() {
        try {
          const currentDir = fileURLToPath(new URL(".", import.meta.url));
          const packageJsonPath = join(currentDir, "package.json");

          // Copy package.json to dist
          this.emitFile({
            type: "asset",
            fileName: "package.json",
            source: readFileSync(packageJsonPath, "utf-8"),
          });
        } catch (error) {
          console.error("Failed to copy package.json:", error);
        }
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(
        fileURLToPath(new URL(".", import.meta.url)),
        "src/index.ts",
      ),
      name: "ReactSkia",
      formats: ["es", "cjs"],
      fileName: format => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: mode === "development",
    target: "esnext",
    minify: "esbuild",
  },
  resolve: {
    alias: {
      "@": resolve(fileURLToPath(new URL(".", import.meta.url)), "./src"),
    },
  },
}));
