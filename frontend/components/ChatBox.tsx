interface ChatMessage {
  id: number;
  username: string;
  text: string;
  isCorrect: boolean;
}

interface ChatBoxProps {
  messages: ChatMessage[];
  currentUserId: number;
}

export default function ChatBox({ messages, currentUserId }: ChatBoxProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-96 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Chat</h2>
      <div className="flex-1 overflow-y-auto mb-3 space-y-2">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`p-2 rounded ${msg.isCorrect ? 'bg-green-50' : 'bg-gray-50'}`}
          >
            <span className="font-medium text-gray-800">{msg.username}:</span>
            <span className="ml-2 text-gray-700">{msg.text}</span>
          </div>
        ))}
        {/* Auto-scroll to bottom would be implemented in later steps */}
        <div className="h-4" aria-live="polite"></div>
      </div>
      
      {/* Chat Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your guess..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
