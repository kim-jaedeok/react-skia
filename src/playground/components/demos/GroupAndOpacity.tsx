import { Circle, Group, Rect, SkiaCanvas, Text } from "../../../react-skia";

export function GroupAndOpacity() {
  return (
    <div>
      <h3>👥 그룹 및 투명도</h3>
      <SkiaCanvas width={350} height={200}>
        <Group opacity={0.8}>
          <Rect x={50} y={30} width={40} height={40} color="#E67E22" />
          <Circle cx={120} cy={50} r={20} color="#9B59B6" />
          <Text x={160} y={55} text="Group 1" fontSize={14} color="#34495E" />
        </Group>

        <Group opacity={0.5}>
          <Rect x={80} y={100} width={40} height={40} color="#1ABC9C" />
          <Circle cx={150} cy={120} r={20} color="#F1C40F" />
          <Text x={190} y={125} text="Group 2" fontSize={14} color="#34495E" />
        </Group>

        <Text
          x={10}
          y={180}
          text="레이어링 및 투명도 제어"
          fontSize={12}
          color="#666"
        />
      </SkiaCanvas>
    </div>
  );
}
