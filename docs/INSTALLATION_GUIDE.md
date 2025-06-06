#### 1. Installation & Setup

Currently in development. Clone and build from source:

```bash
# Clone the repository
git clone https://github.com/your-username/react-skia.git
cd react-skia

# Install dependencies and build
npm install react-skia

# Copy the WASM file to your project (automatic in most cases)
npx react-skia setup
```

The setup command will automatically copy `canvaskit.wasm` to your project's `public` directory.

#### 3. No Configuration Required! 🎉

React Skia automatically handles everything for you:

1. **Auto Directory Creation**: Creates `public` folder if it doesn't exist
2. **Auto WASM Copy**: Copies `canvaskit.wasm` during package installation
3. **Smart Path Detection**: Looks for WASM files in multiple locations
4. **CDN Fallback**: Falls back to CDN if local files aren't found
5. **Zero Configuration**: Just install and start coding!

#### 4. Manual Setup (If Needed)

If automatic setup doesn't work, use the CLI tool:

```bash
# This will create a public directory if it doesn't exist
# and copy canvaskit.wasm to it
npx react-skia setup
```

Or manually copy the WASM file:

```bash
# Create public directory if it doesn't exist
mkdir -p public

# Copy canvaskit.wasm to your public directory
cp node_modules/react-skia/dist/canvaskit.wasm public/
```

#### 5. Advanced Configuration (Optional)

For custom WASM paths, use the configuration API:

```tsx
import { Canvas } from "react-skia";

const OPTIONS = {
  canvasKitPath: (file: string) => `/custom-path/${file}`,
};

const App() => {
  return (
    <Canvas width={400} height={300} options={OPTIONS}>
      {/* Your Skia components */}
    </Canvas>
  );
}
```
