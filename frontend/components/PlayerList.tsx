interface Player {
  id: string;
  name: string;
  score: number;
  isDrawing?: boolean;
}
interface PlayerListProps {
  players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg w-64 p-4 space-y-3">
      <h2 className="text-lg font-semibold text-center mb-2">Players</h2>
      <div className="space-y-2">
        {players.map(p => (
          <div key={p.id} className={`flex items-center p-2 rounded ${p.isDrawing ? 'bg-yellow-900/20' : 'transparent'}`}>
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="ml-2 flex-1 text-sm">{p.name}</span>
            <span className="text-sm font-medium">{p.score}</span>
            {p.isDrawing && <span className="ml-2 px-1 py-0.5 text-xs bg-yellow-400">Drawing</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
