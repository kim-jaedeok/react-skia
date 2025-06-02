import { Canvas, Circle, Text } from "react-skia";

export const PerformanceTest = () => (
  <div>
    <h3>🚀 성능 테스트</h3>
    <Canvas height={200} width={350}>
      {Array.from({ length: 100 }, (_, i) => (
        <Circle
          color={`hsl(${Math.random() * 360}, 70%, 60%)`}
          cx={Math.random() * 330 + 10}
          cy={Math.random() * 180 + 10}
          key={i}
          r={Math.random() * 6 + 2}
          strokeWidth={1}
          style={Math.random() > 0.7 ? "stroke" : "fill"}
        />
      ))}
      <Text color="#FFF" fontSize={14} text="100개 원 렌더링" x={10} y={20} />
    </Canvas>
  </div>
);
