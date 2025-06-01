# React Skia Web Port

React Native Skia의 웹 포팅 버전입니다.

## 🚀 주요 특징

- **고성능 렌더링**: Google의 CanvasKit을 기반으로 한 하드웨어 가속 그래픽
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

## 🚀 성능 특징

- **하드웨어 가속**: CanvasKit 기반 GPU 렌더링
- **60FPS 애니메이션**: `requestAnimationFrame` 기반 최적화
- **메모리 효율성**: 자동 리스너 정리 및 애니메이션 취소
- **타입 안전성**: 완전한 TypeScript 지원
- **React 19 호환**: 최신 React 기능 지원

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
