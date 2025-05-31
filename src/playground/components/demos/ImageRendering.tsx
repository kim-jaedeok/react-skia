import { Group, Image, Rect, SkiaCanvas, Text } from "../../../react-skia";

export function ImageRendering() {
  return (
    <div>
      <h3>🖼️ 이미지 렌더링</h3>
      <SkiaCanvas width={350} height={200}>
        {/* Using a placeholder image URL */}
        <Image
          x={10}
          y={10}
          width={80}
          height={80}
          src="/demo-images/sample-1.svg"
          fit="cover"
        />

        <Image
          x={100}
          y={10}
          width={80}
          height={80}
          src="/demo-images/sample-2.svg"
          fit="contain"
        />

        <Image
          x={190}
          y={10}
          width={80}
          height={80}
          src="/demo-images/sample-3.svg"
          fit="fill"
        />

        <Text
          x={10}
          y={110}
          text="다양한 fit 모드"
          fontSize={14}
          color="#666"
        />
        <Text x={10} y={130} text="cover" fontSize={12} color="#999" />
        <Text x={100} y={130} text="contain" fontSize={12} color="#999" />
        <Text x={190} y={130} text="fill" fontSize={12} color="#999" />

        {/* Semi-transparent image */}
        <Image
          x={280}
          y={10}
          width={60}
          height={60}
          src="/demo-images/sample-4.svg"
          opacity={0.5}
        />
        <Text x={280} y={85} text="투명도" fontSize={12} color="#999" />

        <Group opacity={0.7}>
          <Rect x={50} y={150} width={250} height={20} color="#F8F9FA" />
          <Text
            x={55}
            y={165}
            text="비동기 이미지 로딩 및 캐싱 지원"
            fontSize={12}
            color="#666"
          />
        </Group>
      </SkiaCanvas>
    </div>
  );
}
