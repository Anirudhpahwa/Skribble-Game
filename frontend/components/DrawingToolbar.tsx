interface DrawingToolbarProps {
  color: string;
  onColorChange: (c: string) => void;
  brushSize: number;
  onBrushSizeChange: (s: number) => void;
  isEraser: boolean;
  onToggleEraser: () => void;
  onClear: () => void;
}

const palette = [
  '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF',
  '#FFA500', '#800080', '#A52A2A', '#808080',
];

export default function DrawingToolbar({
  color,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  isEraser,
  onToggleEraser,
  onClear,
}: DrawingToolbarProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg px-4 py-3 flex flex-wrap gap-3">
      {/* Color palette */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-300">Color:</span>
        {palette.map(c => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-yellow-400' : 'border-transparent'} bg-${c === '#FFFFFF' ? 'gray-200' : c}`}
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
          onClick={onClear}
          className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
