import { randomUUID } from "node:crypto";

export default function registerChatSocket(io) {
  io.on("connection", (socket) => {
    console.log(`채팅 연결: ${socket.id}`);

    // 토론방 입장
    socket.on("join-room", (roomId) => {
      if (!roomId) {
        return;
      }

      const roomName = `room:${roomId}`;

      socket.join(roomName);

      console.log(`${socket.id}가 ${roomName}에 입장`);
    });

    // 메시지 전송
    socket.on("send-message", (message) => {
      const { roomId, userId, nickname, text } = message;

      if (!roomId || !userId || !nickname || !text?.trim()) {
        socket.emit("chat-error", {
          message: "메시지 정보가 올바르지 않습니다.",
        });

        return;
      }

      const chatMessage = {
        id: randomUUID(),
        roomId,
        userId,
        nickname,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };

      io.to(`room:${roomId}`).emit("receive-message", chatMessage);
    });

    socket.on("disconnect", () => {
      console.log(`채팅 연결 종료: ${socket.id}`);
    });
  });
}
