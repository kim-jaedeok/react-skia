import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import { useSkia } from "../hooks/useSkia";
import { SkiaRenderer } from "../renderer/SkiaRenderer";

type CanvasProps = ComponentPropsWithoutRef<"canvas">;

export const Canvas = ({ children, ...rest }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { CanvasKit } = useSkia();

  useEffect(() => {
    if (!CanvasKit || !canvasRef.current) {
      return;
    }

    // Get device pixel ratio for high-DPI displays
    const canvasElement = canvasRef.current;
    const pixelRatio = window.devicePixelRatio || 1;
    const width = canvasElement.clientWidth;
    const height = canvasElement.clientHeight;

    // Set actual canvas size for high resolution
    canvasElement.width = width * pixelRatio;
    canvasElement.height = height * pixelRatio;

    // Scale canvas back to original size via CSS
    canvasElement.style.width = `${width}px`;
    canvasElement.style.height = `${height}px`;

    // Create surface using modern API with high-DPI support
    const surface = CanvasKit.MakeSWCanvasSurface(canvasElement);
    if (!surface) {
      console.error("Failed to create surface");
      return;
    }

    // Render children
    const canvas = surface.getCanvas();

    // Scale the drawing context for high-DPI
    canvas.scale(pixelRatio, pixelRatio);
    canvas.clear(CanvasKit.WHITE);

    // Create renderer instance
    const renderer = new SkiaRenderer(CanvasKit);

    if (children) {
      renderer.render(children, canvas);
    } else {
      console.error("No children to render");
    }

    surface.flush();

    return () => {
      // Clean up renderer first
      renderer.cleanup();
      // Clean up surface
      surface.delete();
    };
  }, [CanvasKit, children]);

  return <canvas ref={canvasRef} {...rest} />;
};
