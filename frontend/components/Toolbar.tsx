"use client";

interface ToolbarProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  isEraserActive: boolean;
  onToggleEraser: () => void;
  onClearCanvas: () => void;
}

const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF',
  '#FFA500', '#800080', '#A52A2A', '#808080'
];

export default function Toolbar({ 
  currentColor, 
  onColorChange, 
  brushSize, 
  onBrushSizeChange, 
  isEraserActive, 
  onToggleEraser, 
  onClearCanvas 
}: ToolbarProps) {
  return (
    <div className="bg-white shadow-lg px-4 py-3 flex flex-wrap gap-3">
      {/* Color Picker */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600">Color:</span>
        {colors.map(color => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-6 h-6 rounded-full border-2 ${color === currentColor ? 'border-blue-500' : 'border-transparent'} bg-${color === '#FFFFFF' ? 'gray-200' : color}`}
          />
        ))}
      </div>
      
      {/* Brush Size */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Size:</span>
        <input
          type="range"
          min={1}
          max={20}
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="w-24"
        />
        <span className="w-4 text-center font-mono">{brushSize}</span>
      </div>
      
      {/* Tools */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleEraser}
          className={`px-3 py-1.5 text-sm font-medium rounded ${isEraserActive ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'} hover:${isEraserActive ? 'bg-yellow-600' : 'bg-gray-300'}`}
        >
          Eraser
        </button>
        <button
          onClick={onClearCanvas}
          className="px-3 py-1.5 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
