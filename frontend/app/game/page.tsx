"use client";

import GameHeader from '@/components/GameHeader';
import PlayerList from '@/components/PlayerList';
import Canvas from '@/components/Canvas';
import ChatPanel from '@/components/ChatPanel';
import DrawingToolbar from '@/components/DrawingToolbar';
import { useState, useCallback } from 'react';

type Point = { x: number; y: number };
type Stroke = {
  points: Point[];
  color: string;
  size: number;
};

export default function GameScreen() {
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [word, setWord] = useState('_____');
  const [players, setPlayers] = useState([
    { id: 1, name: 'Alex', score: 10 },
    { id: 2, name: 'Sam', score: 5 },
    { id: 3, name: 'You', score: 0, isDrawing: true },
  ]);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'hi', isCorrect: false },
    { id: 2, text: 'gg', isCorrect: false },
    { id: 3, text: 'nice drawing', isCorrect: true },
  ]);

  // Drawing state
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [currentSize, setCurrentSize] = useState<number>(3);
  const [toolMode, setToolMode] = useState<'brush' | 'eraser'>('brush');
  const [brushColor, setBrushColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(3);

  // Drawing event handlers
  const handleStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentStroke([{ x, y }]);
    // When starting a stroke, determine the color based on toolMode
    setCurrentColor(toolMode === 'eraser' ? '#ffffff' : brushColor);
    setCurrentSize(brushSize);
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentStroke.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentStroke(prev => [...prev, { x, y }]);
  };

  const handleEnd = () => {
    if (currentStroke.length === 0) return;
    // Save the current stroke to history
    setStrokes(prev => [
      ...prev,
      {
        points: [...currentStroke],
        color: currentColor,
        size: currentSize,
      }
    ]);
    setCurrentStroke([]);
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke([]);
  };

  const handleUndo = () => {
    setStrokes(prev => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  };

  // When brushColor changes, update the state (but not the current stroke if drawing)
  // When toolMode changes, we don't need to update anything until next stroke

  return (
    <div className="min-h-screen flex flex-col">
      <GameHeader
        round={round}
        timeLeft={timeLeft}
        word={word}
      />

      <div className="flex-1 flex p-4 gap-4">
        <PlayerList players={players} />

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <Canvas
              width={800}
              height={500}
              strokes={strokes}
              currentStroke={currentStroke}
              currentColor={currentColor}
              currentSize={currentSize}
              onDrawingStart={handleStart}
              onDrawingMove={handleMove}
              onDrawingEnd={handleEnd}
            />
          </div>
        </div>

        <ChatPanel messages={chatMessages} />
      </div>

      <DrawingToolbar
        color={brushColor}
        onColorChange={setBrushColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        isEraser={toolMode === 'eraser'}
        onToggleEraser={() => setToolMode(prev => (prev === 'brush' ? 'eraser' : 'brush'))}
        onClear={handleClear}
        onUndo={handleUndo}
      />
    </div>
  );
}
