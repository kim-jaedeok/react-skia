import { Canvas, Text } from "@react-skia/core";

export const TextRendering = () => (
  <div>
    <h3>📝 텍스트 렌더링</h3>
    <Canvas height={200} width={350}>
      <Text
        color="#2C3E50"
        fontSize={24}
        text="Hello Skia Web!"
        x={10}
        y={40}
      />
      <Text
        color="#E74C3C"
        fontSize={18}
        text="한글도 지원됩니다!"
        x={10}
        y={80}
      />
      <Text
        color="#8E44AD"
        fontSize={14}
        text="High Performance Graphics"
        x={10}
        y={120}
      />
      <Text
        color="#95A5A6"
        fontSize={12}
        text="CanvasKit으로 구현"
        x={10}
        y={160}
      />
    </Canvas>
  </div>
);
