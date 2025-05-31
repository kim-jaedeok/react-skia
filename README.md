# React Skia Web + React Native Reanimated Web Port

React Native Skia를 웹 브라우저에서 사용할 수 있도록 포팅한 라이브러리와 React Native Reanimated의 완전한 웹 포팅 버전입니다.

## 🚀 주요 특징

- **고성능 렌더링**: Google의 CanvasKit을 기반으로 한 하드웨어 가속 그래픽
- **React Native 호환**: React Native Skia와 유사한 API 제공
- **완전한 애니메이션 시스템**: React Native Reanimated 웹 포팅
- **고급 애니메이션**: `withRepeat`, `withSequence`, `withSpring`, `withTiming` 지원
- **TypeScript 지원**: 완전한 타입 안정성
- **웹 최적화**: 브라우저 환경에 최적화된 구현

## 📦 설치

```bash
pnpm install
```

## 🎯 사용법

### 기본 Skia 그래픽

```tsx
import { Circle, Rect, SkiaCanvas, SkiaProvider, Text } from "./skia";

function App() {
  return (
    <SkiaProvider>
      <SkiaCanvas width={400} height={300}>
        <Rect x={10} y={10} width={100} height={80} color="#FF6B6B" />
        <Circle cx={200} cy={50} r={30} color="#4ECDC4" />
        <Text x={10} y={150} text="Hello Skia Web!" fontSize={20} />
      </SkiaCanvas>
    </SkiaProvider>
  );
}
```

### React Reanimated 애니메이션

```tsx
import {
  Easing,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "./react-reanimated";
import { Circle, Group, SkiaCanvas } from "./skia";

function AnimatedDemo() {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    // 무한 반복 애니메이션
    translateX.value = withRepeat(
      withSequence(
        withTiming(200, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );

    // 크기 변화 애니메이션
    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1000, easing: Easing.bounce }),
        withTiming(1, { duration: 1000, easing: Easing.bounce }),
      ),
      -1,
      false,
    );
  }, []);

  return (
    <SkiaCanvas width={350} height={200}>
      <Group transform={[scale.value, 0, 0, scale.value, translateX.value, 0]}>
        <Circle cx={50} cy={50} r={25} color="#FF6B6B" />
      </Group>
    </SkiaCanvas>
  );
}
```

## 🛠 개발

```bash
# 개발 서버 시작
pnpm dev

# 빌드
pnpm build
```

## 🎨 구현된 기능

### Skia 그래픽 시스템

- ✅ 기본 도형 렌더링 (Rect, Circle, Path)
- ✅ 텍스트 렌더링 및 폰트 지원
- ✅ 패스 그리기 (SVG 호환)
- ✅ 그라디언트 (Linear, Radial)
- ✅ 그룹화 및 투명도 제어
- ✅ 변형 행렬 (Transform Matrix)
- ✅ 이미지 렌더링
- ✅ 블러 및 색상 필터

### React Native Reanimated 웹 포트

- ✅ `useSharedValue` - 반응형 애니메이션 값
- ✅ `useDerivedValue` - 계산된 값
- ✅ `useAnimatedStyle` - 애니메이션 스타일
- ✅ `withTiming` - 시간 기반 애니메이션
- ✅ `withSpring` - 스프링 물리 애니메이션
- ✅ `withRepeat` - 반복 애니메이션 (무한/유한)
- ✅ `withSequence` - 순차 애니메이션
- ✅ `withDelay` - 지연 애니메이션
- ✅ Easing 함수 라이브러리 (베지어, 탄성, 바운스 등)
- ✅ Worklet 시스템 (`runOnJS`, `runOnUI`)
- ✅ 애니메이션 취소 및 상태 관리

### 데모 애니메이션

- 🎯 궤도 애니메이션 (회전 + 크기 변화)
- ⚽ 스프링 물리 시뮬레이션
- 🌊 웨이브 애니메이션 (sin 함수 기반)
- ✨ 파티클 시스템 (방사형 폭발)
- 🔘 인터랙티브 버튼
- 🕒 실시간 시계 애니메이션
- ⏳ 로딩 스피너 컬렉션
- 🎯 물리 진자 시뮬레이션
- 🌍 중력 낙하 시뮬레이션
- ⚙️ 기어 시스템 애니메이션

## 🚀 성능 특징

- **하드웨어 가속**: CanvasKit 기반 GPU 렌더링
- **60FPS 애니메이션**: `requestAnimationFrame` 기반 최적화
- **메모리 효율성**: 자동 리스너 정리 및 애니메이션 취소
- **타입 안전성**: 완전한 TypeScript 지원
- **React 19 호환**: 최신 React 기능 지원

## 📱 모바일 호환성

React Native와 동일한 API를 제공하므로, 웹에서 개발한 애니메이션을 모바일 앱에서도 동일하게 사용할 수 있습니다.

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactDom from "eslint-plugin-react-dom";
import reactX from "eslint-plugin-react-x";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
