import { useEffect } from "react";

import { useAtomValue, useSetAtom } from "jotai";

import { canvasKitAtom, loadCanvasKitAtom } from "../store/skiaStore";

export const useSkia = () => {
  const canvasKit = useAtomValue(canvasKitAtom);
  const loadCanvasKit = useSetAtom(loadCanvasKitAtom);

  useEffect(() => {
    if (!canvasKit) {
      loadCanvasKit();
    }
  }, [canvasKit, loadCanvasKit]);

  return {
    CanvasKit: canvasKit,
  };
};
