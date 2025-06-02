import { Canvas, Circle, Path, Rect } from "react-skia";

export const ComplexScene = () => (
  <div>
    <h3>🏞 복합 그래픽</h3>
    <Canvas height={200} width={350}>
      {/* Background sky */}
      <Rect color="#87CEEB" height={120} width={350} x={0} y={0} />

      {/* Sun */}
      <Circle color="#F1C40F" cx={300} cy={40} r={20} />

      {/* Mountains */}
      <Path
        color="#95A5A6"
        path="M 0 120 L 80 80 L 120 100 L 180 60 L 240 90 L 300 70 L 350 85 L 350 200 L 0 200 Z"
      />

      {/* Ground */}
      <Rect color="#2ECC71" height={80} width={350} x={0} y={120} />

      {/* Trees */}
      <Rect color="#8B4513" height={20} width={8} x={60} y={100} />
      <Circle color="#228B22" cx={64} cy={95} r={12} />

      <Rect color="#8B4513" height={15} width={8} x={140} y={105} />
      <Circle color="#228B22" cx={144} cy={100} r={10} />

      {/* House */}
      <Rect color="#D2691E" height={30} width={40} x={200} y={110} />
      <Path color="#8B0000" path="M 195 110 L 220 90 L 245 110 Z" />
      <Rect color="#654321" height={12} width={8} x={210} y={120} />
      <Rect color="#FFD700" height={6} width={6} x={225} y={118} />
    </Canvas>
  </div>
);
