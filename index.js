import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

let latestESPData = {}; // 🔁 Store latest received data

app.get("/", (req, res) => {
  res.send("Socket.IO Server Running ✅");
});

// 📤 Return latest ESP data as JSON
app.get("/data", (req, res) => {
  res.json(latestESPData);
});

io.on("connection", (socket) => {
  console.log("🚀 Client connected");

  socket.on("esp-data", (data) => {
    console.log("📡 Received from ESP/Client:", data);
    latestESPData = data; // 🔁 Save it

    // 🔁 Optional: Respond with command
    socket.emit("cmd-to-esp", { led: "on" });
  });
});

server.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
