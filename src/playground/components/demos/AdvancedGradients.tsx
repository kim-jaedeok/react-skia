import {
  Circle,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  SkiaCanvas,
  Text,
} from "../../../react-skia";

export function AdvancedGradients() {
  return (
    <div>
      <h3>🚀 고급 그라디언트</h3>
      <SkiaCanvas width={350} height={200}>
        {/* 함수형 컴포넌트에 그라디언트 적용 */}
        <Rect x={10} y={20} width={100} height={40}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 100, y: 0 }}
            colors={["#FF5F6D", "#FFC371"]}
          />
        </Rect>

        {/* 복합 컴포넌트에 그라디언트 적용 */}
        <Rect x={150} y={20} width={50} height={30}>
          <RadialGradient
            center={{ x: 175, y: 35 }}
            radius={20}
            colors={["#667eea", "#764ba2"]}
          />
        </Rect>
        <Circle cx={150 + 25} cy={20 + 50} r={20}>
          <RadialGradient
            center={{ x: 175, y: 70 }}
            radius={20}
            colors={["#667eea", "#764ba2"]}
          />
        </Circle>

        {/* Path에 그라디언트 적용 */}
        <Path
          path="M 10 120 Q 80 80 150 120 T 250 120"
          style="stroke"
          strokeWidth={6}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 140, y: 0 }}
            colors={["#11998e", "#38ef7d"]}
          />
        </Path>

        {/* 그라디언트를 사용한 복잡한 도형 */}
        <Circle cx={265} cy={150} r={30}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 60, y: 60 }}
            colors={["#6a11cb", "#2575fc"]}
          />
        </Circle>

        <Text
          x={10}
          y={90}
          text="함수형 컴포넌트 | 복합 컴포넌트"
          fontSize={11}
          color="#666"
        />
        <Text
          x={10}
          y={190}
          text="Path 그라디언트 | 고급 도형"
          fontSize={11}
          color="#666"
        />
      </SkiaCanvas>
    </div>
  );
}

export function PrecisionGradients() {
  return (
    <div>
      <h3>⚡ 정밀 그라디언트</h3>
      <SkiaCanvas width={350} height={180}>
        {/* 색상 위치를 세밀하게 제어한 그라디언트 */}
        <Rect x={10} y={20} width={150} height={30}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 150, y: 0 }}
            colors={["#FF0000", "#FFFF00", "#00FF00", "#0000FF"]}
            positions={[0, 0.2, 0.8, 1]} // 불균등 분포
          />
        </Rect>

        {/* 중앙 집중 원형 그라디언트 */}
        <Circle cx={235} cy={35} r={25}>
          <RadialGradient
            center={{ x: 235, y: 35 }}
            radius={25}
            colors={["#FFFFFF", "#FF6B6B", "#000000"]}
            positions={[0, 0.7, 1]} // 중앙에 집중
          />
        </Circle>

        {/* 그라데이션 효과가 있는 복잡한 패스 */}
        <Path
          path="M 10 80 Q 100 50 200 80 Q 300 110 340 80"
          style="stroke"
          strokeWidth={8}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 330, y: 0 }}
            colors={["#667eea", "#764ba2", "#f093fb", "#f5576c"]}
            positions={[0, 0.3, 0.7, 1]}
          />
        </Path>

        {/* 여러 단계의 원형 그라디언트 */}
        <Circle cx={100} cy={130} r={40}>
          <RadialGradient
            center={{ x: 100, y: 130 }}
            radius={40}
            colors={["#FFD93D", "#FF6B6B", "#4ECDC4", "#45B7D1", "#2C3E50"]}
            positions={[0, 0.25, 0.5, 0.75, 1]}
          />
        </Circle>

        {/* 비대칭 그라디언트 */}
        <Rect x={200} y={100} width={140} height={60}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 140, y: 60 }}
            colors={["#4facfe", "#00f2fe", "#43e97b"]}
            positions={[0, 0.1, 1]} // 초기 색상을 빠르게 전환
          />
        </Rect>

        <Text
          x={10}
          y={70}
          text="불균등 분포 | 중앙 집중"
          fontSize={11}
          color="#666"
        />
        <Text
          x={10}
          y={175}
          text="다단계 원형 | 비대칭 그라디언트"
          fontSize={11}
          color="#666"
        />
      </SkiaCanvas>
    </div>
  );
}
