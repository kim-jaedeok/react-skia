import type { CanvasKit } from "canvaskit-wasm";
import CanvasKitInit from "canvaskit-wasm";
import { atom } from "jotai";

export interface CanvasKitConfig {
  /**
   * Optional function to customize WASM file paths
   */
  canvasKitPath?: (file: string) => string;
}

// Configuration atom for WASM paths
export const canvasKitConfigAtom = atom<CanvasKitConfig>({});

// Create atom for CanvasKit instance
export const canvasKitAtom = atom<CanvasKit | null>(null);

// Create atom for tracking loading state
const canvasKitLoadingAtom = atom<Promise<CanvasKit> | null>(null);

// Create derived atom for loading CanvasKit
export const loadCanvasKitAtom = atom(
  get => get(canvasKitAtom),
  async (get, set, options?: { force?: boolean }) => {
    const canvasKit = get(canvasKitAtom);
    const loadingPromise = get(canvasKitLoadingAtom);

    // If CanvasKit is already loaded, return early unless forced
    if (canvasKit && !options?.force) {
      return canvasKit;
    }

    // If already loading and not forced, return the existing promise
    if (loadingPromise && !options?.force) {
      return await loadingPromise;
    }

    // Start loading process
    const newLoadingPromise = (async () => {
      try {
        const config = get(canvasKitConfigAtom);

        // Define possible WASM file locations
        const tryLoadWithPath = async (
          wasmPath: string,
        ): Promise<CanvasKit> => {
          return await CanvasKitInit({
            locateFile: (file: string) => {
              // Use custom path if provided
              if (config.canvasKitPath) {
                return config.canvasKitPath(file);
              }
              return wasmPath;
            },
          });
        };

        // Root public directory
        const possiblePath = "/canvaskit.wasm";
        const canvasKitInstance = await tryLoadWithPath(possiblePath);

        set(canvasKitAtom, canvasKitInstance);

        return canvasKitInstance;
      } catch (error) {
        console.error("Failed to initialize CanvasKit:", error);
        throw error;
      } finally {
        // Ensure loading promise is cleared after completion
        set(canvasKitLoadingAtom, null);
      }
    })();

    // Store the loading promise to prevent duplicate requests
    set(canvasKitLoadingAtom, newLoadingPromise);

    return await newLoadingPromise;
  },
);
