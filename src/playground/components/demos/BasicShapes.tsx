import React from "react";

import { Circle, Rect, SkiaCanvas, Text } from "../../../react-skia";

export function BasicShapes() {
  return (
    <div>
      <h3>🔸 기본 도형</h3>
      <SkiaCanvas width={350} height={200}>
        <Rect x={10} y={10} width={80} height={60} color="#FF6B6B" />
        <Circle cx={150} cy={40} r={30} color="#4ECDC4" />
        <Rect
          x={250}
          y={10}
          width={80}
          height={60}
          color="#45B7D1"
          style="stroke"
          strokeWidth={3}
        />
        <Text
          x={10}
          y={100}
          text="사각형, 원, 스트로크"
          fontSize={14}
          color="#666"
        />
      </SkiaCanvas>
    </div>
  );
}
