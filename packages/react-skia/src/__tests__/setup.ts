import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import {
  Canvas,
  CanvasKit,
  ColorFilter,
  Font,
  Image,
  ImageFilter,
  Paint,
  Path,
  PathConstructorAndFactory,
  Shader,
  Surface,
  TextBlob,
  Typeface,
} from "canvaskit-wasm";
import { afterEach, beforeAll, beforeEach, vi } from "vitest";

import { UseSkia } from "../hooks/useSkia";

// Global console.error spy for catching rendering errors
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

export const createMockConsoleError = () =>
  vi.spyOn(console, "error").mockImplementation(() => {});

beforeEach(() => {
  consoleErrorSpy = createMockConsoleError();
});

afterEach(() => {
  // Clear all mocks to reset state between tests
  vi.clearAllMocks();
});

// Export for use in tests
export { consoleErrorSpy };

// Create complete mock objects without type assertions
export const createMockCanvas = vi.fn().mockImplementation(
  (): Canvas => ({
    _type: "Canvas",
    clear: vi.fn(),
    drawRect: vi.fn(),
    drawCircle: vi.fn(),
    drawPath: vi.fn(),
    drawText: vi.fn(),
    drawImage: vi.fn(),
    drawImageRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    saveLayer: vi.fn(),
    concat: vi.fn(),
    clipPath: vi.fn(),
    clipRect: vi.fn(),
    clipRRect: vi.fn(),
    drawArc: vi.fn(),
    drawAtlas: vi.fn(),
    drawColor: vi.fn(),
    drawColorComponents: vi.fn(),
    drawColorInt: vi.fn(),
    drawDRRect: vi.fn(),
    drawGlyphs: vi.fn(),
    drawImageCubic: vi.fn(),
    drawImageOptions: vi.fn(),
    drawImageNine: vi.fn(),
    drawImageRectCubic: vi.fn(),
    drawImageRectOptions: vi.fn(),
    drawLine: vi.fn(),
    drawOval: vi.fn(),
    drawPaint: vi.fn(),
    drawParagraph: vi.fn(),
    drawPatch: vi.fn(),
    drawPicture: vi.fn(),
    drawPoints: vi.fn(),
    drawRect4f: vi.fn(),
    drawRRect: vi.fn(),
    drawShadow: vi.fn(),
    drawTextBlob: vi.fn(),
    drawVertices: vi.fn(),
    getDeviceClipBounds: vi.fn(),
    quickReject: vi.fn(),
    getLocalToDevice: vi.fn(),
    getSaveCount: vi.fn(),
    getTotalMatrix: vi.fn(),
    makeSurface: vi.fn(),
    readPixels: vi.fn(),
    restoreToCount: vi.fn(),
    skew: vi.fn(),
    writePixels: vi.fn(),
    delete: vi.fn(),
    deleteLater: vi.fn(),
    isAliasOf: vi.fn(),
    isDeleted: vi.fn(),
  }),
);

export const createMockSurface = vi.fn().mockImplementation(
  (): Surface => ({
    _type: "Surface",
    flush: vi.fn(),
    dispose: vi.fn(),
    delete: vi.fn(),
    width: vi.fn(() => 300),
    height: vi.fn(() => 200),
    makeImageFromTexture: vi.fn(),
    makeImageSnapshot: vi.fn(),
    drawOnce: vi.fn(),
    makeSurface: vi.fn(),
    deleteLater: vi.fn(),
    isAliasOf: vi.fn(),
    isDeleted: vi.fn(() => false),
    getCanvas: createMockCanvas,
    imageInfo: vi.fn(),
    makeImageFromTextureSource: vi.fn(),
    reportBackendTypeIsGPU: vi.fn(),
    requestAnimationFrame: vi.fn(),
    sampleCnt: vi.fn(),
    updateTextureFromSource: vi.fn(),
  }),
);

export const createMockPaint = vi.fn().mockImplementation(
  (): Paint => ({
    _type: "Paint",
    setColor: vi.fn(),
    setStyle: vi.fn(),
    setStrokeWidth: vi.fn(),
    setAntiAlias: vi.fn(),
    setStrokeCap: vi.fn(),
    setStrokeJoin: vi.fn(),
    setShader: vi.fn(),
    setColorFilter: vi.fn(),
    setImageFilter: vi.fn(),
    setAlphaf: vi.fn(),
    delete: vi.fn(),
    copy: vi.fn(),
    getColor: vi.fn(() => new Float32Array([0, 0, 0, 1])),
    getStrokeCap: vi.fn(),
    getStrokeJoin: vi.fn(),
    getStrokeWidth: vi.fn(() => 1),
    setBlendMode: vi.fn(),
    setColorComponents: vi.fn(),
    setMaskFilter: vi.fn(),
    setPathEffect: vi.fn(),
    setStrokeMiter: vi.fn(),
    deleteLater: vi.fn(),
    isAliasOf: vi.fn(),
    isDeleted: vi.fn(() => false),
    getStrokeMiter: vi.fn(),
    setBlender: vi.fn(),
    setColorInt: vi.fn(),
    setDither: vi.fn(),
  }),
);

