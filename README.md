# React Skia Web

React Native Skia를 웹 브라우저에서 사용할 수 있도록 포팅한 라이브러리입니다.

## 🚀 주요 특징

- **고성능 렌더링**: Google의 CanvasKit을 기반으로 한 하드웨어 가속 그래픽
- **React Native 호환**: React Native Skia와 유사한 API 제공
- **TypeScript 지원**: 완전한 타입 안정성
- **웹 최적화**: 브라우저 환경에 최적화된 구현

## 📦 설치

```bash
pnpm install
```

## 🎯 사용법

### 기본 설정

```tsx
import { SkiaProvider, SkiaCanvas, Rect, Circle, Text } from './skia';

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

- ✅ 기본 도형 렌더링 (Rect, Circle)
- ✅ 텍스트 렌더링
- ✅ 패스 그리기 (SVG 호환)
- ✅ 그룹화 및 투명도
- ✅ TypeScript 타입 지원
- 🚧 이미지 로딩 (구현 예정)
- 🚧 애니메이션 (구현 예정)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

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
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
