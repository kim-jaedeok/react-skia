import type { CanvasKit } from "canvaskit-wasm";
import { atom } from "jotai";

// Create atom for CanvasKit instance
export const canvasKitAtom = atom<CanvasKit | null>(null);

// Create derived atom for loading CanvasKit
export const loadCanvasKitAtom = atom(
  get => get(canvasKitAtom),
  async (get, set) => {
    const currentCanvasKit = get(canvasKitAtom);

    // If already loaded, return the existing instance
    if (currentCanvasKit) {
      return currentCanvasKit;
    }

    try {
      // Load CanvasKit from CDN
      const CanvasKitInit = (await import("canvaskit-wasm")).default;

      const canvasKitInstance = await CanvasKitInit({
        locateFile: (file: string) =>
          `https://unpkg.com/canvaskit-wasm@0.40.0/bin/${file}`,
      });

      set(canvasKitAtom, canvasKitInstance);
      return canvasKitInstance;
    } catch (error) {
      console.error("Failed to initialize CanvasKit:", error);
      throw error;
    }
  },
);
