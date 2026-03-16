# Scribble Arena

A real-time multiplayer drawing and guessing game similar to Skribbl.io.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS, HTML5 Canvas, Socket.IO client
- **Backend**: Python FastAPI, WebSockets (Socket.IO), Pydantic, async architecture
- **Database**: PostgreSQL
- **Cache / Realtime State**: Redis
- **Infrastructure**: Docker, Docker Compose

## Project Structure

```
scribble-arena/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── docker-compose.yml
├── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed
- Node.js (for development outside Docker, optional)
- Python (for development outside Docker, optional)

### Running with Docker (Recommended for Development)

1. Copy the example environment file and adjust if needed:
   ```bash
   cp .env.example .env
   ```

2. Start the services:
   ```bash
   docker compose up --build
   ```

3. The frontend will be available at [http://localhost:3000](http://localhost:3000)
   The backend API will be available at [http://localhost:8000](http://localhost:8000)

### Verifying the Setup

After running `docker compose up`:

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. You should see the "Scribble Arena" heading and a "Create Room" button.
3. Click the "Create Room" button.
4. Check the browser's developer console (F12) for the response from the backend:
   ```json
   {
     "message": "backend connected"
   }
   ```

## Architecture Overview

- The frontend (Next.js) runs on port 3000 and communicates with the backend via REST API (and later WebSockets).
- The backend (FastAPI) runs on port 8000 and provides API endpoints and WebSocket connections.
- PostgreSQL stores persistent data (users, rooms, matches, scores).
- Redis stores real-time state (active rooms, players, game state).

## Next Steps (Future Development)

- Implement room creation and joining (REST API)
- Set up WebSocket connections for real-time communication
- Develop drawing canvas with synchronization
- Implement game logic (rounds, scoring, word selection)
- Add chat system for guessing
- Create leaderboard and spectator modes
