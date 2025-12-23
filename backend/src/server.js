require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const { initWebSocket } = require("./ws/socket");
const leaderboardRoutes = require("./routes/leaderboard");
const { connectProducer } = require("./kafka/producer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check (very important for Render)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// REST routes
app.use("/api/leaderboard", leaderboardRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
initWebSocket(server);
 
// after initWebSocket(server)
connectProducer();  

// Export server (useful for testing)
module.exports = server;
