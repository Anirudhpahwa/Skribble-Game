"use client";

import { useState } from 'react';

interface DrawingToolbarProps {
  color: string;
  onColorChange: (c: string) => void;
  brushSize: number;
  onBrushSizeChange: (s: number) => void;
  isEraser: boolean;
  onToggleEraser: () => void;
  onClear: () => void;
  onUndo: () => void;
}

const colors = [
  '#000000', // black
  '#FFFFFF', // white
  '#FF0000', // red
  '#FFA500', // orange
  '#FFFF00', // yellow
  '#00FF00', // green
  '#0000FF', // blue
  '#800080', // purple
];

export default function DrawingToolbar({
  color,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  isEraser,
  onToggleEraser,
  onClear,
  onUndo
}: DrawingToolbarProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 flex flex-wrap items-center gap-3">
      {/* Color palette */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-300">Color:</span>
        {colors.map(c => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
             className={`w-8 h-8 rounded border-2 ${color === c ? 'border-yellow-400' : 'border-gray-500'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Brush size slider */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-300">Size:</span>
        <input
          type="range"
          min={1}
          max={20}
          value={brushSize}
          onChange={e => onBrushSizeChange(Number(e.target.value))}
          className="w-24"
        />
        <span className="w-4 text-center font-mono">{brushSize}</span>
      </div>

      {/* Tools */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleEraser}
          className={`px-3 py-1.5 text-sm font-medium rounded ${isEraser ? 'bg-yellow-500 text-white' : 'bg-gray-600 text-gray-200'} hover:${isEraser ? 'bg-yellow-600' : 'bg-gray-500'}`}
        >
          Eraser
        </button>
        <button
          onClick={onUndo}
          className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Undo
        </button>
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
