import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Blur } from "./Blur";
import { Canvas } from "./Canvas";
import { Rect } from "./Rect";

describe("Blur Component", () => {
  it("should render blur component with basic props", () => {
    const { container } = render(
      <Canvas width={300} height={200}>
        <Blur blur={5}>
          <Rect x={10} y={10} width={50} height={30} color="#FF0000" />
        </Blur>
      </Canvas>,
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("should handle different blur values", () => {
    const blurValues = [0, 2.5, 10, 50];

    blurValues.forEach(blur => {
      expect(() => {
        render(
          <Canvas width={300} height={200}>
            <Blur blur={blur}>
              <Rect x={10} y={10} width={50} height={30} color="#FF0000" />
            </Blur>
          </Canvas>,
        );
      }).not.toThrow();
    });
  });

  it("should render with multiple child elements", () => {
    expect(() => {
      render(
        <Canvas width={300} height={200}>
          <Blur blur={3}>
            <Rect x={10} y={10} width={50} height={30} color="#FF0000" />
            <Rect x={70} y={50} width={40} height={25} color="#00FF00" />
          </Blur>
        </Canvas>,
      );
    }).not.toThrow();
  });

  it("should render without children", () => {
    expect(() => {
      render(
        <Canvas width={300} height={200}>
          <Blur blur={5} />
        </Canvas>,
      );
    }).not.toThrow();
  });
});