export const createMockPath = vi.fn().mockImplementation(
  (): Path => ({
    _type: "Path",
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    cubicTo: vi.fn(),
    quadTo: vi.fn(),
    close: vi.fn(),
    delete: vi.fn(),
    deleteLater: vi.fn(),
    isAliasOf: vi.fn(),
    isDeleted: vi.fn(() => false),
    addArc: vi.fn(),
    addCircle: vi.fn(),
    addOval: vi.fn(),
    addPath: vi.fn(),
    addPoly: vi.fn(),
    addRect: vi.fn(),
    addRRect: vi.fn(),
    addVerbsPointsWeights: vi.fn(),
    arc: vi.fn(),
    arcToOval: vi.fn(),
    arcToRotated: vi.fn(),
    arcToTangent: vi.fn(),
    computeTightBounds: vi.fn(),
    conicTo: vi.fn(),
    contains: vi.fn(),
    copy: vi.fn(),
    countPoints: vi.fn(),
    dash: vi.fn(),
    equals: vi.fn(),
    getBounds: vi.fn(),
    getFillType: vi.fn(),
    getPoint: vi.fn(),
    isEmpty: vi.fn(),
    isVolatile: vi.fn(),
    makeAsWinding: vi.fn(),
    offset: vi.fn(),
    op: vi.fn(),
    rArcTo: vi.fn(),
    rConicTo: vi.fn(),
    rCubicTo: vi.fn(),
    reset: vi.fn(),
    rewind: vi.fn(),
    rLineTo: vi.fn(),
    rMoveTo: vi.fn(),
    rQuadTo: vi.fn(),
    setFillType: vi.fn(),
    setIsVolatile: vi.fn(),
    simplify: vi.fn(),
    stroke: vi.fn(),
    toCmds: vi.fn(),
    toSVGString: vi.fn(),
    transform: vi.fn(),
    trim: vi.fn(),
  }),
);

export const createMockImage = vi.fn().mockImplementation(
  (): Image => ({
    _type: "Image",
    delete: vi.fn(),
    width: vi.fn(() => 100),
    height: vi.fn(() => 100),
    encodeToBytes: vi.fn(() => new Uint8Array()),
    getColorSpace: vi.fn(),
    makeCopyWithDefaultMipmaps: vi.fn(),
    readPixels: vi.fn(),
    deleteLater: vi.fn(),
    isAliasOf: vi.fn(),
    isDeleted: vi.fn(() => false),
    getImageInfo: vi.fn(),
    makeShaderCubic: vi.fn(),
    makeShaderOptions: vi.fn(),
  }),
);

export const createMockShader = vi.fn().mockImplementation(
  (): Shader => ({
    _type: "Shader",
    delete: vi.fn(),
    deleteLater: vi.fn(),
    isAliasOf: vi.fn(),
    isDeleted: vi.fn(() => false),
  }),
);

export const createMockColorFilter = vi.fn().mockImplementation(
  (): ColorFilter => ({
    _type: "ColorFilter",
    delete: vi.fn(),
    deleteLater: vi.fn(),
    isAliasOf: vi.fn(),
    isDeleted: vi.fn(() => false),
  }),
);

export const createMockImageFilter = vi.fn().mockImplementation(
  (): ImageFilter => ({
    _type: "ImageFilter",
    delete: vi.fn(),
    deleteLater: vi.fn(),
    isAliasOf: vi.fn(),
    isDeleted: vi.fn(() => false),
    getOutputBounds: vi.fn(),
  }),
);

export const createMockTextBlob = vi.fn().mockImplementation(
  (): TextBlob => ({
    _type: "TextBlob",
    delete: vi.fn(),
    deleteLater: vi.fn(),
    isAliasOf: vi.fn(),
    isDeleted: vi.fn(() => false),
  }),
);

