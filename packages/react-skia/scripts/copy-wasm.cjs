#!/usr/bin/env node

const { copyFileSync, existsSync, mkdirSync } = require("fs");
const { join, dirname } = require("path");

/**
 * Copy canvaskit.wasm to user's public directory
 */
function copyWasm() {
  const cwd = process.cwd();

  // Possible source paths for canvaskit.wasm
  const sourcePaths = [
    // From react-skia package (if installed)
    join(cwd, "node_modules", "react-skia", "dist", "canvaskit.wasm"),
    // From canvaskit-wasm package (fallback)
    join(cwd, "node_modules", "canvaskit-wasm", "bin", "canvaskit.wasm"),
    // Workspace development (for this repo)
    join(__dirname, "..", "dist", "canvaskit.wasm"),
  ];

  // Find the source file
  let sourcePath = null;
  for (const path of sourcePaths) {
    if (existsSync(path)) {
      sourcePath = path;
      break;
    }
  }

  if (!sourcePath) {
    console.error(
      "❌ Could not find canvaskit.wasm file in any of these locations:",
    );
    sourcePaths.forEach(path => console.error(`   ${path}`));
    console.error(
      "\nPlease make sure react-skia or canvaskit-wasm is installed.",
    );
    process.exit(1);
  }

  // Target path (user's public directory)
  const targetPath = join(cwd, "public", "canvaskit.wasm");

  try {
    // Ensure public directory exists
    const publicDir = dirname(targetPath);
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true });
    }

    // Copy the file
    copyFileSync(sourcePath, targetPath);
    console.log(`✅ Successfully copied canvaskit.wasm to ${targetPath}`);
    console.log("   Your React Skia app should now work properly!");
  } catch (error) {
    console.error("❌ Failed to copy canvaskit.wasm:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  copyWasm();
}

module.exports = { copyWasm };
