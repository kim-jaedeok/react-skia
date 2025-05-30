import type { CanvasKit, Canvas, Paint, Path } from 'canvaskit-wasm';
import type { ReactElement, ReactNode } from 'react';
import React from 'react';

export class SkiaRenderer {
  private CanvasKit: CanvasKit;

  constructor(CanvasKit: CanvasKit) {
    this.CanvasKit = CanvasKit;
  }

  render(children: ReactNode, canvas: Canvas): void {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        this.renderElement(child, canvas);
      } else {
        console.log('❌ Invalid React element:', child);
      }
    });
  }

  private renderElement(element: ReactElement, canvas: Canvas): void {
    const { type, props } = element;

    if (typeof type === 'string') {
      switch (type) {
        case 'skia-rect':
          this.renderRect(props, canvas);
          break;
        case 'skia-circle':
          this.renderCircle(props, canvas);
          break;
        case 'skia-path':
          this.renderPath(props, canvas);
          break;
        case 'skia-text':
          this.renderText(props, canvas);
          break;
        case 'skia-group':
          this.renderGroup(props, canvas);
          break;
        case 'skia-blur':
          this.renderWithBlur(props, canvas);
          break;
        case 'skia-colormatrix':
          this.renderWithColorMatrix(props, canvas);
          break;
        case 'skia-image':
          this.renderImage(props, canvas);
          break;
        case 'skia-linear-gradient':
          this.renderWithLinearGradient(props, canvas);
          break;
        case 'skia-radial-gradient':
          this.renderWithRadialGradient(props, canvas);
          break;
      }
    } else if (typeof type === 'function') {
      try {
        // React 컴포넌트 함수를 호출하여 ReactElement를 얻습니다
        let result;
        
        // 함수형 컴포넌트인지 클래스 컴포넌트인지 확인
        if (type.prototype && type.prototype.isReactComponent) {
          // 클래스 컴포넌트
          const instance = new (type as any)(props);
          result = instance.render();
        } else {
          // 함수형 컴포넌트
          result = (type as any)(props);
        }
                
        if (React.isValidElement(result)) {
          this.renderElement(result, canvas);
        } else {
          console.log('❌ Component function did not return a valid React element');
        }
      } catch (error) {
        console.error('❌ Error calling component function:', error);
      }
    } else {
      console.log('❓ Unknown type:', typeof type, type);
    }

    // Render children if they exist
    if (props && typeof props === 'object' && 'children' in props) {
      this.render(props.children as ReactNode, canvas);
    }
  }

  private createPaint(color: string = '#000000', style: 'fill' | 'stroke' = 'fill', strokeWidth: number = 1): Paint {
    const paint = new this.CanvasKit.Paint();
    const colorArray = this.CanvasKit.parseColorString(color);
    paint.setColor(colorArray);
    
    // Enable anti-aliasing for better quality
    paint.setAntiAlias(true);
    
    if (style === 'stroke') {
      paint.setStyle(this.CanvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(strokeWidth);
      
      // Set stroke cap and join for better line quality
      paint.setStrokeCap(this.CanvasKit.StrokeCap.Round);
      paint.setStrokeJoin(this.CanvasKit.StrokeJoin.Round);
    } else {
      paint.setStyle(this.CanvasKit.PaintStyle.Fill);
    }
    
    return paint;
  }

  private renderRect(props: any, canvas: Canvas): void {
    const { x, y, width, height, color, style, strokeWidth } = props;
    const paint = this.createPaint(color, style, strokeWidth);
    
    const rect = this.CanvasKit.XYWHRect(x, y, width, height);
    canvas.drawRect(rect, paint);
    
    paint.delete();
  }

  private renderCircle(props: any, canvas: Canvas): void {
    const { cx, cy, r, color, style, strokeWidth } = props;
    const paint = this.createPaint(color, style, strokeWidth);
    
    canvas.drawCircle(cx, cy, r, paint);
    
    paint.delete();
  }

  private renderPath(props: any, canvas: Canvas): void {
    const { path, color, style, strokeWidth } = props;
    const paint = this.createPaint(color, style, strokeWidth);
    
    let skiaPath: Path | null;
    if (typeof path === 'string') {
      skiaPath = this.CanvasKit.Path.MakeFromSVGString(path);
    } else {
      skiaPath = path;
    }
    
    if (skiaPath) {
      canvas.drawPath(skiaPath, paint);
      if (typeof path === 'string') {
        skiaPath.delete();
      }
    }
    
    paint.delete();
  }

  private renderText(props: any, canvas: Canvas): void {
    const { x, y, text, fontSize = 16, color = '#000000' } = props;
    
    // 가장 간단하고 확실한 방법: Canvas 2D로 텍스트를 렌더링한 후 이미지로 변환
    this.renderTextAsImage(text, x, y, fontSize, color, canvas);
  }
  
  private renderTextAsImage(text: string, x: number, y: number, fontSize: number, color: string, skiaCanvas: Canvas): void {
    try {
      // Create temporary HTML canvas for text rendering
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to create 2D context');
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
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      
      // Enable smooth text rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Clear background (make it transparent)
      ctx.clearRect(0, 0, textWidth, textHeight);
      
      // Draw text with high quality
      ctx.fillText(text, 2, 2); // Small padding
      
      // Convert to Skia image using the most reliable method
      const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const pixels = new Uint8Array(imageData.data);
      
      const skiaImage = this.CanvasKit.MakeImage({
        width: tempCanvas.width,
        height: tempCanvas.height,
        alphaType: this.CanvasKit.AlphaType.Unpremul,
        colorType: this.CanvasKit.ColorType.RGBA_8888,
        colorSpace: this.CanvasKit.ColorSpace.SRGB,
      }, pixels, tempCanvas.width * 4);
      
      if (skiaImage) {
        // Draw the text image on the Skia canvas with high quality paint
        const paint = new this.CanvasKit.Paint();
        paint.setAntiAlias(true);
        
        const srcRect = this.CanvasKit.XYWHRect(0, 0, tempCanvas.width, tempCanvas.height);
        const destRect = this.CanvasKit.XYWHRect(x, y - 2, textWidth, textHeight); // Adjust for padding
        
        skiaCanvas.drawImageRect(skiaImage, srcRect, destRect, paint);
        
        // Cleanup
        skiaImage.delete();
        paint.delete();
      } else {
        throw new Error('Failed to create Skia image from text');
      }
      
    } catch (error) {
      console.error('❌ Text rendering failed:', error);
      
      // Fallback: draw a simple rectangle placeholder
      try {
        const paint = this.createPaint('#FF0000'); // Red to make it obvious
        const rect = this.CanvasKit.XYWHRect(x, y, text.length * fontSize * 0.6, fontSize);
        skiaCanvas.drawRect(rect, paint);
        paint.delete();
      } catch (fallbackError) {
        console.error('❌ Even fallback rect failed:', fallbackError);
      }
    }
  }
  
  private renderGroup(props: any, canvas: Canvas): void {
    const { transform, opacity, children } = props;
    
    canvas.save();
    
    if (transform) {
      if (Array.isArray(transform)) {
        canvas.concat(transform);
      }
    }
    
    if (opacity !== undefined && opacity < 1) {
      const paint = new this.CanvasKit.Paint();
      paint.setAlphaf(opacity);
      canvas.saveLayer(paint);
      paint.delete();
    }
    
    if (children) {
      this.render(children, canvas);
    }
    
    canvas.restore();
  }

  private renderWithBlur(props: any, canvas: Canvas): void {
    const { blur, children } = props;
    
    canvas.save();
    
    const filter = this.CanvasKit.ImageFilter.MakeBlur(blur, blur, this.CanvasKit.TileMode.Clamp, null);
    const paint = new this.CanvasKit.Paint();
    paint.setImageFilter(filter);
    
    canvas.saveLayer(paint);
    
    if (children) {
      this.render(children, canvas);
    }
    
    canvas.restore();
    paint.delete();
    filter.delete();
  }

  private renderWithColorMatrix(props: any, canvas: Canvas): void {
    const { matrix, children } = props;
    
    canvas.save();
    
    const filter = this.CanvasKit.ColorFilter.MakeMatrix(matrix);
    const paint = new this.CanvasKit.Paint();
    paint.setColorFilter(filter);
    
    canvas.saveLayer(paint);
    
    if (children) {
      this.render(children, canvas);
    }
    
    canvas.restore();
    paint.delete();
    filter.delete();
  }

  private imageCache = new Map<string, any>();
  private loadingImages = new Map<string, Promise<any>>();

  private async loadImage(src: string): Promise<any> {
    // Check cache first
    if (this.imageCache.has(src)) {
      return this.imageCache.get(src);
    }

    // Check if already loading
    if (this.loadingImages.has(src)) {
      return this.loadingImages.get(src);
    }

    // Start loading
    const loadPromise = this.loadImageFromSource(src);
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

  private async loadImageFromSource(src: string): Promise<any> {
    // Try multiple approaches to load the image
    const attempts = [
      () => this.loadWithImageElement(src),
      () => this.loadWithImageElement(src.replace('https://', 'http://')),
      () => this.loadWithImageElement(`/demo-images/${this.getImageFilename(src)}`),
    ];

    for (let i = 0; i < attempts.length; i++) {
      try {
        const result = await attempts[i]();
        return result;
      } catch (error) {
        if (i === attempts.length - 1) {
          // Last attempt failed, create fallback
          return this.createFallbackImage(120, 120, '#CCCCCC', 'NO IMG');
        }
      }
    }
  }

  private getImageFilename(url: string): string {
    // Extract filename from URL or create one based on URL pattern
    if (url.includes('FF6B6B') || url.includes('sample-1')) return 'sample-1.svg';
    if (url.includes('4ECDC4') || url.includes('sample-2')) return 'sample-2.svg';
    if (url.includes('45B7D1') || url.includes('sample-3')) return 'sample-3.svg';
    if (url.includes('E74C3C') || url.includes('sample-4')) return 'sample-4.svg';
    return 'sample-1.svg'; // default fallback
  }

  private loadWithImageElement(src: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      const timeout = setTimeout(() => {
        reject(new Error(`Image loading timeout: ${src}`));
      }, 3000); // 3 second timeout
      
      img.onload = () => {
        clearTimeout(timeout);
        try {
          const skiaImage = this.convertHtmlImageToSkia(img);
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

  private convertHtmlImageToSkia(img: HTMLImageElement): any {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to create canvas context');
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
      skiaImage = this.CanvasKit.MakeImage({
        width: canvas.width,
        height: canvas.height,
        alphaType: this.CanvasKit.AlphaType.Unpremul,
        colorType: this.CanvasKit.ColorType.RGBA_8888,
        colorSpace: this.CanvasKit.ColorSpace.SRGB,
      }, pixels, canvas.width * 4);
    } catch (error) {
      // Method 1 failed, try method 2
    }
    
    if (!skiaImage) {
      try {
        // Method 2: MakeImageFromCanvasImageSource
        skiaImage = this.CanvasKit.MakeImageFromCanvasImageSource(canvas);
      } catch (error) {
        // Method 2 failed, try method 3
      }
    }
    
    if (!skiaImage) {
      try {
        // Method 3: MakeImageFromEncoded with canvas data
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => {
              const arrayBuffer = reader.result as ArrayBuffer;
              skiaImage = this.CanvasKit.MakeImageFromEncoded(new Uint8Array(arrayBuffer));
            };
            reader.readAsArrayBuffer(blob);
          }
        });
      } catch (error) {
        // Method 3 failed
      }
    }
    
    if (!skiaImage) {
      throw new Error('Failed to create CanvasKit image from HTML image');
    }
    
    return skiaImage;
  }

  private createFallbackImage(width: number, height: number, color: string, text: string): any {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to create fallback canvas context');
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Fill background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // Add border
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
    
    // Draw text
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    
    // Convert to CanvasKit image
    try {
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = new Uint8Array(imageData.data);
      
      const skiaImage = this.CanvasKit.MakeImage({
        width: width,
        height: height,
        alphaType: this.CanvasKit.AlphaType.Unpremul,
        colorType: this.CanvasKit.ColorType.RGBA_8888,
        colorSpace: this.CanvasKit.ColorSpace.SRGB,
      }, pixels, width * 4);
      
      return skiaImage;
    } catch (error) {
      console.error('Failed to create fallback image:', error);
      return null;
    }
  }

  private renderImage(props: any, canvas: Canvas): void {
    const { x, y, width, height, src, fit = 'fill', opacity = 1 } = props;
    
    const cachedImage = this.imageCache.get(src);
    if (!cachedImage) {
      // Show loading placeholder
      const paint = this.createPaint('#f0f0f0');
      const rect = this.CanvasKit.XYWHRect(x, y, width, height);
      canvas.drawRect(rect, paint);
      
      // Draw loading text
      const textPaint = this.createPaint('#999999');
      const font = new this.CanvasKit.Font(null, 12);
      canvas.drawText('Loading...', x + width/2 - 30, y + height/2, textPaint, font);
      
      paint.delete();
      textPaint.delete();
      font.delete();
      
      // Start loading image
      this.loadImage(src).then(() => {
        // Image loaded, trigger re-render if needed
        // This would need to be handled by the component state
      }).catch((error) => {
        console.error('Failed to load image:', error);
      });
      
      return;
    }

    const paint = new this.CanvasKit.Paint();
    if (opacity < 1) {
      paint.setAlphaf(opacity);
    }

    const imageWidth = cachedImage.width();
    const imageHeight = cachedImage.height();
    
    let srcRect = this.CanvasKit.XYWHRect(0, 0, imageWidth, imageHeight);
    let destRect = this.CanvasKit.XYWHRect(x, y, width, height);

    // Handle different fit modes
    if (fit === 'contain') {
      const scaleX = width / imageWidth;
      const scaleY = height / imageHeight;
      const scale = Math.min(scaleX, scaleY);
      
      const newWidth = imageWidth * scale;
      const newHeight = imageHeight * scale;
      const offsetX = (width - newWidth) / 2;
      const offsetY = (height - newHeight) / 2;
      
      destRect = this.CanvasKit.XYWHRect(x + offsetX, y + offsetY, newWidth, newHeight);
    } else if (fit === 'cover') {
      const scaleX = width / imageWidth;
      const scaleY = height / imageHeight;
      const scale = Math.max(scaleX, scaleY);
      
      const newWidth = imageWidth * scale;
      const newHeight = imageHeight * scale;
      
      if (newWidth > width) {
        const cropWidth = width / scale;
        const cropX = (imageWidth - cropWidth) / 2;
        srcRect = this.CanvasKit.XYWHRect(cropX, 0, cropWidth, imageHeight);
      } else if (newHeight > height) {
        const cropHeight = height / scale;
        const cropY = (imageHeight - cropHeight) / 2;
        srcRect = this.CanvasKit.XYWHRect(0, cropY, imageWidth, cropHeight);
      }
    } else if (fit === 'none') {
      const centerX = (width - imageWidth) / 2;
      const centerY = (height - imageHeight) / 2;
      destRect = this.CanvasKit.XYWHRect(x + centerX, y + centerY, imageWidth, imageHeight);
    }

    canvas.drawImageRect(cachedImage, srcRect, destRect, paint);
    
    paint.delete();
  }

  private renderWithLinearGradient(props: any, canvas: Canvas): void {
    const { start, end, colors } = props;
    
    canvas.save();
    
    const paint = new this.CanvasKit.Paint();
    const colorArray = colors.map((color: string) => this.CanvasKit.parseColorString(color));
    
    const shader = this.CanvasKit.Shader.MakeLinearGradient(
      [start.x, start.y],
      [end.x, end.y],
      colorArray,
      null,
      this.CanvasKit.TileMode.Clamp
    );
    
    paint.setShader(shader);
    canvas.saveLayer(paint);
    
    if (props.children) {
      this.render(props.children as ReactNode, canvas);
    }
    
    canvas.restore();
    paint.delete();
    shader.delete();
  }

  private renderWithRadialGradient(props: any, canvas: Canvas): void {
    const { center, radius, colors } = props;
    
    canvas.save();
    
    const paint = new this.CanvasKit.Paint();
    const colorArray = colors.map((color: string) => this.CanvasKit.parseColorString(color));
    
    const shader = this.CanvasKit.Shader.MakeRadialGradient(
      [center.x, center.y],
      radius,
      colorArray,
      null,
      this.CanvasKit.TileMode.Clamp
    );
    
    paint.setShader(shader);
    canvas.saveLayer(paint);
    
    if (props.children) {
      this.render(props.children as ReactNode, canvas);
    }
    
    canvas.restore();
    paint.delete();
    shader.delete();
  }
}
