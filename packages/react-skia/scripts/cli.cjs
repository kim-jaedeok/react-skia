#!/usr/bin/env node

// CLI tool to setup React Skia in user's project
const { copyWasmFile } = require("./copy-wasm-file.cjs");

function showHelp() {
  console.log(`
React Skia Setup Tool

Usage:
  npx react-skia setup    Copy canvaskit.wasm to public directory
  npx react-skia help     Show this help message

The setup command will:
- Find or create your project's public directory
- Copy canvaskit.wasm from react-skia package
- Enable automatic WASM loading without additional configuration
`);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "setup":
      console.log("🚀 Setting up React Skia...");
      copyWasmFile();
      console.log(
        "✅ Setup complete! You can now use React Skia without additional configuration.",
      );
      break;

    case "help":
    case "--help":
    case "-h":
    default:
      showHelp();
      break;
  }
}

if (require.main === module) {
  main();
}
