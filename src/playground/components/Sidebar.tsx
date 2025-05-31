import React from "react";

export interface DemoItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  Component: React.ComponentType;
}

interface SidebarProps {
  demoItems: DemoItem[];
  activeDemo: string;
  onDemoSelect: (demoId: string) => void;
}

export function Sidebar({ demoItems, activeDemo, onDemoSelect }: SidebarProps) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>React Skia Web</h2>
        <p>데모 선택</p>
      </div>

      <div className="sidebar-content">
        {demoItems.map(item => (
          <button
            key={item.id}
            className={`demo-item ${activeDemo === item.id ? "active" : ""}`}
            onClick={() => onDemoSelect(item.id)}
          >
            <span className="demo-icon">{item.icon}</span>
            <div className="demo-info">
              <span className="demo-title">{item.title}</span>
              <span className="demo-description">{item.description}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <p>Built with ❤️</p>
        <p>React 19 + CanvasKit</p>
      </div>
    </div>
  );
}
