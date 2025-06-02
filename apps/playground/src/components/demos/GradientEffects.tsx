import {
  Canvas,
  Circle,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Text,
} from "react-skia";

export const GradientEffects = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    }}
  >
    <div>
      <h3>🌈 그라디언트 효과</h3>
      <Canvas height={250} width={350}>
        {/* Simple Linear Gradient Test */}
        <Rect height={30} width={150} x={10} y={20}>
          <LinearGradient
            colors={["#FF0000", "#0000FF"]}
            end={{ x: 150, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
        </Rect>

        {/* Multi-color Linear Gradient */}
        <Rect height={30} width={150} x={180} y={20}>
          <LinearGradient
            colors={["#FF6B6B", "#4ECDC4", "#45B7D1"]}
            end={{ x: 150, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
        </Rect>

        {/* Radial Gradient Test */}
        <Circle cx={80} cy={100} r={40}>
          <RadialGradient
            center={{ x: 80, y: 100 }}
            colors={["#FFFFFF", "#FF6B6B"]}
            radius={40}
          />
        </Circle>

        {/* Another Radial Gradient */}
        <Circle cx={250} cy={100} r={35}>
          <RadialGradient
            center={{ x: 250, y: 100 }}
            colors={["#FFD93D", "#FF6B6B", "#4C4C4C"]}
            radius={35}
          />
        </Circle>

        {/* Vertical Linear Gradient */}
        <Rect height={60} width={60} x={50} y={160}>
          <LinearGradient
            colors={["#8E2DE2", "#4A00E0"]}
            end={{ x: 0, y: 60 }}
            start={{ x: 0, y: 0 }}
          />
        </Rect>

        {/* Diagonal Linear Gradient */}
        <Rect height={60} width={60} x={220} y={160}>
          <LinearGradient
            colors={["#FE6B8B", "#FF8E53"]}
            end={{ x: 60, y: 60 }}
            start={{ x: 0, y: 0 }}
          />
        </Rect>

        <Text
          color="#666"
          fontSize={11}
          text="빨강→파랑 | 3색 그라디언트"
          x={10}
          y={70}
        />
        <Text
          color="#666"
          fontSize={11}
          text="원형: 흰색→빨강 | 3색 원형"
          x={10}
          y={145}
        />
        <Text
          color="#666"
          fontSize={11}
          text="수직 | 대각선 그라디언트"
          x={10}
          y={240}
        />
      </Canvas>
    </div>

    <div>
      <h3>🚀 고급 그라디언트</h3>
      <Canvas height={250} width={350}>
        {/* 함수형 컴포넌트에 그라디언트 적용 */}
        <Rect height={40} width={100} x={10} y={20}>
          <LinearGradient
            colors={["#FF5F6D", "#FFC371"]}
            end={{ x: 100, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
        </Rect>

        {/* 복합 컴포넌트에 그라디언트 적용 */}
        <Rect height={30} width={50} x={150} y={20}>
          <RadialGradient
            center={{ x: 175, y: 35 }}
            colors={["#667eea", "#764ba2"]}
            radius={20}
          />
        </Rect>
        <Circle cx={150 + 25} cy={20 + 50} r={20}>
          <RadialGradient
            center={{ x: 175, y: 70 }}
            colors={["#667eea", "#764ba2"]}
            radius={20}
          />
        </Circle>

        {/* Path에 그라디언트 적용 */}
        <Path
          path="M 10 120 Q 80 80 150 120 T 250 120"
          strokeWidth={6}
          style="stroke"
        >
          <LinearGradient
            colors={["#11998e", "#38ef7d"]}
            end={{ x: 140, y: 0 }}
            start={{ x: 0, y: 0 }}
          />
        </Path>

        {/* 그라디언트를 사용한 복잡한 도형 */}
        <Circle cx={265} cy={150} r={30}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            end={{ x: 60, y: 60 }}
            start={{ x: 0, y: 0 }}
          />
        </Circle>

        <Text
          color="#666"
          fontSize={11}
          text="함수형 컴포넌트 | 복합 컴포넌트"
          x={10}
          y={90}
        />
        <Text
          color="#666"
          fontSize={11}
          text="Path 그라디언트 | 고급 도형"
          x={10}
          y={190}
        />
      </Canvas>
    </div>

    <div>
      <h3>⚡ 정밀 그라디언트</h3>
      <Canvas height={250} width={350}>
        {/* 색상 위치를 세밀하게 제어한 그라디언트 */}
        <Rect height={30} width={150} x={10} y={20}>
          <LinearGradient
            colors={["#FF0000", "#FFFF00", "#00FF00", "#0000FF"]}
            end={{ x: 150, y: 0 }}
            positions={[0, 0.2, 0.8, 1]} // 불균등 분포
            start={{ x: 0, y: 0 }}
          />
        </Rect>

        {/* 중앙 집중 원형 그라디언트 */}
        <Circle cx={235} cy={35} r={25}>
          <RadialGradient
            center={{ x: 235, y: 35 }}
            colors={["#FFFFFF", "#FF6B6B", "#000000"]}
            positions={[0, 0.7, 1]} // 중앙에 집중
            radius={25}
          />
        </Circle>

        {/* 그라데이션 효과가 있는 복잡한 패스 */}
        <Path
          path="M 10 80 Q 100 50 200 80 Q 300 110 340 80"
          strokeWidth={8}
          style="stroke"
        >
          <LinearGradient
            colors={["#667eea", "#764ba2", "#f093fb", "#f5576c"]}
            end={{ x: 330, y: 0 }}
            positions={[0, 0.3, 0.7, 1]}
            start={{ x: 0, y: 0 }}
          />
        </Path>

        {/* 여러 단계의 원형 그라디언트 */}
        <Circle cx={100} cy={130} r={40}>
          <RadialGradient
            center={{ x: 100, y: 130 }}
            colors={["#FFD93D", "#FF6B6B", "#4ECDC4", "#45B7D1", "#2C3E50"]}
            positions={[0, 0.25, 0.5, 0.75, 1]}
            radius={40}
          />
        </Circle>

        {/* 비대칭 그라디언트 */}
        <Rect height={60} width={140} x={200} y={100}>
          <LinearGradient
            colors={["#4facfe", "#00f2fe", "#43e97b"]}
            end={{ x: 140, y: 60 }}
            positions={[0, 0.1, 1]} // 초기 색상을 빠르게 전환
            start={{ x: 0, y: 0 }}
          />
        </Rect>

        <Text
          color="#666"
          fontSize={11}
          text="불균등 분포 | 중앙 집중"
          x={10}
          y={70}
        />
        <Text
          color="#666"
          fontSize={11}
          text="다단계 원형 | 비대칭 그라디언트"
          x={10}
          y={175}
        />
      </Canvas>
    </div>
  </div>
);
