import { Router } from "express";

const router = Router();
const rooms = [];
let nextRoomId = 1;

//전체 조회
router.get("/", (req, res) => {
  res.json({
    rooms,
  });
});

//특정 조회
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const room = rooms.find((room) => {
    return room.id === id;
  });

  if (!room) {
    return res.status(404).json({
      message: "토론방을 찾을 수 없습니다.",
    });
  }

  res.json(room);
});

//생성
router.post("/", (req, res) => {
  const { topic, candidateA, candidateB, description } = req.body;

  if (!topic || !candidateA || !candidateB) {
    return res.status(400).json({
      message: "토론 주제와 두 캐릭터는 필수 입니다",
    });
  }
  const room = {
    id: nextRoomId++,
    topic,
    candidateA,
    candidateB,
    description: description || "",
    participantCount: 0,
    voteCountA: 0,
    voteCountB: 0,
    persuadedCount: 0,
  };

  rooms.push(room);

  res.status(201).json(room);
});

// 전체 수정
router.put("/:roomId", (req, res) => {
  const roomId = Number(req.params.roomId);

  const roomIndex = rooms.findIndex((room) => {
    return room.id === roomId;
  });

  if (roomIndex === -1) {
    return res.status(404).json({
      message: "토론방을 찾을 수 없습니다.",
    });
  }

  const { topic, candidateA, candidateB, description } = req.body;

  if (!topic || !candidateA || !candidateB) {
    return res.status(400).json({
      message: "토론 주제와 두 캐릭터는 필수입니다.",
    });
  }

  const updatedRoom = {
    ...rooms[roomIndex],
    topic,
    candidateA,
    candidateB,
    description: description || "",
  };

  rooms[roomIndex] = updatedRoom;

  res.json(updatedRoom);
});

// 일부 수정
router.patch("/:roomId", (req, res) => {
  const roomId = Number(req.params.roomId);

  const room = rooms.find((room) => {
    return room.id === roomId;
  });

  if (!room) {
    return res.status(404).json({
      message: "토론방을 찾을 수 없습니다.",
    });
  }

  const { topic, candidateA, candidateB, description } = req.body;

  if (
    topic === undefined &&
    candidateA === undefined &&
    candidateB === undefined &&
    description === undefined
  ) {
    return res.status(400).json({
      message: "수정할 값을 하나 이상 보내주세요.",
    });
  }

  if (topic !== undefined) {
    room.topic = topic;
  }

  if (candidateA !== undefined) {
    room.candidateA = candidateA;
  }

  if (candidateB !== undefined) {
    room.candidateB = candidateB;
  }

  if (description !== undefined) {
    room.description = description;
  }

  res.json(room);
});

router.delete("/:roomId", (req, res) => {
  const roomId = Number(req.params.roomId);

  const roomIndex = rooms.findIndex((room) => {
    return room.id === roomId;
  });

  if (roomIndex === -1) {
    return res.status(404).json({
      message: "토론방을 찾을 수 없습니다.",
    });
  }
  rooms.splice(roomIndex, 1);

  res.status(204).send();
});

export default router;
