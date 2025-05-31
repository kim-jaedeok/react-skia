import { SkiaCanvas, Text } from "../../../react-skia";

export function TextRendering() {
  return (
    <div>
      <h3>📝 텍스트 렌더링</h3>
      <SkiaCanvas width={350} height={200}>
        <Text
          x={10}
          y={40}
          text="Hello Skia Web!"
          fontSize={24}
          color="#2C3E50"
        />
        <Text
          x={10}
          y={80}
          text="한글도 지원됩니다!"
          fontSize={18}
          color="#E74C3C"
        />
        <Text
          x={10}
          y={120}
          text="High Performance Graphics"
          fontSize={14}
          color="#8E44AD"
        />
        <Text
          x={10}
          y={160}
          text="CanvasKit으로 구현"
          fontSize={12}
          color="#95A5A6"
        />
      </SkiaCanvas>
    </div>
  );
}
