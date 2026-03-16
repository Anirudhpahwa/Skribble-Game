interface GameHeaderProps {
  round: number;
  timeLeft: number;
  word: string;
}

export default function GameHeader({ round, timeLeft, word }: GameHeaderProps) {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  return (
    <div className="bg-gray-800 text-white px-6 py-4">
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-bold">Round {round}</div>
        <div className="text-2xl font-mono">{mins}:{secs}</div>
        <div className="text-lg">{word}</div>
      </div>
    </div>
  );
}
