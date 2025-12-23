“The bot uses deterministic heuristics: immediate win detection, opponent block, and center-column prioritization for strategic play.

🧠 Why This Is Strong Backend Code

✔ Clean event-driven architecture
✔ Stateless message handling
✔ Safe reconnection support
✔ Bot integration without blocking
✔ Broadcast scoped by gameId
✔ Clear separation of concerns

🧠 Why This Is High-Quality Backend Code

✔ Centralized game lifecycle
✔ Deterministic turn handling
✔ Bot seamlessly integrated
✔ Correct win/draw transitions
✔ Clean reconnection timeout logic
✔ Safe in-memory state handling

🔁 Event Flow (You Can Explain This Confidently)

JOIN_QUEUE → matchmaking

GAME_START → board + turn

MAKE_MOVE → validate + update

GAME_UPDATE → broadcast

Bot auto-plays (if needed)

Disconnect → 30s timer

RECONNECT → resume state

matchmaking.js is small but very important, because it handles:
✔ Player queue
✔ 1v1 pairing
✔ 10-second bot fallback (explicit requirement)
✔ Clean role assignment (P1 / P2)

🧠 Why This Is a Clean Matchmaking Design

✔ No race conditions
✔ Deterministic pairing
✔ Exact 10s bot fallback
✔ No unnecessary complexity
✔ Easy to explain in interviews

🔁 Matchmaking Flow

Player joins

If someone waiting → pair instantly

Else → wait 10s

No player? → bot starts game

Player always becomes P1

Bot always P2


Game analytics are emitted asynchronously using Kafka, enabling decoupled, scalable processing of gameplay metrics such as win frequency and average game duration.

Kafka analytics runs locally using Docker and demonstrates event-driven architecture.

1️⃣ Add a short note in README (Kafka section)

Use this exact wording (you can copy it):

Kafka Analytics (Bonus)
The backend emits game lifecycle events (GAME_STARTED, MOVE_PLAYED, GAME_ENDED, PLAYER_DISCONNECTED) to a Kafka topic using KafkaJS.
A separate consumer processes these events asynchronously to compute analytics such as average game duration and most frequent winners.
Kafka is configured locally using Docker (Zookeeper + Kafka) to demonstrate a production-style, event-driven architecture.

Kafka is configured locally using Docker to demonstrate an event-driven analytics pipeline.
In production deployment (Render), Kafka is intentionally disabled to avoid tight coupling and external broker dependencies.










🎯 4 in a Row – Real-Time Multiplayer Game (Backend Heavy)

A real-time, backend-driven implementation of the classic 4 in a Row (Connect Four) game, supporting 1v1 multiplayer gameplay, AI bot fallback, reconnection handling, persistent leaderboard, and Kafka-based analytics.

This project demonstrates backend engineering concepts such as WebSockets, event-driven architecture, state management, and system scalability.

🚀 Features
🧍 Player Matchmaking

Users join with a username and enter a matchmaking queue.

If another player joins within 10 seconds, a 1v1 game starts.

If no opponent is found, a competitive bot is automatically assigned.

🧠 Competitive Bot

The bot uses deterministic heuristics:

Tries to win immediately if possible.

Blocks the opponent’s winning move.

Prefers center columns for strategic advantage.

Never plays random or invalid moves.

🌐 Real-Time Gameplay

Implemented using WebSockets.

Turn-based updates are pushed instantly to all connected players.

Game state is maintained in memory for active games.

🔄 Reconnection Support

If a player disconnects, they can rejoin the same game within 30 seconds.

If they fail to reconnect, the game is forfeited, and the opponent (or bot) wins.

🧾 Game State & Persistence

Active games are stored in-memory for fast access.

Completed games are stored in PostgreSQL.

Game duration, players, and winner are persisted.

🏅 Leaderboard

Tracks total wins per player.

Exposed via REST API.

Displayed on the frontend.

💥 Kafka Analytics (Bonus)

Game lifecycle events are emitted asynchronously to Kafka:

GAME_STARTED

MOVE_PLAYED

GAME_ENDED

PLAYER_DISCONNECTED

A separate Kafka consumer processes these events to compute:

Average game duration

Most frequent winners

Total games processed

Kafka is configured locally using Docker to simulate a real-world, decoupled analytics pipeline.

🛠 Tech Stack
Backend

Node.js

Express

WebSockets (ws)

PostgreSQL

Kafka (KafkaJS)

Docker (Kafka + Zookeeper)

Frontend

React (Vite)

WebSocket client

Minimal CSS (focus on functionality)

Deployment

Backend: Render

Frontend: Vercel

📁 Project Structure
connect4/
├── backend/
│   ├── src/
│   │   ├── game/        # Board, rules, bot logic
│   │   ├── ws/          # WebSocket & matchmaking
│   │   ├── kafka/       # Producer & consumer
│   │   ├── db/          # PostgreSQL setup & queries
│   │   ├── routes/      # REST APIs
│   │   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│
├── docker-compose.yml
├── README.md

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone <your-github-repo-url>
cd connect4

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

PORT=8000
DATABASE_URL=postgresql://user:password@host:port/dbname
NODE_ENV=development


Run backend:

npm run dev


Health check:

http://localhost:8000/health

3️⃣ PostgreSQL Setup

Run the schema:

CREATE TABLE games (
  id UUID PRIMARY KEY,
  player1 VARCHAR(100),
  player2 VARCHAR(100),
  winner VARCHAR(100),
  duration INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

4️⃣ Kafka Setup (Local)

Start Kafka & Zookeeper:

docker-compose up -d


Run analytics consumer:

cd backend
node src/kafka/consumer.js

5️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🌐 Live Demo

Frontend URL: <your-vercel-url>

Backend URL: <your-render-url>

📊 Architecture Highlights

WebSocket-based real-time communication

In-memory game state for low-latency gameplay

PostgreSQL persistence for completed games

Kafka-based event-driven analytics

Clean separation of concerns

🧠 Design Decisions

Heuristic-based bot instead of Minimax for performance and simplicity.

In-memory active games for fast real-time updates.

Kafka used only for analytics to avoid blocking gameplay.

Dockerized Kafka to simulate real production systems locally.

🏁 Conclusion

This project demonstrates how to build a scalable, real-time multiplayer backend system with clean architecture, event-driven analytics, and fault tolerance.
It closely mirrors real-world backend systems used in online games and collaborative platforms.

