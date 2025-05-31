import { Path, SkiaCanvas, Text } from "../../../react-skia";

export function PathDrawing() {
  return (
    <div>
      <h3>🎨 패스 그리기</h3>
      <SkiaCanvas width={350} height={200}>
        <Path
          path="M 10 80 Q 95 10 180 80 T 300 80"
          color="#F39C12"
          style="stroke"
          strokeWidth={4}
        />
        <Path
          path="M 50 120 L 100 160 L 150 120 L 200 160 L 250 120"
          color="#27AE60"
          style="stroke"
          strokeWidth={3}
        />
        <Text x={10} y={30} text="SVG 호환 패스" fontSize={14} color="#666" />
      </SkiaCanvas>
    </div>
  );
}
