import { Canvas, Circle, Rect, Text } from "@react-skia/core";

export const BasicShapes = () => (
  <div>
    <h3>🔸 기본 도형</h3>
    <Canvas height={200} width={350}>
      <Rect color="#FF6B6B" height={60} width={80} x={10} y={10} />
      <Circle color="#4ECDC4" cx={150} cy={40} r={30} />
      <Rect
        color="#45B7D1"
        height={60}
        strokeWidth={3}
        style="stroke"
        width={80}
        x={250}
        y={10}
      />
      <Text
        color="#666"
        fontSize={14}
        text="사각형, 원, 스트로크"
        x={10}
        y={100}
      />
    </Canvas>
  </div>
);
