const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "connect4-analytics",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "analytics-group" });

const stats = {
  games: 0,
  totalDuration: 0,
  winners: {},
};

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "game-events", fromBeginning: true });

  console.log("📊 Kafka Analytics Consumer running...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());

      if (event.type === "GAME_ENDED") {
        stats.games += 1;
        stats.totalDuration += event.payload.duration;

        const winner = event.payload.winner;
        if (winner && winner !== "DRAW") {
          stats.winners[winner] = (stats.winners[winner] || 0) + 1;
        }

        console.log("📈 Analytics Update:", {
          avgGameDuration:
            Math.round(stats.totalDuration / stats.games) + " sec",
          topWinners: stats.winners
        });
      }
    }
  });
}

startConsumer();
