const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: allowedOrigin, methods: ["GET", "POST"] }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

const io = require("socket.io")(server, {
  cors: { origin: allowedOrigin, methods: ["GET", "POST"] },
});

// Track active call pairs so disconnect only notifies the right peer
const activeCalls = new Map();

app.get("/health", (req, res) => {
  res.json({ status: "ok", connections: io.engine.clientsCount });
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    const peerId = activeCalls.get(socket.id);
    if (peerId) {
      io.to(peerId).emit("callEnded");
      activeCalls.delete(peerId);
    }
    activeCalls.delete(socket.id);
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    if (!userToCall || !signalData || typeof userToCall !== "string") return;
    const safeName = typeof name === "string" ? name.slice(0, 50).trim() : "Anonymous";
    activeCalls.set(socket.id, userToCall);
    activeCalls.set(userToCall, socket.id);
    io.to(userToCall).emit("callUser", { signal: signalData, from, name: safeName });
  });

  socket.on("answerCall", (data) => {
    if (!data?.to || !data?.signal || typeof data.to !== "string") return;
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("leaveCall", () => {
    const peerId = activeCalls.get(socket.id);
    if (peerId) {
      io.to(peerId).emit("callEnded");
      activeCalls.delete(peerId);
    }
    activeCalls.delete(socket.id);
  });
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
