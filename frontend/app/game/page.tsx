"use client";

import Canvas from '@/components/Canvas';
import Toolbar from '@/components/Toolbar';
import PlayerList from '@/components/PlayerList';
import ChatBox from '@/components/ChatBox';
import GameHeader from '@/components/GameHeader';

export default function GameScreen() {
  // Mock data for UI implementation - will be replaced with real state in later steps
  const mockPlayer = { id: 1, username: 'Player1', score: 0, isDrawing: false };
  const mockPlayers = [
    { id: 1, username: 'Player1', score: 120, isDrawing: true },
    { id: 2, username: 'Player2', score: 80, isDrawing: false },
    { id: 3, username: 'Player3', score: 50, isDrawing: false }
  ];
  const mockWordHint = "_ _ _ _ _"; // e.g., "apple" would be "_ _ _ _ _"
  const mockTimeLeft = 45;
  const mockChatMessages = [
    { id: 1, username: 'Player2', text: 'is it a fruit?', isCorrect: false },
    { id: 2, username: 'Player3', text: 'apple?', isCorrect: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Game Header */}
      <GameHeader 
        timeLeft={mockTimeLeft} 
        wordHint={mockWordHint} 
        currentPlayer={mockPlayer.username}
      />
      
      {/* Main Game Area */}
      <div className="flex-1 flex p-4 gap-4">
        {/* Canvas Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg shadow p-4">
            <Canvas 
              isDrawing={mockPlayer.isDrawing} 
              onDrawingStart={() => {}} 
              onDrawingMove={() => {}} 
              onDrawingEnd={() => {}} 
            />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-64 space-y-4">
          <PlayerList players={mockPlayers} currentPlayerId={mockPlayer.id} />
          <ChatBox messages={mockChatMessages} currentUserId={mockPlayer.id} />
        </div>
      </div>
      
      {/* Toolbar */}
      <Toolbar 
        currentColor="#000000" 
        onColorChange={() => {}} 
        brushSize={3} 
        onBrushSizeChange={() => {}} 
        isEraserActive={false} 
        onToggleEraser={() => {}} 
        onClearCanvas={() => {}} 
      />
    </div>
  );
}
