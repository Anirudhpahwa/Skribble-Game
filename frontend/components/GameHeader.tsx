interface GameHeaderProps {
  timeLeft: number;
  wordHint: string;
  currentPlayer: string;
}

export default function GameHeader({ timeLeft, wordHint, currentPlayer }: GameHeaderProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className="bg-white shadow px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">Scribble Arena</h2>
          <p className="text-sm text-gray-500">Round in progress</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{timeString}</div>
          <p className="text-xs text-gray-500">Time Left</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono text-gray-600 letter-wider">{wordHint}</div>
          <p className="text-xs text-gray-500">Word</p>
        </div>
      </div>
    </div>
  );
}
