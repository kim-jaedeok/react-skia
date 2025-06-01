export function ProjectStatus() {
  return (
    <div>
      <h3>📊 프로젝트 현황</h3>

      {/* Feature Status */}
      <div
        style={{
          padding: "30px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          border: "1px solid #e9ecef",
          marginBottom: "20px",
        }}
      >
        <h4>🚀 React Native Skia Web 포팅 현황</h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div>
            <h5 style={{ color: "#28a745", marginBottom: "10px" }}>
              ✅ 구현 완료
            </h5>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
              <li>CanvasKit 기반 고성능 렌더링</li>
              <li>기본 도형 (Rect, Circle, Path)</li>
              <li>텍스트 렌더링 및 폰트 지원</li>
              <li>SVG 호환 패스 그리기</li>
              <li>그룹화 및 변환 행렬</li>
              <li>투명도 및 레이어링</li>
              <li>이징 함수 라이브러리</li>
              <li>이미지 로딩 및 렌더링</li>
              <li>그라디언트 효과 (Linear, Radial)</li>
              <li>블러 및 컬러매트릭스 필터</li>
              <li>TypeScript 완전 지원</li>
              <li>React 19 호환성</li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: "#ffc107", marginBottom: "10px" }}>
              🚧 구현 중/예정
            </h5>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
              <li>애니메이션 시스템 (useSharedValue)</li>
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

        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            backgroundColor: "#e3f2fd",
            borderRadius: "8px",
          }}
        >
          <h5 style={{ color: "#1976d2", marginBottom: "10px" }}>
            💡 기술적 특징
          </h5>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "15px",
            }}
          >
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

      <div style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
        <p>
          🎯 <strong>React Native Skia Web</strong> - 모바일과 웹에서 동일한
          그래픽 API로 개발하세요!
        </p>
        <p style={{ fontSize: "14px" }}>
          Built with ❤️ using React 19, TypeScript, CanvasKit & Vite
        </p>
      </div>
    </div>
  );
}
