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