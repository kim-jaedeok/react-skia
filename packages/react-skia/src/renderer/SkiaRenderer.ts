import {
  Children,
  Fragment,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from "react";

import type { CanvasKit } from "canvaskit-wasm";

import {
  BlurRenderer,
  CircleRenderer,
  GroupRenderer,
  ImageRenderer,
  PathRenderer,
  RectRenderer,
  RenderUtils,
  type Renderer,
  type RendererContext,
  TextRenderer,
} from "./renderers";

export class SkiaRenderer {
  #utils: RenderUtils;
  #rendererMap: Map<string, Renderer<unknown>>;

  constructor(CanvasKit: CanvasKit) {
    this.#utils = new RenderUtils(CanvasKit);

    // Initialize renderer map with type assertions
    this.#rendererMap = new Map<`skia-${string}`, Renderer<unknown>>([
      ["skia-rect", new RectRenderer(this.#utils)],
      ["skia-circle", new CircleRenderer(this.#utils)],
      ["skia-path", new PathRenderer(this.#utils)],
      ["skia-text", new TextRenderer(this.#utils)],
      [
        "skia-group",
        new GroupRenderer((children: ReactNode, context: RendererContext) =>
          this.#renderChildren(children, context),
        ),
      ],
      [
        "skia-blur",
        new BlurRenderer((children: ReactNode, context: RendererContext) =>
          this.#renderChildren(children, context),
        ),
      ],
      ["skia-image", new ImageRenderer(this.#utils)],
    ]);
  }

  render(children: ReactNode, context: RendererContext) {
    // Clear the canvas before rendering
    context.getSurface().getCanvas().clear(context.CanvasKit.TRANSPARENT);

    this.#render(children, context);

    // Flush the canvas to apply all changes
    context.getSurface().flush();
  }

  #render(children: ReactNode, context: RendererContext) {
    Children.forEach(children, child => {
      if (isValidElement(child)) {
        this.#renderReactElement(child, context);
      } else {
        console.error("Invalid React element:", child);
      }
    });
  }

  #renderReactElement(element: ReactElement, context: RendererContext) {
    const { type, props } = element;

    // React Fragment 처리
    if (type === Fragment) {
      if (props && typeof props === "object" && "children" in props) {
        this.#render(props.children as ReactNode, context);
      }
      return;
    }

    // Symbol Fragment 처리 (JSX <></> 문법)
    if (typeof type === "symbol") {
      if (props && typeof props === "object" && "children" in props) {
        this.#render(props.children as ReactNode, context);
      }
      return;
    }

    if (typeof type === "string") {
      const renderer = this.#rendererMap.get(type);
      if (renderer) {
        renderer.render((props as unknown) || ({} as unknown), context);
      } else {
        console.error(`Unsupported element type: ${type}`);
      }
    } else if (typeof type === "function") {
      try {
        // React 컴포넌트 함수를 호출하여 ReactElement를 얻습니다
        let result;

        // 함수형 컴포넌트인지 클래스 컴포넌트인지 확인
        if (type.prototype && type.prototype.isReactComponent) {
          // 클래스 컴포넌트
          const ComponentType = type as new (props: unknown) => {
            render(): ReactElement;
          };
          const instance = new ComponentType(props);
          result = instance.render();
        } else {
          // 함수형 컴포넌트
          const ComponentType = type as (props: unknown) => ReactElement;
          result = ComponentType(props);
        }

        if (isValidElement(result)) {
          this.#renderReactElement(result, context);
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
      this.#render(props.children as ReactNode, context);
    }
  }

  // Renderer들이 자식을 렌더링할 때 사용할 메서드
  #renderChildren(children: ReactNode, context: RendererContext) {
    this.#render(children, context);
  }

  // 새로운 렌더러를 Map에 동적으로 추가할 수 있는 메서드
  addRenderer(type: string, renderer: Renderer) {
    this.#rendererMap.set(type, renderer);
  }

  // 렌더러를 제거하는 메서드
  removeRenderer(type: string) {
    return this.#rendererMap.delete(type);
  }

  // 지원되는 타입 목록을 반환하는 메서드
  getSupportedTypes() {
    return Array.from(this.#rendererMap.keys());
  }

  // Clean up resources when renderer is no longer needed
  cleanup() {
    // Clean up individual renderers that have cleanup methods
    for (const renderer of this.#rendererMap.values()) {
      renderer.cleanup();
    }

    // Clear renderer map to release references
    this.#rendererMap.clear();

    // Clean up utils if it has cleanup method
    if (this.#utils && typeof this.#utils.cleanup === "function") {
      this.#utils.cleanup();
    }
  }
}