export const createMockTypeface = vi.fn().mockImplementation(
  (): Typeface => ({
    _type: "Typeface",
    delete: vi.fn(),
    getGlyphIDs: vi.fn(),
    getFamilyName: vi.fn(() => "Arial"),
    deleteLater: vi.fn(),
    isAliasOf: vi.fn(),
    isDeleted: vi.fn(() => false),
  }),
);

export const createMockFont = vi.fn().mockImplementation(
  (): Font => ({
    _type: "Font",
    delete: vi.fn(),
    deleteLater: vi.fn(),
    isAliasOf: vi.fn(),
    isDeleted: vi.fn(() => false),
    getMetrics: vi.fn(),
    getGlyphBounds: vi.fn(),
    getGlyphIDs: vi.fn(),
    getGlyphWidths: vi.fn(),
    getGlyphIntercepts: vi.fn(),
    getScaleX: vi.fn(),
    getSize: vi.fn(),
    getSkewX: vi.fn(),
    isEmbolden: vi.fn(),
    getTypeface: vi.fn(),
    setEdging: vi.fn(),
    setEmbeddedBitmaps: vi.fn(),
    setHinting: vi.fn(),
    setLinearMetrics: vi.fn(),
    setScaleX: vi.fn(),
    setSize: vi.fn(),
    setSkewX: vi.fn(),
    setEmbolden: vi.fn(),
    setSubpixel: vi.fn(),
    setTypeface: vi.fn(),
  }),
);

