import type { Image } from "canvaskit-wasm";

import type { ImageProps, Renderer, RendererContext } from "./types";
import type { RenderUtils } from "./utils";

export class ImageRenderer implements Renderer<ImageProps> {
  private utils: RenderUtils;
  private imageCache = new Map<string, Image | null>();
  private loadingImages = new Map<string, Promise<Image | null>>();

  constructor(utils: RenderUtils) {
    this.utils = utils;
  }

  render(props: ImageProps, context: RendererContext) {
    const { x, y, width, height, src, fit = "fill", opacity = 1 } = props;
    const { CanvasKit, canvas } = context;

    const cachedImage = this.imageCache.get(src);
    if (!cachedImage) {
      // Show loading placeholder
      this.renderLoadingPlaceholder(x, y, width, height, context);

      // Start loading image
      this.loadImage(src, context)
        .then(() => {
          // Image loaded, trigger re-render if needed
          // This would need to be handled by the component state
        })
        .catch(error => {
          console.error("Failed to load image:", error);
        });

      return;
    }

    const paint = new CanvasKit.Paint();
    if (opacity < 1) {
      paint.setAlphaf(opacity);
    }

    const imageWidth = cachedImage?.width?.() ?? 0;
    const imageHeight = cachedImage?.height?.() ?? 0;

    let srcRect = CanvasKit.XYWHRect(0, 0, imageWidth, imageHeight);
    let destRect = CanvasKit.XYWHRect(x, y, width, height);

    // Handle different fit modes
    if (fit === "contain") {
      const scaleX = width / imageWidth;
      const scaleY = height / imageHeight;
      const scale = Math.min(scaleX, scaleY);

      const newWidth = imageWidth * scale;
      const newHeight = imageHeight * scale;
      const offsetX = (width - newWidth) / 2;
      const offsetY = (height - newHeight) / 2;

      destRect = CanvasKit.XYWHRect(
        x + offsetX,
        y + offsetY,
        newWidth,
        newHeight,
      );
    } else if (fit === "cover") {
      const scaleX = width / imageWidth;
      const scaleY = height / imageHeight;
      const scale = Math.max(scaleX, scaleY);

      const newWidth = imageWidth * scale;
      const newHeight = imageHeight * scale;

      if (newWidth > width) {
        const cropWidth = width / scale;
        const cropX = (imageWidth - cropWidth) / 2;
        srcRect = CanvasKit.XYWHRect(cropX, 0, cropWidth, imageHeight);
      } else if (newHeight > height) {
        const cropHeight = height / scale;
        const cropY = (imageHeight - cropHeight) / 2;
        srcRect = CanvasKit.XYWHRect(0, cropY, imageWidth, cropHeight);
      }
    } else if (fit === "none") {
      const centerX = (width - imageWidth) / 2;
      const centerY = (height - imageHeight) / 2;
      destRect = CanvasKit.XYWHRect(
        x + centerX,
        y + centerY,
        imageWidth,
        imageHeight,
      );
    }

    canvas.drawImageRect(cachedImage, srcRect, destRect, paint);

    paint.delete();
  }

  private renderLoadingPlaceholder(
    x: number,
    y: number,
    width: number,
    height: number,
    context: RendererContext,
  ) {
    const { CanvasKit, canvas } = context;

    // Show loading placeholder
    const paint = this.utils.createPaint({ color: "#f0f0f0" });
    const rect = CanvasKit.XYWHRect(x, y, width, height);
    canvas.drawRect(rect, paint);

    // Draw loading text
    const textPaint = this.utils.createPaint({ color: "#999999" });
    const font = new CanvasKit.Font(null, 12);
    canvas.drawText(
      "Loading...",
      x + width / 2 - 30,
      y + height / 2,
      textPaint,
      font,
    );

    paint.delete();
    textPaint.delete();
    font.delete();
  }

  private async loadImage(src: string, context: RendererContext) {
    // Check cache first
    if (this.imageCache.has(src)) {
      return this.imageCache.get(src);
    }

    // Check if already loading
    if (this.loadingImages.has(src)) {
      return this.loadingImages.get(src);
    }

    // Start loading
    const loadPromise = this.loadImageFromSource(src, context);
    this.loadingImages.set(src, loadPromise);

    try {
      const image = await loadPromise;
      this.imageCache.set(src, image);
      this.loadingImages.delete(src);
      return image;
    } catch (error) {
      this.loadingImages.delete(src);
      throw error;
    }
  }

  private async loadImageFromSource(
    src: string,
    context: RendererContext,
  ): Promise<Image | null> {
    // Try multiple approaches to load the image
    const attempts = [
      () => this.loadWithImageElement(src, context),
      () =>
        this.loadWithImageElement(src.replace("https://", "http://"), context),
    ];

    for (let i = 0; i < attempts.length; i++) {
      try {
        const result = await attempts[i]();
        return result;
      } catch {
        if (i === attempts.length - 1) {
          // Last attempt failed, return null to show placeholder
          return null;
        }
      }
    }
    return null;
  }

  private loadWithImageElement(
    src: string,
    context: RendererContext,
  ): Promise<Image | null> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";

      const timeout = setTimeout(() => {
        reject(new Error(`Image loading timeout: ${src}`));
      }, 3000); // 3 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        try {
          const skiaImage = this.convertHtmlImageToSkia(img, context);
          resolve(skiaImage);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }

  private convertHtmlImageToSkia(
    img: HTMLImageElement,
    context: RendererContext,
  ): Image | null {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to create canvas context");
    }

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);

    // Try different methods to create CanvasKit image
    let skiaImage = null;

    try {
      // Method 1: MakeImage with pixel data
      const pixels = new Uint8Array(imageData.data);
      skiaImage = context.CanvasKit.MakeImage(
        {
          width: canvas.width,
          height: canvas.height,
          alphaType: context.CanvasKit.AlphaType.Unpremul,
          colorType: context.CanvasKit.ColorType.RGBA_8888,
          colorSpace: context.CanvasKit.ColorSpace.SRGB,
        },
        pixels,
        canvas.width * 4,
      );
    } catch {
      // Method 1 failed, try method 2
    }

    if (!skiaImage) {
      try {
        // Method 2: MakeImageFromCanvasImageSource
        skiaImage = context.CanvasKit.MakeImageFromCanvasImageSource(canvas);
      } catch {
        // Method 2 failed, try method 3
      }
    }

    if (!skiaImage) {
      throw new Error("Failed to create CanvasKit image from HTML image");
    }

    return skiaImage;
  }

  /**
   * Clean up cached images and loading promises
   */
  cleanup() {
    // Clean up cached images and loading promises
    for (const image of this.imageCache.values()) {
      image?.delete();
    }
    this.imageCache.clear();

    // Clear loading promises
    this.loadingImages.clear();
  }
}
