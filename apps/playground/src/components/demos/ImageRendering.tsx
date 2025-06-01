import { Group, Image, Rect, SkiaCanvas, Text } from "@react-skia/core";

export const ImageRendering = () => (
  <div>
    <h3>🖼️ 이미지 렌더링</h3>
    <SkiaCanvas height={200} width={350}>
      {/* Using a placeholder image URL */}
      <Image
        fit="cover"
        height={80}
        src="/demo-images/sample-1.svg"
        width={80}
        x={10}
        y={10}
      />

      <Image
        fit="contain"
        height={80}
        src="/demo-images/sample-2.svg"
        width={80}
        x={100}
        y={10}
      />

      <Image
        fit="fill"
        height={80}
        src="/demo-images/sample-3.svg"
        width={80}
        x={190}
        y={10}
      />

      <Text color="#666" fontSize={14} text="다양한 fit 모드" x={10} y={110} />
      <Text color="#999" fontSize={12} text="cover" x={10} y={130} />
      <Text color="#999" fontSize={12} text="contain" x={100} y={130} />
      <Text color="#999" fontSize={12} text="fill" x={190} y={130} />

      {/* Semi-transparent image */}
      <Image
        height={60}
        opacity={0.5}
        src="/demo-images/sample-4.svg"
        width={60}
        x={280}
        y={10}
      />
      <Text color="#999" fontSize={12} text="투명도" x={280} y={85} />

      <Group opacity={0.7}>
        <Rect color="#F8F9FA" height={20} width={250} x={50} y={150} />
        <Text
          color="#666"
          fontSize={12}
          text="비동기 이미지 로딩 및 캐싱 지원"
          x={55}
          y={165}
        />
      </Group>
    </SkiaCanvas>
  </div>
);
