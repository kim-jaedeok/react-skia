import React from 'react';
import type { PathProps } from '../types';

export function Path({ path, color = '#000000', strokeWidth = 1, style = 'fill' }: PathProps) {
  return React.createElement('skia-path', { 
    path, 
    color, 
    strokeWidth, 
    style 
  });
}
