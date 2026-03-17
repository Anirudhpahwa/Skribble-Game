"use client";

import GameHeader from '@/components/GameHeader';
import PlayerList from '@/components/PlayerList';
import Canvas from '@/components/Canvas';
import ChatPanel from '@/components/ChatPanel';
import DrawingToolbar from '@/components/DrawingToolbar';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';

type Point = { x: number; y: number };
type Stroke = {
  points: Point[];
  color: string;
  size: number;
};

interface Player {
  id: string;
  name: string;
  score: number;
  isDrawing?: boolean;
}

export default function GameScreen() {
  // Hooks MUST be called at the top level
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [word, setWord] = useState('_____');
  const [players, setPlayers] = useState<Player[]>([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [hostId, setHostId] = useState('');
  const [status, setStatus] = useState<'lobby' | 'playing' | 'finished'>('lobby');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Drawing state
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [currentSize, setCurrentSize] = useState<number>(3);
  const [toolMode, setToolMode] = useState<'brush' | 'eraser'>('brush');
  const [brushColor, setBrushColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(3);
   
  // For multiplayer room tracking (not used for drawing sync yet)
  const [roomCode, setRoomCode] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [playerId, setPlayerId] = useState<string>('');

  // Drawing event handlers
  const handleStart = React.useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentStroke([{ x, y }]);
    // When starting a stroke, determine the color based on toolMode
    setCurrentColor(toolMode === 'eraser' ? '#ffffff' : brushColor);
    setCurrentSize(brushSize);
  }, [toolMode, brushColor, brushSize]);

  const handleMove = React.useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentStroke.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentStroke(prev => [...prev, { x, y }]);
  }, [currentStroke]);

  const handleEnd = React.useCallback(() => {
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
  }, [currentColor, currentSize]);

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

  // Load initial data from localStorage or query params
  useEffect(() => {
    // Try to get roomCode from query params (when coming from lobby)
    const paramRoomCode = searchParams.get('roomCode');
    if (paramRoomCode) {
      setRoomCode(paramRoomCode);
    }
    
    // Try to get username and playerId from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedPlayerId = localStorage.getItem('playerId');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    }
    
    // Fetch room info if we have a roomCode
    if (roomCode) {
      fetchRoomInfo();
    }
  }, [searchParams, roomCode]);

  // Poll for room updates every 3 seconds
  useEffect(() => {
    if (!roomCode) return;
    const interval = setInterval(fetchRoomInfo, 3000);
    return () => clearInterval(interval);
  }, [roomCode]);

  const fetchRoomInfo = async () => {
    if (!roomCode) return;
    setIsLoading(true);
    try {
      const response = await api.getRoom(roomCode);
      setPlayers(response.players);
      setHostId(response.hostId);
      setStatus(response.status);
      
      // Update local username if not set (should already be set)
      if (!username && response.players.length > 0) {
        // Find our player by ID if we have playerId
        if (playerId) {
          const player = response.players.find((p: { id: string }) => p.id === playerId);
          if (player) {
            setUsername(player.username);
            localStorage.setItem('username', player.username);
          }
        } else {
          // If we don't have playerId, take the first player (should not happen in practice)
          setUsername(response.players[0].username);
          localStorage.setItem('username', response.players[0].username);
          setPlayerId(response.players[0].id);
          localStorage.setItem('playerId', response.players[0].id);
        }
      }
      
      // If game started, we're already in the game screen
      // In a full implementation, we'd handle game logic here
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Failed to fetch room info: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && players.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Scribble Arena</h1>
          <p className="mt-4">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Scribble Arena</h1>
          <p className="mt-4">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

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
          <div className="w-[800px] h-[500px] bg-white rounded-xl shadow-lg p-4">
            <Canvas
              width={800}
              height={500}
              brushSize={brushSize}
              strokes={strokes}
              currentStroke={currentStroke}
              currentColor={currentColor}
              currentSize={currentSize}
              toolMode={toolMode}
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
