import { Router } from "express";

const router = Router();

const users = [];
let nextUserId = 1;

router.post("/signup", (req, res) => {
  const { nickname, email, password } = req.body;

  if (!nickname || !email || !password) {
    return res.status(400).json({
      message: "닉네임, 이메일, 비밀번호는 필수입니다.",
    });
  }

  const emailExists = users.some((existingUser) => {
    return existingUser.email === email;
  });

  if (emailExists) {
    return res.status(409).json({
      message: "이미 사용 중인 이메일입니다.",
    });
  }

  const user = {
    id: nextUserId++,
    nickname,
    email,
    password,
  };
  users.push(user);

  res.status(201).json({
    id: user.id,
    nickname: user.nickname,
    email: user.email,
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "이메일과 비밀번호는 필수입니다.",
    });
  }

  const user = users.find((existingUser) => {
    return existingUser.email === email;
  });

  if (!user || user.password !== password) {
    return res.status(401).json({
      message: "이메일 또는 비밀번호가 올바르지 않습니다.",
    });
  }

  res.json({
    id: user.id,
    nickname: user.nickname,
    email: user.email,
  });
});

export default router;
