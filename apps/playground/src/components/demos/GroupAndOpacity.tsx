import { Canvas, Circle, Group, Rect, Text } from "@react-skia/core";

export const GroupAndOpacity = () => (
  <div>
    <h3>👥 그룹 및 투명도</h3>
    <Canvas height={200} width={350}>
      <Group opacity={0.8}>
        <Rect color="#E67E22" height={40} width={40} x={50} y={30} />
        <Circle color="#9B59B6" cx={120} cy={50} r={20} />
        <Text color="#34495E" fontSize={14} text="Group 1" x={160} y={55} />
      </Group>

      <Group opacity={0.5}>
        <Rect color="#1ABC9C" height={40} width={40} x={80} y={100} />
        <Circle color="#F1C40F" cx={150} cy={120} r={20} />
        <Text color="#34495E" fontSize={14} text="Group 2" x={190} y={125} />
      </Group>

      <Text
        color="#666"
        fontSize={12}
        text="레이어링 및 투명도 제어"
        x={10}
        y={180}
      />
    </Canvas>
  </div>
);
