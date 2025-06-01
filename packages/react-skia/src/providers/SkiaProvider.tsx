import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { CanvasKit } from "canvaskit-wasm";

import { SkiaContext } from "../hooks/useSkia";
import type { SkiaContextValue } from "../types";

interface SkiaProviderProps {
  children: ReactNode;
}

export const SkiaProvider = ({ children }: SkiaProviderProps) => {
  const [canvasKit, setCanvasKit] = useState<CanvasKit | null>(null);

  useEffect(() => {
    if (!canvasKit) {
      const initSkia = async () => {
        try {
          // Load CanvasKit from CDN
          const CanvasKitInit = (await import("canvaskit-wasm")).default;

          const canvasKitInstance = await CanvasKitInit({
            locateFile: (file: string) =>
              `https://unpkg.com/canvaskit-wasm@0.40.0/bin/${file}`,
          });

          setCanvasKit(canvasKitInstance);
        } catch (error) {
          console.error("Failed to initialize CanvasKit:", error);
        }
      };

      initSkia();
    }
  }, [canvasKit]);

  const contextValue: SkiaContextValue = {
    CanvasKit: canvasKit,
    surface: null,
    canvas: null,
  };

  return (
    <SkiaContext.Provider value={contextValue}>{children}</SkiaContext.Provider>
  );
};
