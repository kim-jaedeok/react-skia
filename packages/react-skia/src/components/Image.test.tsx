import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Canvas } from "./Canvas";
import { Image } from "./Image";

describe("Image Component", () => {
  it("should render image with basic props", () => {
    const { container } = render(
      <Canvas width={300} height={200}>
        <Image x={10} y={10} width={100} height={80} src="/test-image.jpg" />
      </Canvas>,
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("should handle different fit options", () => {
    const fitOptions = ["fill", "contain", "cover", "none"] as const;

    fitOptions.forEach(fit => {
      expect(() => {
        render(
          <Canvas width={300} height={200}>
            <Image
              x={10}
              y={10}
              width={100}
              height={80}
              src="/test.jpg"
              fit={fit}
            />
          </Canvas>,
        );
      }).not.toThrow();
    });
  });

  it("should render with optional props", () => {
    const { container } = render(
      <Canvas width={300} height={200}>
        <Image
          x={20}
          y={30}
          width={150}
          height={100}
          src="/sample.png"
          fit="contain"
          opacity={0.8}
        />
      </Canvas>,
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });
});
