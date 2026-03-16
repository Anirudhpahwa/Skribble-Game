interface ChatMessage {
  id: number;
  text: string;
  isCorrect: boolean;
}
interface ChatPanelProps {
  messages: ChatMessage[];
}

export default function ChatPanel({ messages }: ChatPanelProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg w-64 p-4 flex flex-col h-96">
      <h2 className="text-lg font-semibold text-center mb-3">Chat</h2>
      <div className="flex-1 overflow-y-auto mb-3 space-y-2">
        {messages.map(m => (
          <div key={m.id} className={`p-2 rounded ${m.isCorrect ? 'bg-green-900/20' : 'bg-gray-900/20'}`}>
            <span className="block text-sm">{m.text}</span>
          </div>
        ))}
        <div className="h-4" aria-live="polite"></div>
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          placeholder="Type a guess..."
          className="flex-1 px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
