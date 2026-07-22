import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";

import roomRoutes from "./routes/roomRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../frontend");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", (req, res) => {
  res.status(501).json({
    message: "아직 구현되지 않은 API입니다.",
  });
});

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.status || 500).json({
    message: error.message || "서버 오류가 발생했습니다.",
  });
});

io.on("connection", (socket) => {
  console.log(`소켓 연결: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`소켓 연결 종료: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
});
