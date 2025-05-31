import { useState } from "react";

import { SkiaProvider } from "../react-skia";
import "./App.css";
import { type DemoItem, Sidebar } from "./components/Sidebar";
import { DEMO_ITEMS } from "./components/demos";

function App() {
  const [selectedDemo, setSelectedDemo] = useState(DEMO_ITEMS[0].id);

  const CurrentDemo = DEMO_ITEMS.find(
    (item: DemoItem) => item.id === selectedDemo,
  )?.Component;

  return (
    <div className="app-container">
      <SkiaProvider>
        <Sidebar
          demoItems={DEMO_ITEMS}
          activeDemo={selectedDemo}
          onDemoSelect={setSelectedDemo}
        />
        <main className="main-content">
          <div className="demo-container">{CurrentDemo && <CurrentDemo />}</div>
        </main>
      </SkiaProvider>
    </div>
  );
}

export default App;
