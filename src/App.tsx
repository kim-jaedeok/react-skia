import React from 'react';
import { SkiaProvider, SkiaCanvas, Rect, Circle, Text, Group, Path, LinearGradient, RadialGradient, useSharedValue, Easing, Image } from './skia';
import './App.css';

// 애니메이션 데모 컴포넌트
function AnimatedCircle() {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    const animate = () => {
      translateX.withTiming(200, { duration: 2000, easing: Easing.easeInOut });
      scale.withTiming(1.5, { duration: 1000, easing: Easing.bounce });
      
      setTimeout(() => {
        translateX.withTiming(0, { duration: 2000, easing: Easing.easeInOut });
        scale.withTiming(1, { duration: 1000, easing: Easing.bounce });
      }, 2000);
    };

    animate();
    const interval = setInterval(animate, 4000);
    return () => clearInterval(interval);
  }, [translateX, scale]);

  return (
    <Group transform={[scale.value, 0, 0, scale.value, translateX.value, 0]}>
      <Circle cx={50} cy={50} r={25} color="#FF6B6B" />
    </Group>
  );
}

function App() {
  return (
    <div>
      <SkiaProvider>
      <div style={{ padding: '20px' }}>
        <h1>React Skia Web Demo</h1>
        <p>React Native Skia 포팅 - 웹 버전 ✨</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {/* Basic Shapes */}
          <div>
            <h3>🔸 기본 도형</h3>
            <SkiaCanvas width={350} height={200}>
              <Rect x={10} y={10} width={80} height={60} color="#FF6B6B" />
              <Circle cx={150} cy={40} r={30} color="#4ECDC4" />
              <Rect x={250} y={10} width={80} height={60} color="#45B7D1" style="stroke" strokeWidth={3} />
              <Text x={10} y={100} text="사각형, 원, 스트로크" fontSize={14} color="#666" />
            </SkiaCanvas>
          </div>

          {/* Text Rendering */}
          <div>
            <h3>📝 텍스트 렌더링</h3>
            <SkiaCanvas width={350} height={200}>
              <Text x={10} y={40} text="Hello Skia Web!" fontSize={24} color="#2C3E50" />
              <Text x={10} y={80} text="한글도 지원됩니다!" fontSize={18} color="#E74C3C" />
              <Text x={10} y={120} text="High Performance Graphics" fontSize={14} color="#8E44AD" />
              <Text x={10} y={160} text="CanvasKit으로 구현" fontSize={12} color="#95A5A6" />
            </SkiaCanvas>
          </div>

          {/* Path Drawing */}
          <div>
            <h3>🎨 패스 그리기</h3>
            <SkiaCanvas width={350} height={200}>
              <Path 
                path="M 10 80 Q 95 10 180 80 T 300 80" 
                color="#F39C12" 
                style="stroke" 
                strokeWidth={4} 
              />
              <Path 
                path="M 50 120 L 100 160 L 150 120 L 200 160 L 250 120" 
                color="#27AE60" 
                style="stroke" 
                strokeWidth={3} 
              />
              <Text x={10} y={30} text="SVG 호환 패스" fontSize={14} color="#666" />
            </SkiaCanvas>
          </div>

          {/* Animation Demo */}
          <div>
            <h3>⚡ 애니메이션</h3>
            <SkiaCanvas width={350} height={200}>
              <AnimatedCircle />
              <Circle cx={50} cy={50} r={25} color="#E8E8E8" style="stroke" strokeWidth={2} />
              <Text x={10} y={120} text="이동 + 크기 애니메이션" fontSize={14} color="#666" />
              <Text x={10} y={140} text="React Native Skia 스타일" fontSize={12} color="#999" />
            </SkiaCanvas>
          </div>

          {/* Group and Opacity */}
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
              
              <Text x={10} y={180} text="레이어링 및 투명도 제어" fontSize={12} color="#666" />
            </SkiaCanvas>
          </div>

          {/* Complex Scene */}
          <div>
            <h3>🏞 복합 그래픽</h3>
            <SkiaCanvas width={350} height={200}>
              {/* Background sky */}
              <Rect x={0} y={0} width={350} height={120} color="#87CEEB" />
              
              {/* Sun */}
              <Circle cx={300} cy={40} r={20} color="#F1C40F" />
              
              {/* Mountains */}
              <Path 
                path="M 0 120 L 80 80 L 120 100 L 180 60 L 240 90 L 300 70 L 350 85 L 350 200 L 0 200 Z" 
                color="#95A5A6" 
              />
              
              {/* Ground */}
              <Rect x={0} y={120} width={350} height={80} color="#2ECC71" />
              
              {/* Trees */}
              <Rect x={60} y={100} width={8} height={20} color="#8B4513" />
              <Circle cx={64} cy={95} r={12} color="#228B22" />
              
              <Rect x={140} y={105} width={8} height={15} color="#8B4513" />
              <Circle cx={144} cy={100} r={10} color="#228B22" />
              
              {/* House */}
              <Rect x={200} y={110} width={40} height={30} color="#D2691E" />
              <Path path="M 195 110 L 220 90 L 245 110 Z" color="#8B0000" />
              <Rect x={210} y={120} width={8} height={12} color="#654321" />
              <Rect x={225} y={118} width={6} height={6} color="#FFD700" />
            </SkiaCanvas>
          </div>

          {/* Performance Test */}
          <div>
            <h3>🚀 성능 테스트</h3>
            <SkiaCanvas width={350} height={200}>
              {Array.from({ length: 100 }, (_, i) => (
                <Circle
                  key={i}
                  cx={Math.random() * 330 + 10}
                  cy={Math.random() * 180 + 10}
                  r={Math.random() * 6 + 2}
                  color={`hsl(${Math.random() * 360}, 70%, 60%)`}
                  style={Math.random() > 0.7 ? 'stroke' : 'fill'}
                  strokeWidth={1}
                />
              ))}
              <Text x={10} y={20} text="100개 원 렌더링" fontSize={14} color="#FFF" />
            </SkiaCanvas>
          </div>

          {/* Interactive Demo */}
          <div>
            <h3>🎮 상호작용</h3>
            <SkiaCanvas width={350} height={200} style={{ cursor: 'pointer' }}>
              <Group>
                <Rect x={50} y={50} width={100} height={60} color="#3498DB" />
                <Text x={70} y={85} text="Click Me!" fontSize={16} color="#FFF" />
              </Group>
              
              <Group>
                <Circle cx={250} cy={80} r={30} color="#E74C3C" />
                <Text x={230} y={85} text="Touch" fontSize={12} color="#FFF" />
              </Group>
              
              <Text x={10} y={150} text="터치/클릭 이벤트 (구현 예정)" fontSize={12} color="#666" />
              <Text x={10} y={170} text="마우스/터치 좌표 감지" fontSize={11} color="#999" />
            </SkiaCanvas>
          </div>

          {/* Gradient Effects - Enhanced Testing */}
          <div>
            <h3>🌈 그라디언트 효과</h3>
            <SkiaCanvas width={350} height={250}>
              {/* Simple Linear Gradient Test */}
              <Rect x={10} y={20} width={150} height={30}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 150, y: 0 }}
                  colors={['#FF0000', '#0000FF']}
                />
              </Rect>

              {/* Multi-color Linear Gradient */}
              <Rect x={180} y={20} width={150} height={30}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 150, y: 0 }}
                  colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
                />
              </Rect>

              {/* Radial Gradient Test */}
              <Circle cx={80} cy={100} r={40}>
                <RadialGradient
                  center={{ x: 80, y: 100 }}
                  radius={40}
                  colors={['#FFFFFF', '#FF6B6B']}
                />
              </Circle>

              {/* Another Radial Gradient */}
              <Circle cx={250} cy={100} r={35}>
                <RadialGradient
                  center={{ x: 250, y: 100 }}
                  radius={35}
                  colors={['#FFD93D', '#FF6B6B', '#4C4C4C']}
                />
              </Circle>

              {/* Vertical Linear Gradient */}
              <Rect x={50} y={160} width={60} height={60}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 60 }}
                  colors={['#8E2DE2', '#4A00E0']}
                />
              </Rect>

              {/* Diagonal Linear Gradient */}
              <Rect x={220} y={160} width={60} height={60}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 60, y: 60 }}
                  colors={['#FE6B8B', '#FF8E53']}
                />
              </Rect>

              <Text x={10} y={70} text="빨강→파랑 | 3색 그라디언트" fontSize={11} color="#666" />
              <Text x={10} y={145} text="원형: 흰색→빨강 | 3색 원형" fontSize={11} color="#666" />
              <Text x={10} y={240} text="수직 | 대각선 그라디언트" fontSize={11} color="#666" />
            </SkiaCanvas>
          </div>

          {/* Enhanced Gradient with Component Support */}
          <div>
            <h3>🚀 고급 그라디언트</h3>
            <SkiaCanvas width={350} height={200}>
              {/* 함수형 컴포넌트에 그라디언트 적용 */}
              <Rect x={10} y={20} width={100} height={40}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 100, y: 0 }}
                  colors={['#FF5F6D', '#FFC371']}
                />
              </Rect>

              {/* 복합 컴포넌트에 그라디언트 적용 */}
            

                 <Rect x={150} y={20} width={50} height={30}>
                      <RadialGradient
                  center={{ x: 175, y: 35 }}
                  radius={20}
                  colors={['#667eea', '#764ba2']}
                />
                    </Rect>
                    <Circle cx={150 + 25} cy={20 + 50} r={20}>
                      <RadialGradient
                  center={{ x: 175, y: 70 }}
                  radius={20}
                  colors={['#667eea', '#764ba2']}
                />
                    </Circle>

              {/* Path에 그라디언트 적용 */}
              <Path path="M 10 120 Q 80 80 150 120 T 250 120" style="stroke" strokeWidth={6}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 140, y: 0 }}
                  colors={['#11998e', '#38ef7d']}
                />
              </Path>

              {/* 그라디언트를 사용한 복잡한 도형 */}
              <Circle  cx={265} cy={150} r={30}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 60, y: 60 }}
                  colors={['#6a11cb', '#2575fc']}
                />
              </Circle>

              <Text x={10} y={90} text="함수형 컴포넌트 | 복합 컴포넌트" fontSize={11} color="#666" />
              <Text x={10} y={190} text="Path 그라디언트 | 고급 도형" fontSize={11} color="#666" />
            </SkiaCanvas>
          </div>

          {/* Advanced Gradient with Custom Positions */}
          <div>
            <h3>⚡ 정밀 그라디언트</h3>
            <SkiaCanvas width={350} height={180}>
              {/* 색상 위치를 세밀하게 제어한 그라디언트 */}
              <Rect x={10} y={20} width={150} height={30}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 150, y: 0 }}
                  colors={['#FF0000', '#FFFF00', '#00FF00', '#0000FF']}
                  positions={[0, 0.2, 0.8, 1]} // 불균등 분포
                />
              </Rect>

              {/* 중앙 집중 원형 그라디언트 */}
              <Circle cx={235} cy={35} r={25}>
                <RadialGradient
                  center={{ x: 235, y: 35 }}
                  radius={25}
                  colors={['#FFFFFF', '#FF6B6B', '#000000']}
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
                  colors={['#667eea', '#764ba2', '#f093fb', '#f5576c']}
                  positions={[0, 0.3, 0.7, 1]}
                />
              </Path>

              {/* 여러 단계의 원형 그라디언트 */}
              <Circle cx={100} cy={130} r={40}>
                <RadialGradient
                  center={{ x: 100, y: 130 }}
                  radius={40}
                  colors={['#FFD93D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#2C3E50']}
                  positions={[0, 0.25, 0.5, 0.75, 1]}
                />
              </Circle>

              {/* 비대칭 그라디언트 */}
              <Rect x={200} y={100} width={140} height={60}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 140, y: 60 }}
                  colors={['#4facfe', '#00f2fe', '#43e97b']}
                  positions={[0, 0.1, 1]} // 초기 색상을 빠르게 전환
                />
              </Rect>

              <Text x={10} y={70} text="불균등 분포 | 중앙 집중" fontSize={11} color="#666" />
              <Text x={10} y={175} text="다단계 원형 | 비대칭 그라디언트" fontSize={11} color="#666" />
            </SkiaCanvas>
          </div>

          {/* Image Rendering */}
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

              <Text x={10} y={110} text="다양한 fit 모드" fontSize={14} color="#666" />
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
                <Text x={55} y={165} text="비동기 이미지 로딩 및 캐싱 지원" fontSize={12} color="#666" />
              </Group>
            </SkiaCanvas>
          </div>
        </div>

        {/* Feature Status */}
        <div style={{ 
          marginTop: '40px', 
          padding: '30px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h2>🚀 React Native Skia Web 포팅 현황</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <h4 style={{ color: '#28a745', marginBottom: '10px' }}>✅ 구현 완료</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>CanvasKit 기반 고성능 렌더링</li>
                <li>기본 도형 (Rect, Circle, Path)</li>
                <li>텍스트 렌더링 및 폰트 지원</li>
                <li>SVG 호환 패스 그리기</li>
                <li>그룹화 및 변환 행렬</li>
                <li>투명도 및 레이어링</li>
                <li>애니메이션 시스템 (useSharedValue)</li>
                <li>이징 함수 라이브러리</li>
                <li>이미지 로딩 및 렌더링</li>
                <li>그라디언트 효과 (Linear, Radial)</li>
                <li>블러 및 컬러매트릭스 필터</li>
                <li>TypeScript 완전 지원</li>
                <li>React 19 호환성</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ color: '#ffc107', marginBottom: '10px' }}>🚧 구현 중/예정</h4>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                <li>클리핑 및 마스킹</li>
                <li>터치/마우스 이벤트 처리</li>
                <li>제스처 인식</li>
                <li>오프스크린 렌더링</li>
                <li>WebGL 최적화</li>
                <li>성능 프로파일링 도구</li>
                <li>고급 애니메이션 시퀀싱</li>
                <li>SVG 패스 애니메이션</li>
                <li>실시간 변형 효과</li>
              </ul>
            </div>
          </div>
          
          <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
            <h4 style={{ color: '#1976d2', marginBottom: '10px' }}>💡 기술적 특징</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <strong>렌더링 엔진:</strong> Google Skia (CanvasKit)
              </div>
              <div>
                <strong>프레임워크:</strong> React 19 + TypeScript
              </div>
              <div>
                <strong>빌드 도구:</strong> Vite 6.x
              </div>
              <div>
                <strong>패키지 관리:</strong> pnpm
              </div>
              <div>
                <strong>애니메이션:</strong> 60fps 네이티브 성능
              </div>
              <div>
                <strong>호환성:</strong> React Native Skia API
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          <p>
            🎯 <strong>React Native Skia Web</strong> - 
            모바일과 웹에서 동일한 그래픽 API로 개발하세요!
          </p>
          <p style={{ fontSize: '14px' }}>
            Built with ❤️ using React 19, TypeScript, CanvasKit & Vite
          </p>
        </div>
      </div>
    </SkiaProvider>
    

    
    </div>
  );
}

export default App;
