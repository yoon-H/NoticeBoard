import { Router } from "express";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";
import { createUser, findUserByLoginId } from "../db/query/user/user.db.js";

const router = Router();

// 회원가입 API
router.post("/auth/signup", async (req, res, next) => {
  try {
    const { id, password, confirmPassword, name } = req.body;

    if (!id || !password || !confirmPassword || !name)
      return res.status(400).json({ message: "요소를 전부 적어주세요." });

    // 유효성 검사
    if (!config.reg.id_reg.test(id))
      return res.status(400).json({ message: "아이디가 적합하지 않습니다." });
    if (!config.reg.pw_reg.test(password))
      return res.status(400).json({ message: "비밀번호를 다시 입력해주세요." });
    if (!config.reg.name_reg.test(name))
      return res.status(400).json({ message: "중복된 닉네임입니다." });
    new Error("유효하지 않는 아이디입니다.");
    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ message: "비밀번호와 확인 비밀번호가 일치하지 않습니다." });

    // 비밀번호 해싱
    const hashedPw = await bcrypt.hash(password, 10);

    // 데이터 저장
    await createUser(name, id, hashedPw);
    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const { id, password } = req.body;

    if (!id || !password)
      return res.status(400).json({ message: "요소를 전부 적어주세요." });

    // 가입된 사용자 확인
    const user = await findUserByLoginId(id);

    if (!user)
      return res
        .status(400)
        .json({ message: "유저 정보가 존재하지 않습니다." });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });

    return res.status(200).json({ message: "로그인이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
