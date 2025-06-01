import { createContext, useContext } from "react";

import type { SkiaContextValue } from "../types";

export const SkiaContext = createContext<SkiaContextValue>({
  CanvasKit: null,
  surface: null,
  canvas: null,
});

export const useSkia = () => {
  const context = useContext(SkiaContext);
  if (!context) {
    throw new Error("useSkia must be used within a SkiaProvider");
  }
  return context;
};
