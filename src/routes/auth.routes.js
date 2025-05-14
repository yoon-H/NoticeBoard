import { Router } from "express";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";
import { createUser, findUserByLoginId } from "../db/query/user/user.db.js";

const router = Router();

// 회원가입 API
router.post("/auth/signup", async (req, res) => {
  const { id, password, confirmPassword, name } = req.body;

  // 유효성 검사
  if (!config.reg.id_reg.test(id)) new Error("아이디가 적합하지 않습니다.");
  if (!config.reg.pw_reg.test(password))
    new Error("비밀번호를 다시 입력해주세요.");
  if (!config.reg.pw_reg.test(name)) new Error("유효하지 않는 아이디입니다.");
  if (password === confirmPassword)
    new Error("비밀번호와 확인 비밀번호가 일치하지 않습니다.");

  // 비밀번호 해싱
  const hashedPw = bcrypt.hash(password, 10);

  // 데이터 저장
  await createUser(name, id, hashedPw);
  return res.status(201).json({ message: "회원가입이 완료되었습니다." });
});

router.post("/auth/login", async (req, res) => {
  const { id, password } = req.body;

  // 가입된 사용자 확인
  const user = await findUserByLoginId(id);

  if (!user)
    return res.status(400).json({ message: "유저 정보가 존재하지 않습니다." });

  if (!bcrypt.compare(password, user.password))
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });

  return res.status(200).json({ message: "로그인이 완료되었습니다." });
});

export default router;
