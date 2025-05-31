import { Circle, Path, Rect, SkiaCanvas } from "../../../react-skia";

export function ComplexScene() {
  return (
    <div>
      <h3>🏞 복합 그래픽</h3>
      <SkiaCanvas width={350} height={200}>
        {/* Background sky */}
        <Rect x={0} y={0} width={350} height={120} color="#87CEEB" />

        {/* Sun */}
        <Circle cx={300} cy={40} r={20} color="#F1C40F" />

        {/* Mountains */}
        <Path
          path="M 0 120 L 80 80 L 120 100 L 180 60 L 240 90 L 300 70 L 350 85 L 350 200 L 0 200 Z"
          color="#95A5A6"
        />

        {/* Ground */}
        <Rect x={0} y={120} width={350} height={80} color="#2ECC71" />

        {/* Trees */}
        <Rect x={60} y={100} width={8} height={20} color="#8B4513" />
        <Circle cx={64} cy={95} r={12} color="#228B22" />

        <Rect x={140} y={105} width={8} height={15} color="#8B4513" />
        <Circle cx={144} cy={100} r={10} color="#228B22" />

        {/* House */}
        <Rect x={200} y={110} width={40} height={30} color="#D2691E" />
        <Path path="M 195 110 L 220 90 L 245 110 Z" color="#8B0000" />
        <Rect x={210} y={120} width={8} height={12} color="#654321" />
        <Rect x={225} y={118} width={6} height={6} color="#FFD700" />
      </SkiaCanvas>
    </div>
  );
}