// Type-safe partial mock of CanvasKit for testing purposes
// This mock includes all commonly used properties and methods
// while using type assertion only for the final casting
export const createMockCanvasKit = vi.fn().mockImplementation(
  (): CanvasKit => ({
    MakeCanvasSurface: vi.fn(() => createMockSurface()),
    MakeSWCanvasSurface: vi.fn(() => createMockSurface()),
    Color: vi.fn((r, g, b, a = 1) => new Float32Array([r, g, b, a])),
    Font: vi.fn(() => createMockFont()),
    Paint: vi.fn(() => createMockPaint()),
    Path: {
      CanInterpolate: vi.fn(),
      MakeFromCmds: vi.fn(),
      MakeFromOp: vi.fn(),
      MakeFromPathInterpolation: vi.fn(),
      MakeFromSVGString: vi.fn(),
      MakeFromVerbsPointsWeights: vi.fn(),
    } as unknown as PathConstructorAndFactory,
    // Color parsing function
    parseColorString: vi.fn(color => {
      // Simple color parsing mock - returns Float32Array
      if (color === "#FF0000") return new Float32Array([1, 0, 0, 1]);
      if (color === "#00FF00") return new Float32Array([0, 1, 0, 1]);
      if (color === "#0000FF") return new Float32Array([0, 0, 1, 1]);
      if (color === "#000000") return new Float32Array([0, 0, 0, 1]);
      if (color === "#FFFFFF") return new Float32Array([1, 1, 1, 1]);
      // Default fallback
      return new Float32Array([0, 0, 0, 1]);
    }),
    // Color utilities
    Color4f: vi.fn((r, g, b, a = 1) => new Float32Array([r, g, b, a])),
    ColorAsInt: vi.fn(
      (r, g, b, a = 255) => (a << 24) | (r << 16) | (g << 8) | b,
    ),
    getColorComponents: vi.fn(() => [0, 0, 0, 1]),
    multiplyByAlpha: vi.fn((color, alpha) => {
      if (color instanceof Float32Array) {
        return new Float32Array([
          color[0] * alpha,
          color[1] * alpha,
          color[2] * alpha,
          color[3] * alpha,
        ]);
      }
      return new Float32Array([0, 0, 0, alpha]);
    }),
    // Color types with proper structure
    ColorType: {
      RGBA_8888: { value: 4 },
      BGRA_8888: { value: 5 },
      values: [4, 5, 2],
      Alpha_8: {
        value: 0,
      },
      RGB_565: {
        value: 0,
      },
      RGBA_1010102: {
        value: 0,
      },
      RGB_101010x: {
        value: 0,
      },
      Gray_8: {
        value: 0,
      },
      RGBA_F16: {
        value: 0,
      },
      RGBA_F32: {
        value: 0,
      },
    },
    // Alpha types with proper structure
    AlphaType: {
      Opaque: { value: 0 },
      Premul: { value: 1 },
      Unpremul: { value: 2 },
      values: [0, 1, 2],
    },
    // Color space
    ColorSpace: {
      SRGB: {
        _type: "ColorSpace",
        deleteLater: vi.fn(),
        isAliasOf: vi.fn(),
        isDeleted: vi.fn(() => false),
        delete: vi.fn(),
      },
      DISPLAY_P3: {
        _type: "ColorSpace",
        delete: vi.fn(),
        deleteLater: vi.fn(),
        isAliasOf: vi.fn(),
        isDeleted: vi.fn(),
      },
      ADOBE_RGB: {
        _type: "ColorSpace",
        delete: vi.fn(),
        deleteLater: vi.fn(),
        isAliasOf: vi.fn(),
        isDeleted: vi.fn(),
      },
      Equals: vi.fn(),
    },
    // Tile modes for gradients
    TileMode: {
      Clamp: { value: 0 },
      Repeat: { value: 1 },
      Mirror: { value: 2 },
      Decal: { value: 3 },
      values: [0, 1, 2, 3],
    },
    // Shader factory
    Shader: {
      MakeLinearGradient: vi.fn(() => createMockShader()),
      MakeRadialGradient: vi.fn(() => createMockShader()),
      MakeSweepGradient: vi.fn(() => createMockShader()),
      MakeColor: vi.fn(() => createMockShader()),
      MakeBlend: vi.fn(() => createMockShader()),
      MakeFractalNoise: vi.fn(() => createMockShader()),
      MakeTurbulence: vi.fn(() => createMockShader()),
      MakeTwoPointConicalGradient: vi.fn(() => createMockShader()),
    },
    // Color filter factory
    ColorFilter: {
      MakeMatrix: vi.fn(_matrix => createMockColorFilter()),
      MakeBlend: vi.fn(() => createMockColorFilter()),
      MakeCompose: vi.fn(() => createMockColorFilter()),
      MakeLinearToSRGBGamma: vi.fn(() => createMockColorFilter()),
      MakeSRGBToLinearGamma: vi.fn(() => createMockColorFilter()),
      MakeLerp: vi.fn(() => createMockColorFilter()),
      MakeLuma: vi.fn(() => createMockColorFilter()),
    },
    // Image filter factory
    ImageFilter: {
      MakeBlur: vi.fn((_sigmaX, _sigmaY, _tileMode, _input) =>
        createMockImageFilter(),
      ),
      MakeColorFilter: vi.fn(() => createMockImageFilter()),
      MakeCompose: vi.fn(() => createMockImageFilter()),
      MakeDropShadow: vi.fn(() => createMockImageFilter()),
      MakeDropShadowOnly: vi.fn(() => createMockImageFilter()),
      MakeImage: vi.fn(() => createMockImageFilter()),
      MakeMatrixTransform: vi.fn(() => createMockImageFilter()),
      MakeOffset: vi.fn(() => createMockImageFilter()),
      MakeBlend: vi.fn(),
      MakeDilate: vi.fn(),
      MakeDisplacementMap: vi.fn(),
      MakeErode: vi.fn(),
      MakeShader: vi.fn(),
    },
    // Rectangle utilities
    XYWHRect: vi.fn((x, y, w, h) => new Float32Array([x, y, x + w, y + h])),
    LTRBRect: vi.fn((l, t, r, b) => new Float32Array([l, t, r, b])),
    // Paint styles
    PaintStyle: {
      Fill: { value: 0 },
      Stroke: { value: 1 },
      values: [0, 1],
    },
    // Stroke cap styles
    StrokeCap: {
      Butt: { value: 0 },
      Round: { value: 1 },
      Square: { value: 2 },
      values: [0, 1, 2],
    },
    // Stroke join styles
    StrokeJoin: {
      Miter: { value: 0 },
      Round: { value: 1 },
      Bevel: { value: 2 },
      values: [0, 1, 2],
    },
    // Text blob methods
    TextBlob: {
      MakeFromText: vi.fn(() => createMockTextBlob()),
      MakeFromRSXform: vi.fn(() => createMockTextBlob()),
      MakeFromGlyphs: vi.fn(() => createMockTextBlob()),
      MakeFromRSXformGlyphs: vi.fn(() => createMockTextBlob()),
      MakeOnPath: vi.fn(() => createMockTextBlob()),
    },
    // Surface methods
    MakeSurface: vi.fn(() => createMockSurface()),
    // Matrix utilities
    Matrix: {
      identity: vi.fn(() => [1, 0, 0, 0, 1, 0, 0, 0, 1]),
      translated: vi.fn((dx, dy) => [1, 0, dx, 0, 1, dy, 0, 0, 1]),
      scaled: vi.fn((sx, sy) => [sx, 0, 0, 0, sy, 0, 0, 0, 1]),
      rotated: vi.fn(radians => [
        Math.cos(radians),
        -Math.sin(radians),
        0,
        Math.sin(radians),
        Math.cos(radians),
        0,
        0,
        0,
        1,
      ]),
      skewed: vi.fn((sx, sy) => [1, sx, 0, sy, 1, 0, 0, 0, 1]),
      multiply: vi.fn(() => [1, 0, 0, 0, 1, 0, 0, 0, 1]),
      invert: vi.fn(() => [1, 0, 0, 0, 1, 0, 0, 0, 1]),
      mapPoints: vi.fn((_matrix, points) => points),
    },
    // Typeface utilities
    Typeface: {
      MakeFreeTypeFaceFromData: vi.fn(() => createMockTypeface()),
      GetDefault: vi.fn(() => createMockTypeface()),
      MakeTypefaceFromData: vi.fn(),
    },
    // FontMgr utilities
    FontMgr: {
      FromData: vi.fn(),
    },
    // Blend modes
    BlendMode: {
      Clear: { value: 0 },
      Src: { value: 1 },
      Dst: { value: 2 },
      SrcOver: { value: 3 },
      DstOver: { value: 4 },
      SrcIn: { value: 5 },
      DstIn: { value: 6 },
      SrcOut: { value: 7 },
      DstOut: { value: 8 },
      SrcATop: { value: 9 },
      DstATop: { value: 10 },
      Xor: { value: 11 },
      Plus: { value: 12 },
      Modulate: { value: 13 },
      Screen: { value: 14 },
      Overlay: { value: 15 },
      Darken: { value: 16 },
      Lighten: { value: 17 },
      ColorDodge: { value: 18 },
      ColorBurn: { value: 19 },
      HardLight: { value: 20 },
      SoftLight: { value: 21 },
      Difference: { value: 22 },
      Exclusion: { value: 23 },
      Multiply: { value: 24 },
      Hue: { value: 25 },
      Saturation: { value: 26 },
      Color: { value: 27 },
      Luminosity: { value: 28 },
      values: Array.from({ length: 29 }, (_, i) => i),
    },

    // Additional color utilities
    BLACK: new Float32Array([0, 0, 0, 1]),
    WHITE: new Float32Array([1, 1, 1, 1]),
    RED: new Float32Array([1, 0, 0, 1]),
    GREEN: new Float32Array([0, 1, 0, 1]),
    BLUE: new Float32Array([0, 0, 1, 1]),
    TRANSPARENT: new Float32Array([0, 0, 0, 0]),
    CYAN: new Float32Array([0, 1, 1, 1]),
    MAGENTA: new Float32Array([1, 0, 1, 1]),
    YELLOW: new Float32Array([1, 1, 0, 1]),

    // Path fill types
    FillType: {
      Winding: { value: 0 },
      EvenOdd: { value: 1 },
      values: [0, 1, 2, 3],
    },

    // Path operation
    PathOp: {
      Difference: { value: 0 },
      Intersect: { value: 1 },
      Union: { value: 2 },
      XOR: { value: 3 },
      ReverseDifference: { value: 4 },
      values: [0, 1, 2, 3, 4],
    },
    // Text align
    TextAlign: {
      Left: { value: 0 },
      Right: { value: 1 },
      Center: { value: 2 },
      Justify: { value: 3 },
      Start: { value: 4 },
      End: { value: 5 },
      values: [0, 1, 2, 3, 4, 5],
    },
    // Text direction
    TextDirection: {
      RTL: { value: 0 },
      LTR: { value: 1 },
      values: [0, 1],
    },
    // Affinity
    Affinity: {
      Upstream: { value: 0 },
      Downstream: { value: 1 },
      values: [0, 1],
    },

    // Runtime effect
    RuntimeEffect: {
      Make: vi.fn(),
      MakeForBlender: vi.fn(),
      MakeTraced: vi.fn(),
    },

    // Misc utilities
    MakeGrContext: vi.fn(() => null),
    deleteContext: vi.fn(),

    // Additional surface methods
    MakeRenderTarget: vi.fn(() => createMockSurface()),

    // Memory management
    getShadowLocalBounds: vi.fn(() => new Float32Array([0, 0, 100, 100])),
    Free: vi.fn(),

    // Clip operations
    ClipOp: {
      Difference: { value: 0 },
      Intersect: { value: 1 },
      values: [0, 1],
    },

    // Text baseline
    TextBaseline: {
      Alphabetic: { value: 0 },
      Ideographic: { value: 1 },
      values: [0, 1],
    },

    // Point mode
    PointMode: {
      Points: { value: 0 },
      Lines: { value: 1 },
      Polygon: { value: 2 },
      values: [0, 1, 2],
    },

    // Additional matrix operations
    M44: {
      identity: vi.fn(),
      invert: vi.fn(),
      lookat: vi.fn(),
      multiply: vi.fn(),
      mustInvert: vi.fn(),
      perspective: vi.fn(),
      rc: vi.fn(),
      rotated: vi.fn(),
      rotatedUnitSinCos: vi.fn(),
      scaled: vi.fn(),
      setupCamera: vi.fn(),
      translated: vi.fn(),
      transpose: vi.fn(),
    },

    // Image encoding/decoding
    ImageFormat: {
      PNG: { value: 1 },
      JPEG: { value: 2 },
      WEBP: { value: 3 },
      values: [1, 2, 3],
    },

    // Font weight
    FontWeight: {
      Invisible: { value: 0 },
      Thin: { value: 100 },
      ExtraLight: { value: 200 },
      Light: { value: 300 },
      Normal: { value: 400 },
      Medium: { value: 500 },
      SemiBold: { value: 600 },
      Bold: { value: 700 },
      ExtraBold: { value: 800 },
      Black: { value: 900 },
      ExtraBlack: { value: 1000 },
      values: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
    }, // Font width
    FontWidth: {
      UltraCondensed: { value: 1 },
      ExtraCondensed: { value: 2 },
      Condensed: { value: 3 },
      SemiCondensed: { value: 4 },
      Normal: { value: 5 },
      SemiExpanded: { value: 6 },
      Expanded: { value: 7 },
      ExtraExpanded: { value: 8 },
      UltraExpanded: { value: 9 },
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    },

    // Font slant
    FontSlant: {
      Upright: { value: 0 },
      Italic: { value: 1 },
      Oblique: { value: 2 },
      values: [0, 1, 2],
    },

    // Additional missing CanvasKit properties to complete the interface
    MakeRasterDirectSurface: vi.fn(() => createMockSurface()),
    MakeWebGLCanvasSurface: vi.fn(() => createMockSurface()),
    MakeWebGLContext: vi.fn(() => null),
    computeTonalColors: vi.fn(),
    LTRBiRect: vi.fn(),
    XYWHiRect: vi.fn(),
    RRectXY: vi.fn(),
    Malloc: vi.fn(),
    MallocGlyphIDs: vi.fn(),
    GetWebGLContext: vi.fn(),
    MakeOnScreenGLSurface: vi.fn(),
    MakeGPUDeviceContext: vi.fn(),
    MakeGPUTextureSurface: vi.fn(),
    MakeGPUCanvasContext: vi.fn(),
    MakeGPUCanvasSurface: vi.fn(),
    MakeLazyImageFromTextureSource: vi.fn(),
    getDecodeCacheLimitBytes: vi.fn(),
    getDecodeCacheUsedBytes: vi.fn(),
    setDecodeCacheLimitBytes: vi.fn(),
    MakeAnimatedImageFromEncoded: vi.fn(),
    MakeCanvas: vi.fn(),
    MakeImage: vi.fn(() => createMockImage()),
    MakeImageFromEncoded: vi.fn(),
    MakeImageFromCanvasImageSource: vi.fn(),
    MakePicture: vi.fn(),
    MakeVertices: vi.fn(),
    MakeAnimation: vi.fn(),
    MakeManagedAnimation: vi.fn(),
    ImageData: vi.fn(),
    ParagraphStyle: vi.fn(),
    ContourMeasureIter: vi.fn(),
    PictureRecorder: vi.fn(),
    TextStyle: vi.fn(),
    SlottableTextProperty: vi.fn(),
    ParagraphBuilder: {
      Make: vi.fn(),
      MakeFromFontProvider: vi.fn(),
      MakeFromFontCollection: vi.fn(),
      ShapeText: vi.fn(),
      RequiresClientICU: vi.fn(),
    },
    Blender: {
      Mode: vi.fn(),
    },
    FontCollection: {
      Make: vi.fn(),
    },
    MaskFilter: {
      MakeBlur: vi.fn(),
    },
    PathEffect: {
      MakeCorner: vi.fn(),
      MakeDash: vi.fn(),
      MakeDiscrete: vi.fn(),
      MakeLine2D: vi.fn(),
      MakePath1D: vi.fn(),
      MakePath2D: vi.fn(),
    },
    TypefaceFontProvider: {
      Make: vi.fn(),
    },
    ColorMatrix: {
      concat: vi.fn(),
      identity: vi.fn(),
      postTranslate: vi.fn(),
      rotated: vi.fn(),
      scaled: vi.fn(),
    },
    Vector: {
      add: vi.fn(),
      cross: vi.fn(),
      dist: vi.fn(),
      dot: vi.fn(),
      length: vi.fn(),
      lengthSquared: vi.fn(),
      mulScalar: vi.fn(),
      normalize: vi.fn(),
      sub: vi.fn(),
    },
    BlurStyle: {
      Normal: {
        value: 0,
      },
      Solid: {
        value: 0,
      },
      Outer: {
        value: 0,
      },
      Inner: {
        value: 0,
      },
      values: [],
    },
    ColorChannel: {
      Red: {
        value: 0,
      },
      Green: {
        value: 0,
      },
      Blue: {
        value: 0,
      },
      Alpha: {
        value: 0,
      },
      values: [],
    },
    FilterMode: {
      Linear: {
        value: 0,
      },
      Nearest: {
        value: 0,
      },
      values: [],
    },
    FontEdging: {
      Alias: {
        value: 0,
      },
      AntiAlias: {
        value: 0,
      },
      SubpixelAntiAlias: {
        value: 0,
      },
      values: [],
    },
    FontHinting: {
      None: {
        value: 0,
      },
      Slight: {
        value: 0,
      },
      Normal: {
        value: 0,
      },
      Full: {
        value: 0,
      },
      values: [],
    },
    GlyphRunFlags: {
      IsWhiteSpace: 0,
    },
    MipmapMode: {
      None: {
        value: 0,
      },
      Nearest: {
        value: 0,
      },
      Linear: {
        value: 0,
      },
      values: [],
    },
    Path1DEffect: {
      Translate: {
        value: 0,
      },
      Rotate: {
        value: 0,
      },
      Morph: {
        value: 0,
      },
      values: [],
    },
    VertexMode: {
      Triangles: {
        value: 0,
      },
      TrianglesStrip: {
        value: 0,
      },
      TriangleFan: {
        value: 0,
      },
      values: [],
    },
    InputState: {
      Down: {
        value: 0,
      },
      Up: {
        value: 0,
      },
      Move: {
        value: 0,
      },
      Right: {
        value: 0,
      },
      Left: {
        value: 0,
      },
      values: [],
    },
    ModifierKey: {
      None: {
        value: 0,
      },
      Shift: {
        value: 0,
      },
      Control: {
        value: 0,
      },
      Option: {
        value: 0,
      },
      Command: {
        value: 0,
      },
      FirstPress: {
        value: 0,
      },
      values: [],
    },
    MOVE_VERB: 0,
    LINE_VERB: 0,
    QUAD_VERB: 0,
    CONIC_VERB: 0,
    CUBIC_VERB: 0,
    CLOSE_VERB: 0,
    SaveLayerInitWithPrevious: 0,
    SaveLayerF16ColorType: 0,
    ShadowTransparentOccluder: 0,
    ShadowGeometricOnly: 0,
    ShadowDirectionalLight: 0,
    DecorationStyle: {
      Solid: {
        value: 0,
      },
      Double: {
        value: 0,
      },
      Dotted: {
        value: 0,
      },
      Dashed: {
        value: 0,
      },
      Wavy: {
        value: 0,
      },
      values: [],
    },
    PlaceholderAlignment: {
      Baseline: {
        value: 0,
      },
      AboveBaseline: {
        value: 0,
      },
      BelowBaseline: {
        value: 0,
      },
      Top: {
        value: 0,
      },
      Bottom: {
        value: 0,
      },
      Middle: {
        value: 0,
      },
      values: [],
    },
    RectHeightStyle: {
      Tight: {
        value: 0,
      },
      Max: {
        value: 0,
      },
      IncludeLineSpacingMiddle: {
        value: 0,
      },
      IncludeLineSpacingTop: {
        value: 0,
      },
      IncludeLineSpacingBottom: {
        value: 0,
      },
      Strut: {
        value: 0,
      },
      values: [],
    },
    RectWidthStyle: {
      Tight: {
        value: 0,
      },
      Max: {
        value: 0,
      },
      values: [],
    },
    TextHeightBehavior: {
      All: {
        value: 0,
      },
      DisableFirstAscent: {
        value: 0,
      },
      DisableLastDescent: {
        value: 0,
      },
      DisableAll: {
        value: 0,
      },
      values: [],
    },
    VerticalTextAlign: {
      Top: {
        value: 0,
      },
      TopBaseline: {
        value: 0,
      },
      VisualTop: {
        value: 0,
      },
      VisualCenter: {
        value: 0,
      },
      VisualBottom: {
        value: 0,
      },
      values: [],
    },
    ResizePolicy: {
      None: {
        value: 0,
      },
      ScaleToFit: {
        value: 0,
      },
      DownscaleToFit: {
        value: 0,
      },
      values: [],
    },
    NoDecoration: 0,
    UnderlineDecoration: 0,
    OverlineDecoration: 0,
    LineThroughDecoration: 0,
    CodeUnitFlags: {
      NoCodeUnitFlag: {
        value: 0,
      },
      Whitespace: {
        value: 0,
      },
      Space: {
        value: 0,
      },
      Control: {
        value: 0,
      },
      Ideographic: {
        value: 0,
      },
      values: [],
    },
  }),
);

