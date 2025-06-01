import { Path, SkiaCanvas, Text } from "../../../react-skia";

export const PathDrawing = () => (
  <div>
    <h3>🎨 패스 그리기</h3>
    <SkiaCanvas height={200} width={350}>
      <Path
        color="#F39C12"
        path="M 10 80 Q 95 10 180 80 T 300 80"
        strokeWidth={4}
        style="stroke"
      />
      <Path
        color="#27AE60"
        path="M 50 120 L 100 160 L 150 120 L 200 160 L 250 120"
        strokeWidth={3}
        style="stroke"
      />
      <Text color="#666" fontSize={14} text="SVG 호환 패스" x={10} y={30} />
    </SkiaCanvas>
  </div>
);
