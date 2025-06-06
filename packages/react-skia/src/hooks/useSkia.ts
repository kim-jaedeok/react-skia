import { useEffect, useLayoutEffect, useRef } from "react";

import { useAtomValue, useSetAtom } from "jotai";

import {
  CanvasKitConfig,
  canvasKitAtom,
  canvasKitConfigAtom,
  loadCanvasKitAtom,
} from "../store/skiaStore";

export const useSkia = (options?: CanvasKitConfig) => {
  const canvasKit = useAtomValue(canvasKitAtom);
  const loadCanvasKit = useSetAtom(loadCanvasKitAtom);
  const setCanvasKitConfig = useSetAtom(canvasKitConfigAtom);

  // Track previous canvasKitPath to detect changes
  const previousCanvasKitPathRef = useRef<((file: string) => string) | null>(
    null,
  );

  // Set configuration options if provided - use useLayoutEffect for synchronous update
  useLayoutEffect(() => {
    if (options?.canvasKitPath) {
      setCanvasKitConfig({
        canvasKitPath: options.canvasKitPath,
      });
    }
  }, [options?.canvasKitPath, setCanvasKitConfig]);

  // Handle canvasKitPath changes in useEffect for reload logic
  useEffect(() => {
    if (options?.canvasKitPath) {
      // Check if canvasKitPath has changed
      const hasPathChanged =
        previousCanvasKitPathRef.current !== options.canvasKitPath;

      if (hasPathChanged && canvasKit) {
        // Force reload CanvasKit with new path
        loadCanvasKit({ force: true });
      }

      // Update the reference to track changes
      previousCanvasKitPathRef.current = options.canvasKitPath;
    }
  }, [options?.canvasKitPath, loadCanvasKit, canvasKit]);

  useEffect(() => {
    if (!canvasKit) {
      loadCanvasKit();
    }
  }, [canvasKit, loadCanvasKit]);

  return {
    CanvasKit: canvasKit ?? null,
  };
};
