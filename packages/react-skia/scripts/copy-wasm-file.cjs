#!/usr/bin/env node

// Postinstall script to copy canvaskit.wasm to user's public directory
const fs = require("fs");
const path = require("path");

const WASM_FILENAME = "canvaskit.wasm";

function copyWasmFile() {
  try {
    // Find the canvaskit.wasm file in the package
    const wasmPath = path.join(__dirname, "..", "dist", WASM_FILENAME);

    if (!fs.existsSync(wasmPath)) {
      console.warn(
        `⚠️  React Skia: ${WASM_FILENAME} not found in package dist.`,
      );
      return;
    }

    // Find the user's project root directory
    // npm/pnpm sets INIT_CWD to the directory where npm install was run
    let projectRoot = process.env.INIT_CWD || process.cwd();

    // If we're still in node_modules, go up to find the project root
    if (projectRoot.includes("node_modules")) {
      const nodeModulesIndex = projectRoot.indexOf("node_modules");
      projectRoot = projectRoot.substring(0, nodeModulesIndex - 1);
    }

    // Try to find the user's public directory
    const possiblePublicPaths = [
      path.join(projectRoot, "public"),
      path.join(projectRoot, "..", "public"), // For pnpm workspace
      path.join(projectRoot, "apps", "playground", "public"), // For specific monorepo structure
    ];

    let publicDir = null;
    for (const dir of possiblePublicPaths) {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        publicDir = dir;
        break;
      }
    }

    if (!publicDir) {
      // Try to create public directory in project root
      const defaultPublicDir = path.join(projectRoot, "public");
      try {
        fs.mkdirSync(defaultPublicDir, { recursive: true });
        publicDir = defaultPublicDir;
        console.log(
          `ℹ️  React Skia: Created public directory at ${defaultPublicDir}`,
        );
      } catch (error) {
        console.log(
          "ℹ️  React Skia: No public directory found and couldn't create one. You may need to manually copy canvaskit.wasm to your public folder.",
        );
        console.log(`   Source: ${wasmPath}`);
        console.log(`   Project root detected: ${projectRoot}`);
        return;
      }
    }

    // Copy the WASM file to public directory
    const targetPath = path.join(publicDir, WASM_FILENAME);

    // Check if file already exists and is the same
    if (fs.existsSync(targetPath)) {
      const sourceStats = fs.statSync(wasmPath);
      const targetStats = fs.statSync(targetPath);

      if (sourceStats.size === targetStats.size) {
        console.log(
          `✓ React Skia: ${WASM_FILENAME} already up to date in public directory.`,
        );
        return;
      }
    }

    fs.copyFileSync(wasmPath, targetPath);
    console.log(`✓ React Skia: Copied ${WASM_FILENAME} to ${publicDir}`);
  } catch (error) {
    console.warn(
      `⚠️  React Skia: Failed to copy ${WASM_FILENAME}:`,
      error.message,
    );
    console.log(
      "   You may need to manually copy the file to your public directory.",
    );
  }
}

// Only run if this is being called as a postinstall script
if (require.main === module) {
  copyWasmFile();
}

module.exports = { copyWasmFile };
