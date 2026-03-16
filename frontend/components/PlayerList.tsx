interface Player {
  id: number;
  username: string;
  score: number;
  isDrawing: boolean;
}

interface PlayerListProps {
  players: Player[];
  currentPlayerId: number;
}

export default function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Players</h2>
      <div className="space-y-2">
        {players.map(player => (
          <div 
            key={player.id} 
            className={`flex items-center p-2 rounded ${player.id === currentPlayerId ? 'bg-blue-50' : 'bg-transparent'}`}
          >
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="ml-2 flex-1 text-sm font-medium">{player.username}</span>
            <span className="text-sm font-bold text-gray-600">{player.score}</span>
            {player.isDrawing && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-500 text-white rounded">Drawing</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
