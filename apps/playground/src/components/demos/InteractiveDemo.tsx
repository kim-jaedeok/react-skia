import { Canvas, Circle, Group, Rect, Text } from "react-skia";

export const InteractiveDemo = () => (
  <div>
    <h3>🎮 상호작용</h3>
    <Canvas height={200} style={{ cursor: "pointer" }} width={350}>
      <Group>
        <Rect color="#3498DB" height={60} width={100} x={50} y={50} />
        <Text color="#FFF" fontSize={16} text="Click Me!" x={70} y={85} />
      </Group>

      <Group>
        <Circle color="#E74C3C" cx={250} cy={80} r={30} />
        <Text color="#FFF" fontSize={12} text="Touch" x={230} y={85} />
      </Group>

      <Text
        color="#666"
        fontSize={12}
        text="터치/클릭 이벤트 (구현 예정)"
        x={10}
        y={150}
      />
      <Text
        color="#999"
        fontSize={11}
        text="마우스/터치 좌표 감지"
        x={10}
        y={170}
      />
    </Canvas>
  </div>
);
