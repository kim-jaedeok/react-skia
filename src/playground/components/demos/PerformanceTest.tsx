import React from "react";

import { Circle, SkiaCanvas, Text } from "../../../react-skia";

export function PerformanceTest() {
  return (
    <div>
      <h3>🚀 성능 테스트</h3>
      <SkiaCanvas width={350} height={200}>
        {Array.from({ length: 100 }, (_, i) => (
          <Circle
            key={i}
            cx={Math.random() * 330 + 10}
            cy={Math.random() * 180 + 10}
            r={Math.random() * 6 + 2}
            color={`hsl(${Math.random() * 360}, 70%, 60%)`}
            style={Math.random() > 0.7 ? "stroke" : "fill"}
            strokeWidth={1}
          />
        ))}
        <Text x={10} y={20} text="100개 원 렌더링" fontSize={14} color="#FFF" />
      </SkiaCanvas>
    </div>
  );
}
