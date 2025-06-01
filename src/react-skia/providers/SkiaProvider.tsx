import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { CanvasKit } from "canvaskit-wasm";

import { Skia } from "../Skia";
import { SkiaContext } from "../hooks/useSkia";
import type { SkiaContextValue } from "../types";

interface SkiaProviderProps {
  children: ReactNode;
}

export function SkiaProvider({ children }: SkiaProviderProps) {
  const [canvasKit, setCanvasKit] = useState<CanvasKit | null>(null);

  useEffect(() => {
    const initSkia = async () => {
      try {
        const ck = await Skia.init();
        setCanvasKit(ck);
      } catch (error) {
        console.error("Failed to initialize CanvasKit:", error);
      }
    };

    initSkia();
  }, []);

  const contextValue: SkiaContextValue = {
    CanvasKit: canvasKit,
    surface: null,
    canvas: null,
  };

  return (
    <SkiaContext.Provider value={contextValue}>{children}</SkiaContext.Provider>
  );
}
