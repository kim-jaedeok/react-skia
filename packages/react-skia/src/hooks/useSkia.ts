import { useEffect } from "react";

import { CanvasKit } from "canvaskit-wasm";
import { useAtomValue, useSetAtom } from "jotai";

import { canvasKitAtom, loadCanvasKitAtom } from "../store/skiaStore";

export type UseSkia = () => { CanvasKit: CanvasKit | null };

export const useSkia: UseSkia = () => {
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
