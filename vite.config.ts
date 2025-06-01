import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: {
        buildMode: false,
      },
      overlay: {
        initialIsOpen: false,
        position: "tl",
      },
      enableBuild: false,
    }),
  ],
});
