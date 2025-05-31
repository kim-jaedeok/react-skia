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

    // React Fragment 처리
    if (type === React.Fragment) {
      if (props && typeof props === 'object' && 'children' in props) {
        this.render(props.children as ReactNode, canvas);
      }
      return;
    }

    // Symbol Fragment 처리 (JSX <></> 문법)
    if (typeof type === 'symbol') {
      if (props && typeof props === 'object' && 'children' in props) {
        this.render(props.children as ReactNode, canvas);
      }
      return;
    }

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

    // 특정 요소들은 자체적으로 자식을 처리하므로 여기서는 제외
    const elementsWithOwnChildRendering = [
      'skia-rect', 'skia-circle', 'skia-path', 'skia-text'
    ];
    
    // 자식 렌더링 (기본 요소가 아닌 경우에만)
    if (props && typeof props === 'object' && 'children' in props && 
        typeof type === 'string' && !elementsWithOwnChildRendering.includes(type)) {
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

  // 기본 색상 없이 Paint 생성하는 함수
  private createPaintWithoutColor(style: 'fill' | 'stroke' = 'fill', strokeWidth: number = 1): Paint {
    const paint = new this.CanvasKit.Paint();
    
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

  // 자식 요소 중에서 그라디언트를 찾고 paint에 적용하는 함수
  private applyGradientFromChildren(props: any, paint: Paint, bounds?: { x: number; y: number; width: number; height: number }): void {
    if (!props || !props.children) return;
    
    
    React.Children.forEach(props.children, (child) => {
      if (!React.isValidElement(child)) return;
      
      const { type } = child;
      const childProps = child.props as any;
      

      if (typeof type === 'string') {
        if (type === 'skia-linear-gradient') {
          this.applyLinearGradient(childProps, paint, bounds);
        } else if (type === 'skia-radial-gradient') {
          this.applyRadialGradient(childProps, paint, bounds);
        }
      } else if (typeof type === 'function') {
        try {
          let result;
          
          // 클래스 컴포넌트인지 함수형 컴포넌트인지 확인
          if (type.prototype && type.prototype.isReactComponent) {
            // 클래스 컴포넌트
            const instance = new (type as any)(childProps);
            result = instance.render();
          } else {
            // 함수형 컴포넌트
            result = (type as any)(childProps);
          }
          
          if (React.isValidElement(result)) {
            if (result.type === 'skia-linear-gradient') {
              this.applyLinearGradient(result.props as any, paint, bounds);
            } else if (result.type === 'skia-radial-gradient') {
              this.applyRadialGradient(result.props as any, paint, bounds);
            }
          }
        } catch (error) {
          console.log('❌ Error executing function component:', error);
        }
      }
    });
  }

  private applyLinearGradient(gradientProps: any, paint: Paint, bounds?: { x: number; y: number; width: number; height: number }): void {
    const { start, end, colors, positions, mode } = gradientProps;
    
    
    if (!start || !end || !Array.isArray(colors)) {
      console.error('❌ Invalid gradient props:', { start, end, colors });
      return;
    }
    
    try {
      const colorArray = colors.map((color: string) => {
        const parsed = this.CanvasKit.parseColorString(color);
        return parsed;
      });
      
      let tileMode = this.CanvasKit.TileMode.Clamp;
      if (mode === 'repeat') tileMode = this.CanvasKit.TileMode.Repeat;
      else if (mode === 'mirror') tileMode = this.CanvasKit.TileMode.Mirror;
      else if (mode === 'decal') tileMode = this.CanvasKit.TileMode.Decal;
      
      // 좌표를 절대 좌표로 변환 (bounds가 있는 경우)
      let gradientStart = [start.x, start.y];
      let gradientEnd = [end.x, end.y];
      
      if (bounds) {
        gradientStart = [bounds.x + start.x, bounds.y + start.y];
        gradientEnd = [bounds.x + end.x, bounds.y + end.y];
      }

      
      const shader = this.CanvasKit.Shader.MakeLinearGradient(
        gradientStart,
        gradientEnd,
        colorArray,
        positions || null,
        tileMode
      );
      
      if (shader) {
        // Paint에서 기존 색상을 제거하고 Shader만 설정
        paint.setShader(shader);
        
        // 중요: Shader 적용 후 색상을 다시 설정하지 않음
        
        // Shader는 Paint가 삭제될 때 함께 정리되므로 여기서는 delete하지 않음
      } else {
        console.error('❌ Failed to create shader');
      }
    } catch (error) {
      console.error('❌ Error in applyLinearGradient:', error);
    }
  }

  private applyRadialGradient(gradientProps: any, paint: Paint, _bounds?: { x: number; y: number; width: number; height: number }): void {
    const { center, radius, colors, positions, mode } = gradientProps;
    
    if (!center || radius === undefined || !Array.isArray(colors)) {
      return;
    }
    
    const colorArray = colors.map((color: string) => this.CanvasKit.parseColorString(color));
    
    let tileMode = this.CanvasKit.TileMode.Clamp;
    if (mode === 'repeat') tileMode = this.CanvasKit.TileMode.Repeat;
    else if (mode === 'mirror') tileMode = this.CanvasKit.TileMode.Mirror;
    else if (mode === 'decal') tileMode = this.CanvasKit.TileMode.Decal;
    
    // RadialGradient는 기존 방식대로 상대 좌표 사용
    const shader = this.CanvasKit.Shader.MakeRadialGradient(
      [center.x, center.y],
      radius,
      colorArray,
      positions || null,
      tileMode
    );
    
    paint.setShader(shader);
  }

  private renderRect(props: any, canvas: Canvas): void {
    const { x, y, width, height, color, style, strokeWidth } = props;
    
    
    // 그라디언트가 있는지 먼저 확인
    const hasGradient = this.hasGradientChildren(props);
    
    
    // 그라디언트가 있으면 기본 색상 없이 paint 생성, 없으면 기본 색상으로 생성
    const paint = hasGradient ? this.createPaintWithoutColor(style, strokeWidth) : this.createPaint(color, style, strokeWidth);
    
    
    // 자식 요소 중 그라디언트가 있다면 적용 (렌더링 좌표 전달)
    if (hasGradient) {
      this.applyGradientFromChildren(props, paint, { x, y, width, height });
    }
    
    const rect = this.CanvasKit.XYWHRect(x, y, width, height);
    canvas.drawRect(rect, paint);
    
    paint.delete();
    
    // 자식 요소 렌더링 (그라디언트가 아닌 다른 요소들)
    this.renderNonGradientChildren(props, canvas);
  }

  private renderCircle(props: any, canvas: Canvas): void {
    const { cx, cy, r, color, style, strokeWidth } = props;
    
    // 그라디언트가 있는지 먼저 확인
    const hasGradient = this.hasGradientChildren(props);
    
    // 그라디언트가 있으면 기본 색상 없이 paint 생성, 없으면 기본 색상으로 생성
    const paint = hasGradient ? this.createPaintWithoutColor(style, strokeWidth) : this.createPaint(color, style, strokeWidth);
    
    // 자식 요소 중 그라디언트가 있다면 적용
    if (hasGradient) {
      this.applyGradientFromChildren(props, paint, { x: cx - r, y: cy - r, width: r * 2, height: r * 2 });
    }
    
    canvas.drawCircle(cx, cy, r, paint);
    
    paint.delete();
    
    // 자식 요소 렌더링 (그라디언트가 아닌 다른 요소들)
    this.renderNonGradientChildren(props, canvas);
  }

  private renderPath(props: any, canvas: Canvas): void {
    const { path, color, style, strokeWidth } = props;
    const paint = this.createPaint(color, style, strokeWidth);
    
    // 자식 요소 중 그라디언트가 있다면 적용
    this.applyGradientFromChildren(props, paint);
    
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
    
    // 자식 요소 렌더링 (그라디언트가 아닌 다른 요소들)
    this.renderNonGradientChildren(props, canvas);
  }

  private renderText(props: any, canvas: Canvas): void {
    const { x, y, text, fontSize = 16, color = '#000000' } = props;
    
    // TODO: 텍스트에 그라디언트 적용 기능 구현 예정
    // 현재는 기본 색상으로만 렌더링
    
    // 가장 간단하고 확실한 방법: Canvas 2D로 텍스트를 렌더링한 후 이미지로 변환
    this.renderTextAsImage(text, x, y, fontSize, color, canvas);
    
    // 자식 요소 렌더링 (그라디언트가 아닌 다른 요소들)
    this.renderNonGradientChildren(props, canvas);
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

  // 자식 요소 중에서 그라디언트가 있는지 확인하는 함수
  private hasGradientChildren(props: any): boolean {
    if (!props || !props.children) {
      return false;
    }
    
    let hasGradient = false;
    React.Children.forEach(props.children, (child) => {
      if (!React.isValidElement(child)) return;
      
      const { type } = child;
      
      if (typeof type === 'string') {
        if (type === 'skia-linear-gradient' || type === 'skia-radial-gradient') {
          hasGradient = true;
        }
      } else if (typeof type === 'function') {
        // 함수형 컴포넌트인 경우 실행해서 결과를 확인
        try {
          let result;
          
          // 클래스 컴포넌트인지 함수형 컴포넌트인지 확인
          if (type.prototype && type.prototype.isReactComponent) {
            // 클래스 컴포넌트
            const instance = new (type as any)(child.props);
            result = instance.render();
          } else {
            // 함수형 컴포넌트
            result = (type as any)(child.props);
          }
          
          if (React.isValidElement(result)) {
            if (result.type === 'skia-linear-gradient' || result.type === 'skia-radial-gradient') {
              hasGradient = true;
            }
          }
        } catch (error) {
          console.log('❌ Error checking function component:', error);
        }
      }
    });
    
    return hasGradient;
  }

  // 그라디언트가 아닌 자식 요소들을 렌더링하는 함수
  private renderNonGradientChildren(props: any, canvas: Canvas): void {
    if (!props || !props.children) return;
    
    React.Children.forEach(props.children, (child) => {
      if (!React.isValidElement(child)) return;
      
      const { type } = child;
      
      // 그라디언트가 아닌 요소들만 렌더링
      if (typeof type === 'string' && 
          type !== 'skia-linear-gradient' && 
          type !== 'skia-radial-gradient') {
        this.renderElement(child, canvas);
      } else if (typeof type === 'function') {
        // 함수형 컴포넌트는 렌더링
        this.renderElement(child, canvas);
      }
    });
  }
}
