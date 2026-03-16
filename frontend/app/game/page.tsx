"use client";

import GameHeader from '@/components/GameHeader';
import PlayerList from '@/components/PlayerList';
import Canvas from '@/components/Canvas';
import ChatPanel from '@/components/ChatPanel';
import DrawingToolbar from '@/components/DrawingToolbar';
import { useState } from 'react';

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
  const [drawColor, setDrawColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  const startDrawing = (x: number, y: number) => {
    console.log('start', x, y);
  };
  const drawMove = (x: number, y: number) => {
    console.log('draw', x, y);
  };
  const endDrawing = () => {
    console.log('end');
  };
  const clearCanvas = () => {
    console.log('canvas cleared');
  };

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
              color={drawColor}
              brushSize={brushSize}
              isEraser={isEraser}
              onDrawingStart={startDrawing}
              onDrawingMove={drawMove}
              onDrawingEnd={endDrawing}
              onClear={clearCanvas}
            />
          </div>
        </div>

        <ChatPanel messages={chatMessages} />
      </div>

      <DrawingToolbar
        color={drawColor}
        onColorChange={setDrawColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        isEraser={isEraser}
        onToggleEraser={setIsEraser}
        onClear={clearCanvas}
      />
    </div>
  );
}
