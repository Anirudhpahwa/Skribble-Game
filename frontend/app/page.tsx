'use client';

import { useState } from 'react';
import { api } from '../services/api';

export default function Home() {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateRoom = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const data = await api.test();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Scribble Arena
      </h1>
      <button
        onClick={handleCreateRoom}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        {loading ? 'Creating...' : 'Create Room'}
      </button>
      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg w-full max-w-xs">
          <h2 className="font-semibold mb-2">Response:</h2>
          <pre className="text-sm text-gray-800">{response}</pre>
        </div>
      )}
    </div>
  );
}
