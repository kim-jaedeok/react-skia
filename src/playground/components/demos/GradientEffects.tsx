import {
  Circle,
  LinearGradient,
  RadialGradient,
  Rect,
  SkiaCanvas,
  Text,
} from "../../../react-skia";

export function GradientEffects() {
  return (
    <div>
      <h3>🌈 그라디언트 효과</h3>
      <SkiaCanvas width={350} height={250}>
        {/* Simple Linear Gradient Test */}
        <Rect x={10} y={20} width={150} height={30}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 150, y: 0 }}
            colors={["#FF0000", "#0000FF"]}
          />
        </Rect>

        {/* Multi-color Linear Gradient */}
        <Rect x={180} y={20} width={150} height={30}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 150, y: 0 }}
            colors={["#FF6B6B", "#4ECDC4", "#45B7D1"]}
          />
        </Rect>

        {/* Radial Gradient Test */}
        <Circle cx={80} cy={100} r={40}>
          <RadialGradient
            center={{ x: 80, y: 100 }}
            radius={40}
            colors={["#FFFFFF", "#FF6B6B"]}
          />
        </Circle>

        {/* Another Radial Gradient */}
        <Circle cx={250} cy={100} r={35}>
          <RadialGradient
            center={{ x: 250, y: 100 }}
            radius={35}
            colors={["#FFD93D", "#FF6B6B", "#4C4C4C"]}
          />
        </Circle>

        {/* Vertical Linear Gradient */}
        <Rect x={50} y={160} width={60} height={60}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 60 }}
            colors={["#8E2DE2", "#4A00E0"]}
          />
        </Rect>

        {/* Diagonal Linear Gradient */}
        <Rect x={220} y={160} width={60} height={60}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 60, y: 60 }}
            colors={["#FE6B8B", "#FF8E53"]}
          />
        </Rect>

        <Text
          x={10}
          y={70}
          text="빨강→파랑 | 3색 그라디언트"
          fontSize={11}
          color="#666"
        />
        <Text
          x={10}
          y={145}
          text="원형: 흰색→빨강 | 3색 원형"
          fontSize={11}
          color="#666"
        />
        <Text
          x={10}
          y={240}
          text="수직 | 대각선 그라디언트"
          fontSize={11}
          color="#666"
        />
      </SkiaCanvas>
    </div>
  );
}
