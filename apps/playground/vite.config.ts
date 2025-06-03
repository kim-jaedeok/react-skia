import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: {
        buildMode: false,
        tsconfigPath: "tsconfig.build.json",
      },
      overlay: {
        initialIsOpen: false,
        position: "tl",
      },
      enableBuild: false,
    }),
  ],
  resolve: {
    alias: {
      "react-skia": resolve(__dirname, "../../packages/react-skia/src"),
    },
  },
});
