import { randomUUID } from "crypto";

export default function registerChatSocket(io) {
  io.on("connection", (socket) => {
    console.log(`접속: ${socket.id}`);

    // 토론방 참가
    socket.on("join-room", (roomId) => {
      socket.join(String(roomId));
      console.log(`${socket.id} -> ${roomId} 입장`);
    });

    // 메시지 전송
    socket.on("send-message", (data) => {
      const message = {
        id: randomUUID(),
        roomId: data.roomId,
        nickname: data.nickname,
        text: data.text,
        createdAt: new Date().toISOString(),
      };

      // 같은 방에 있는 사람들에게 전달
      io.to(String(data.roomId)).emit("receive-message", message);
    });

    // 연결 종료
    socket.on("disconnect", () => {
      console.log(`연결 종료: ${socket.id}`);
    });
  });
}
