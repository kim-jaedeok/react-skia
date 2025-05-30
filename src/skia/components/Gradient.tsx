import React from 'react';

export interface LinearGradientProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  colors: string[];
  children?: React.ReactNode;
}

export interface RadialGradientProps {
  center: { x: number; y: number };
  radius: number;
  colors: string[];
  children?: React.ReactNode;
}

export function LinearGradient({ start, end, colors, children }: LinearGradientProps) {
  return React.createElement('skia-linear-gradient', { 
    start, 
    end, 
    colors 
  }, children);
}

export function RadialGradient({ center, radius, colors, children }: RadialGradientProps) {
  return React.createElement('skia-radial-gradient', { 
    center, 
    radius, 
    colors 
  }, children);
}
