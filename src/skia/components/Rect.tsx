import React from 'react';
import type { RectProps } from '../types';

export function Rect({ x, y, width, height, color = '#000000', strokeWidth = 1, style = 'fill' }: RectProps) {
  return React.createElement('skia-rect', { 
    x, 
    y, 
    width, 
    height, 
    color, 
    strokeWidth, 
    style 
  });
}
