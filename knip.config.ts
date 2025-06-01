import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "src/playground/main.tsx", // Vite entry point
    "src/react-skia/index.ts", // Library entry point
    "index.html", // HTML entry point
  ],
  project: ["src/**/*.{ts,tsx}"],
  ignore: [
    "src/vite-env.d.ts", // Vite environment types
  ],
  ignoreExportsUsedInFile: {
    interface: true,
    type: true,
  },
  ignoreDependencies: [
    "@commitlint/cli", // Used by husky git hooks
  ],
  workspaces: {
    ".": {
      entry: [
        "src/playground/main.tsx",
        "src/react-skia/index.ts",
        "vite.config.ts",
        "eslint.config.js",
        "commitlint.config.js",
      ],
    },
  },
};

export default config;
