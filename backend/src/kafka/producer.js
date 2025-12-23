// const { Kafka } = require("kafkajs");

// const kafka = new Kafka({
//   clientId: "connect4-backend",
//   brokers: ["localhost:9092"]
// });

// const producer = kafka.producer();

// async function connectProducer() {
//   await producer.connect();
//   console.log("✅ Kafka Producer connected");
// }

// async function emitEvent(type, payload) {
//   try {
//     await producer.send({
//       topic: "game-events",
//       messages: [
//         {
//           value: JSON.stringify({
//             type,
//             payload,
//             timestamp: Date.now()
//           })
//         }
//       ]
//     });
//   } catch (err) {
//     console.error("❌ Kafka produce error:", err.message);
//   }
// }

// module.exports = {
//   connectProducer,
//   emitEvent
// };



const { Kafka } = require("kafkajs");

const ENABLE_KAFKA = process.env.ENABLE_KAFKA === "true";

let producer = null;

if (ENABLE_KAFKA) {
  const kafka = new Kafka({
    clientId: "connect4-backend",
    brokers: ["localhost:9092"],
  });

  producer = kafka.producer();
}

async function connectProducer() {
  if (!ENABLE_KAFKA) {
    console.log("⚠️ Kafka disabled (production mode)");
    return;
  }

  await producer.connect();
  console.log("✅ Kafka Producer connected");
}

async function emitEvent(type, payload) {
  if (!ENABLE_KAFKA) return;

  try {
    await producer.send({
      topic: "game-events",
      messages: [
        {
          value: JSON.stringify({
            type,
            payload,
            timestamp: Date.now(),
          }),
        },
      ],
    });
  } catch (err) {
    console.error("Kafka produce error:", err.message);
  }
}

module.exports = {
  connectProducer,
  emitEvent,
};
