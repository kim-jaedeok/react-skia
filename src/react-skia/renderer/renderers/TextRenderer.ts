import type { RenderProps, Renderer, RendererContext } from "./types";
import { RenderUtils } from "./utils";

export class TextRenderer implements Renderer {
  private utils: RenderUtils;

  constructor(utils: RenderUtils) {
    this.utils = utils;
  }

  render(props: RenderProps, context: RendererContext): void {
    const { x, y, text, fontSize = 16, color = "#000000" } = props;
    const { canvas } = context;

    // TODO: Add gradient support for text in the future
    // Currently renders with basic color only

    // Use the simplest and most reliable method: render text as image using Canvas 2D
    this.renderTextAsImage(text, x, y, fontSize, color, canvas, context);
  }

  private renderTextAsImage(
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    skiaCanvas: any,
    context: RendererContext,
  ): void {
    try {
      // Create temporary HTML canvas for text rendering
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to create 2D context");
      }

      // Get device pixel ratio for high-DPI text rendering
      const pixelRatio = window.devicePixelRatio || 1;

      // Measure text first
      ctx.font = `${fontSize}px Arial, sans-serif`;
      const metrics = ctx.measureText(text);
      const textWidth = Math.ceil(metrics.width) + 4; // Add padding
      const textHeight = Math.ceil(fontSize * 1.2) + 4; // Add padding

      // Set canvas size with pixel ratio for high-DPI
      tempCanvas.width = textWidth * pixelRatio;
      tempCanvas.height = textHeight * pixelRatio;

      // Scale back to original size via CSS
      tempCanvas.style.width = `${textWidth}px`;
      tempCanvas.style.height = `${textHeight}px`;

      // Scale the drawing context for high-DPI
      ctx.scale(pixelRatio, pixelRatio);

      // Clear and setup context again (canvas resize clears it)
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Enable smooth text rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Clear background (make it transparent)
      ctx.clearRect(0, 0, textWidth, textHeight);

      // Draw text with high quality
      ctx.fillText(text, 2, 2); // Small padding

      // Convert to Skia image using the most reliable method
      const imageData = ctx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height,
      );
      const pixels = new Uint8Array(imageData.data);

      const skiaImage = context.CanvasKit.MakeImage(
        {
          width: tempCanvas.width,
          height: tempCanvas.height,
          alphaType: context.CanvasKit.AlphaType.Unpremul,
          colorType: context.CanvasKit.ColorType.RGBA_8888,
          colorSpace: context.CanvasKit.ColorSpace.SRGB,
        },
        pixels,
        tempCanvas.width * 4,
      );

      if (skiaImage) {
        // Draw the text image on the Skia canvas with high quality paint
        const paint = this.utils.createPaint({});
        paint.setAntiAlias(true);

        const srcRect = context.CanvasKit.XYWHRect(
          0,
          0,
          tempCanvas.width,
          tempCanvas.height,
        );
        const destRect = context.CanvasKit.XYWHRect(
          x,
          y - 2,
          textWidth,
          textHeight,
        ); // Adjust for padding

        skiaCanvas.drawImageRect(skiaImage, srcRect, destRect, paint);

        // Cleanup
        skiaImage.delete();
        paint.delete();
      } else {
        throw new Error("Failed to create Skia image from text");
      }
    } catch (error) {
      console.error("Text rendering failed:", error);

      // Fallback: draw a simple rectangle placeholder
      try {
        const paint = this.utils.createPaint({ color: "#FF0000" }); // Red to make it obvious
        const rect = context.CanvasKit.XYWHRect(
          x,
          y,
          text.length * fontSize * 0.6,
          fontSize,
        );
        skiaCanvas.drawRect(rect, paint);
        paint.delete();
      } catch (fallbackError) {
        console.error("Even fallback rect failed:", fallbackError);
      }
    }
  }

  /**
   * Clean up resources
   * TextRenderer doesn't hold persistent resources, cleanup is handled per-render
   */
  cleanup(): void {
    // No persistent resources to clean up
    // All paint, font, and image objects are cleaned up immediately after use in render methods
  }
}
