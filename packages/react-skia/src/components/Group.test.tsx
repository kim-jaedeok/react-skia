import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Canvas } from "./Canvas";
import { Circle } from "./Circle";
import { Group } from "./Group";
import { Rect } from "./Rect";

describe("Group Component", () => {
  it("should render group with child elements", () => {
    const { container } = render(
      <Canvas width={300} height={200}>
        <Group>
          <Rect x={10} y={10} width={50} height={30} color="#FF0000" />
          <Circle cx={100} cy={100} r={25} color="#00FF00" />
        </Group>
      </Canvas>,
    );

    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("should handle group properties", () => {
    const testCases = [
      { transform: [50, 50] },
      { opacity: 0.5 },
      { transform: [25, 25, 1.5, 1.5], opacity: 0.8 },
      { transform: [0, 0, 2, 2], opacity: 1 },
    ];

    testCases.forEach(groupProps => {
      expect(() => {
        render(
          <Canvas width={300} height={200}>
            <Group {...groupProps}>
              <Rect x={10} y={10} width={50} height={30} color="#FF0000" />
              <Circle cx={80} cy={80} r={20} color="#00FF00" />
            </Group>
          </Canvas>,
        );
      }).not.toThrow();
    });
  });

  it("should handle nested groups and empty groups", () => {
    expect(() => {
      render(
        <Canvas width={300} height={200}>
          <Group opacity={0.7}>
            <Group transform={[10, 10]}>
              <Rect x={0} y={0} width={30} height={20} color="#FF0000" />
            </Group>
            <Group />
          </Group>
        </Canvas>,
      );
    }).not.toThrow();
  });
});
