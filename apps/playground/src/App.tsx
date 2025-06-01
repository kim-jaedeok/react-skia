import { useState } from "react";

import { SkiaProvider } from "@react-skia/core";

import "./App.css";
import { type DemoItem, Sidebar } from "./components/Sidebar";
import { DEMO_ITEMS } from "./components/demos";

const App = () => {
  const [selectedDemo, setSelectedDemo] = useState(DEMO_ITEMS[0].id);

  const CurrentDemo = DEMO_ITEMS.find(
    (item: DemoItem) => item.id === selectedDemo,
  )?.Component;

  return (
    <div className="app-container">
      <SkiaProvider>
        <Sidebar
          activeDemo={selectedDemo}
          demoItems={DEMO_ITEMS}
          onDemoSelect={setSelectedDemo}
        />
        <main className="main-content">
          <div className="demo-container">
            {CurrentDemo && <CurrentDemo key={selectedDemo} />}
          </div>
        </main>
      </SkiaProvider>
    </div>
  );
};

export default App;
