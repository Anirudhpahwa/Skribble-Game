"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/services/api';

export default function LobbyPage() {
  const pathname = usePathname();
  const router = useRouter();
  
  const roomCode = pathname.split('/')[2];
  
  const [username, setUsername] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [players, setPlayers] = useState<Array<{id: string; username: string; score: number; isHost: boolean}>>([]);
  const [hostId, setHostId] = useState('');
  const [status, setStatus] = useState<'lobby' | 'playing' | 'finished'>('lobby');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPlayerId = localStorage.getItem('playerId');
    if (storedUsername) setUsername(storedUsername);
    if (storedPlayerId) setPlayerId(storedPlayerId);
    
    fetchRoomInfo();
  }, [roomCode]);

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
      
      if (!username && response.players.length > 0) {
        if (playerId) {
           const player = response.players.find((p: { id: string; username: string; score: number; isHost: boolean }) => p.id === playerId);
          if (player) {
            setUsername(player.username);
            localStorage.setItem('username', player.username);
          }
        } else {
          setUsername(response.players[0].username);
          localStorage.setItem('username', response.players[0].username);
          setPlayerId(response.players[0].id);
          localStorage.setItem('playerId', response.players[0].id);
        }
      }
      
      if (response.status === 'playing') {
        router.push(`/game?roomCode=${roomCode}`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Failed to fetch room info: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!playerId) return;
    setIsLoading(true);
    try {
      await api.startGame(roomCode, playerId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError('Failed to start game: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!roomCode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Scribble Arena</h1>
          <p className="mt-4">Invalid room code</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && players.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Scribble Arena</h1>
          <p className="mt-4">Loading lobby...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6 bg-gray-800 rounded-xl shadow-xl p-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white">Scribble Arena</h1>
          <p className="text-gray-300">Room Code: {roomCode}</p>
        </div>
        
        {error && (
          <div className="p-3 mb-4 bg-red-900/20 border border-red-500 text-red-300 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center mb-2 text-white">Players</h2>
          <div className="space-y-2">
            {players.map((player) => (
              <div key={player.id} className={`flex items-center p-2 rounded ${player.isHost ? 'bg-yellow-900/20' : 'bg-gray-900/20'}`}>
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span className="ml-2 flex-1 text-sm">{player.username}</span>
                <span className="text-sm font-medium">{player.score}</span>
                {player.isHost && (
                  <span className="ml-2 px-1 py-0.5 text-xs bg-yellow-400">Host</span>
                )}
                {player.id === playerId && (
                  <span className="ml-2 px-1 py-0.5 text-xs bg-blue-400">You</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {status === 'lobby' && (
          <div className="mt-6">
            {hostId === playerId ? (
              <button
                onClick={handleStartGame}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Starting...' : 'Start Game'}
              </button>
            ) : (
              <p className="text-center text-gray-400">Waiting for host to start the game...</p>
            )}
          </div>
        )}
        
        {status === 'playing' && (
          <div className="text-center text-green-500 mt-4">
            Game is starting...
          </div>
        )}
      </div>
    </div>
  );
}
