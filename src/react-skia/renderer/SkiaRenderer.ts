import {
  Children,
  Fragment,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from "react";

import type { Canvas, CanvasKit } from "canvaskit-wasm";

import {
  BlurRenderer,
  CircleRenderer,
  ColorMatrixRenderer,
  GroupRenderer,
  ImageRenderer,
  PathRenderer,
  RectRenderer,
  RenderUtils,
  type Renderer,
  TextRenderer,
} from "./renderers";

export class SkiaRenderer {
  private utils: RenderUtils;
  private rendererMap: Map<string, Renderer>;

  constructor(CanvasKit: CanvasKit) {
    this.utils = new RenderUtils(CanvasKit);

    // Initialize renderer map with type assertions
    this.rendererMap = new Map<`skia-${string}`, Renderer>([
      ["skia-rect", new RectRenderer(this.utils)],
      ["skia-circle", new CircleRenderer(this.utils)],
      ["skia-path", new PathRenderer(this.utils)],
      ["skia-text", new TextRenderer(this.utils)],
      [
        "skia-group",
        new GroupRenderer((children: any, context: any) =>
          this.renderChildren(children, context.canvas),
        ),
      ],
      [
        "skia-blur",
        new BlurRenderer((children: any, context: any) =>
          this.renderChildren(children, context.canvas),
        ),
      ],
      [
        "skia-colormatrix",
        new ColorMatrixRenderer((children: any, context: any) =>
          this.renderChildren(children, context.canvas),
        ),
      ],
      ["skia-image", new ImageRenderer(this.utils)],
    ]);
  }

  render(children: ReactNode, canvas: Canvas): void {
    Children.forEach(children, child => {
      if (isValidElement(child)) {
        this.renderReactElement(child, canvas);
      } else {
        console.error("Invalid React element:", child);
      }
    });
  }

  private renderReactElement(element: ReactElement, canvas: Canvas): void {
    const { type, props } = element;

    // React Fragment 처리
    if (type === Fragment) {
      if (props && typeof props === "object" && "children" in props) {
        this.render(props.children as ReactNode, canvas);
      }
      return;
    }

    // Symbol Fragment 처리 (JSX <></> 문법)
    if (typeof type === "symbol") {
      if (props && typeof props === "object" && "children" in props) {
        this.render(props.children as ReactNode, canvas);
      }
      return;
    }

    if (typeof type === "string") {
      const renderer = this.rendererMap.get(type);
      if (renderer) {
        const context = {
          CanvasKit: this.utils.getCanvasKit(),
          canvas: canvas,
        };
        renderer.render(props || {}, context);
      } else {
        console.warn(`Unsupported element type: ${type}`);
      }
    } else if (typeof type === "function") {
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

        if (isValidElement(result)) {
          this.renderReactElement(result, canvas);
        } else {
          console.error(
            " Component function did not return a valid React element",
          );
        }
      } catch (error) {
        console.error("Error calling component function:", error);
      }
    } else {
      console.error("Unknown type:", typeof type, type);
    }

    // 특정 요소들은 자체적으로 자식을 처리하므로 여기서는 제외
    const elementsWithOwnChildRendering = new Set([
      "skia-rect",
      "skia-circle",
      "skia-path",
      "skia-text",
    ]);

    // 자식 렌더링 (기본 요소가 아닌 경우에만)
    if (
      props &&
      typeof props === "object" &&
      "children" in props &&
      typeof type === "string" &&
      !elementsWithOwnChildRendering.has(type)
    ) {
      this.render(props.children as ReactNode, canvas);
    }
  }

  // Renderer들이 자식을 렌더링할 때 사용할 메서드
  private renderChildren(children: ReactNode, canvas: Canvas): void {
    this.render(children, canvas);
  }

  // 새로운 렌더러를 Map에 동적으로 추가할 수 있는 메서드
  addRenderer(type: string, renderer: any): void {
    this.rendererMap.set(type, renderer);
  }

  // 렌더러를 제거하는 메서드
  removeRenderer(type: string): boolean {
    return this.rendererMap.delete(type);
  }

  // 지원되는 타입 목록을 반환하는 메서드
  getSupportedTypes(): string[] {
    return Array.from(this.rendererMap.keys());
  }
}
