import { Router } from "express";
import { config } from "../config/config.js";
import bcrypt from "bcrypt";
import { createUser, findUserByLoginId } from "../db/query/user/user.db.js";
import { generateToken } from "../utils/token.js";

const router = Router();

// 회원가입 API
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: "유저 회원가입"
 *     description: "서버에 가입 데이터를 보내 Post방식으로 저장 요청"
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - password
 *               - confirmPassword
 *               - name
 *             properties:
 *               id:
 *                 type: string
 *                 example: user123
 *               password:
 *                 type: string
 *                 example: password@123
 *               confirmPassword:
 *                 type: string
 *                 example: password@123
 *               name:
 *                 type: string
 *                 example: cool_user
 *     responses:
 *       201:
 *         description: 성공 메시지
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                     example : "회원가입이 완료되었습니다."
 */
router.post("/auth/signup", async (req, res, next) => {
  try {
    const { id, password, confirmPassword, name } = req.body ?? {};

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

    const obj = {
      name,
      id,
      password: hashedPw,
    };

    // 데이터 저장
    await createUser(obj);
    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

// 로그인 API
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: "유저 로그인"
 *     description: "서버에 로그인 데이터를 보내 Post방식으로 요청"
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - password
 *             properties:
 *               id:
 *                 type: string
 *                 example: user123
 *               password:
 *                 type: string
 *                 example: password@123
 *     responses:
 *       200:
 *         description: 성공 메시지
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                     example : "로그인이 완료되었습니다."
 */
router.post("/auth/login", async (req, res, next) => {
  try {
    const { id, password } = req.body ?? {};

    if (!id || !password)
      return res.status(400).json({ message: "요소를 전부 적어주세요." });

    // 유효성 검사
    if (!config.reg.id_reg.test(id))
      return res.status(400).json({ message: "아이디가 적합하지 않습니다." });
    if (!config.reg.pw_reg.test(password))
      return res.status(400).json({ message: "비밀번호를 다시 입력해주세요." });

    // 가입된 사용자 확인
    const user = await findUserByLoginId(id);

    if (!user)
      return res
        .status(404)
        .json({ message: "유저 정보가 존재하지 않습니다." });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });

    const token = generateToken(user.id);
    res.cookie("authorization", `Bearer ${token}`);

    return res.status(200).json({ message: "로그인이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