// Mock useSkia hook
vi.mock("../hooks/useSkia", () => ({
  useSkia: vi.fn(() => {
    const skia: ReturnType<UseSkia> = {
      CanvasKit: createMockCanvasKit(),
    };

    return skia;
  }),
}));

// Mock requestAnimationFrame for animations
global.requestAnimationFrame = vi.fn(callback => {
  return Number(setTimeout(callback, 16)); // 60fps
});

global.cancelAnimationFrame = vi.fn(id => {
  clearTimeout(id);
});

// Mock performance.now for timing
Object.defineProperty(global, "performance", {
  value: {
    ...global.performance,
    now: vi.fn(() => Date.now()),
  },
  writable: true,
});

// Mock Canvas API for testing
beforeAll(() => {
  // HTMLCanvasElement.prototype.getContext mock
  HTMLCanvasElement.prototype.getContext = vi
    .fn()
    .mockImplementation(contextType => {
      if (contextType === "2d") {
        return {
          fillRect: vi.fn(),
          clearRect: vi.fn(),
          strokeRect: vi.fn(),
          fillText: vi.fn(),
          strokeText: vi.fn(),
          drawImage: vi.fn(),
          arc: vi.fn(),
          beginPath: vi.fn(),
          closePath: vi.fn(),
          fill: vi.fn(),
          stroke: vi.fn(),
          moveTo: vi.fn(),
          lineTo: vi.fn(),
          bezierCurveTo: vi.fn(),
          quadraticCurveTo: vi.fn(),
          save: vi.fn(),
          restore: vi.fn(),
          translate: vi.fn(),
          rotate: vi.fn(),
          scale: vi.fn(),
          createLinearGradient: vi.fn(() => ({
            addColorStop: vi.fn(),
          })),
          createRadialGradient: vi.fn(() => ({
            addColorStop: vi.fn(),
          })),
          setTransform: vi.fn(),
          resetTransform: vi.fn(),
          filter: "",
          globalAlpha: 1,
          globalCompositeOperation: "source-over",
          fillStyle: "#000000",
          strokeStyle: "#000000",
          lineWidth: 1,
          lineCap: "butt",
          lineJoin: "miter",
          miterLimit: 10,
          lineDashOffset: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 0,
          shadowColor: "rgba(0, 0, 0, 0)",
          font: "10px sans-serif",
          textAlign: "start",
          textBaseline: "alphabetic",
          direction: "inherit",
          canvas: null,
          measureText: vi.fn(() => ({ width: 0 })),
          getImageData: vi.fn(() => ({
            data: new Uint8ClampedArray(4),
            width: 1,
            height: 1,
          })),
          putImageData: vi.fn(),
          createImageData: vi.fn(),
          isPointInPath: vi.fn(() => false),
          isPointInStroke: vi.fn(() => false),
          rect: vi.fn(),
          clip: vi.fn(),
          setLineDash: vi.fn(),
          getLineDash: vi.fn(() => []),
        };
      }
      return null;
    });

  // HTMLCanvasElement size properties
  Object.defineProperty(HTMLCanvasElement.prototype, "width", {
    get() {
      return 300;
    },
    set() {},
  });

  Object.defineProperty(HTMLCanvasElement.prototype, "height", {
    get() {
      return 150;
    },
    set() {},
  });
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Test utilities for easier testing
export const createTestCanvas = (width = 300, height = 150) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

// Mock data for testing
export const mockColors = {
  red: [1, 0, 0, 1],
  green: [0, 1, 0, 1],
  blue: [0, 0, 1, 1],
  black: [0, 0, 0, 1],
  white: [1, 1, 1, 1],
  transparent: [0, 0, 0, 0],
} as const;

export const mockRect = {
  x: 10,
  y: 10,
  width: 100,
  height: 50,
};

export const mockCircle = {
  cx: 50,
  cy: 50,
  r: 25,
};
