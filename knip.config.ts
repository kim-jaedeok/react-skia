import type { KnipConfig } from "knip";

const config: KnipConfig = {
  workspaces: {
    ".": {
      entry: ["turbo.json", "eslint.config.js", "commitlint.config.js"],
    },
    "apps/playground": {
      entry: ["src/main.tsx", "index.html", "vite.config.ts"],
      project: ["src/**/*.{ts,tsx}"],
      ignore: ["src/vite-env.d.ts"],
    },
    "packages/react-skia": {
      entry: ["src/index.ts"],
      project: ["src/**/*.{ts,tsx}"],
    },
  },
};

export default config;
