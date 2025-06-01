import react from "@vitejs/plugin-react";
import { URL, fileURLToPath } from "node:url";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["src/**/*"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
      outDir: "dist",
      copyDtsFiles: true,
    }),
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
    sourcemap: true,
    target: "esnext",
    minify: "esbuild",
  },
  resolve: {
    alias: {
      "@": resolve(fileURLToPath(new URL(".", import.meta.url)), "./src"),
    },
  },
});
