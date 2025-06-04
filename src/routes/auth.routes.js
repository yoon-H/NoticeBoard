import { Router } from "express";
import { config } from "../config/config.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import {
  createUser,
  findUserById,
  findUserByLoginId,
} from "../db/query/user/user.db.js";
import { generateToken } from "../utils/token.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";

dotenv.config();

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

    const refreshToken = generateToken(user.id, true);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    const token = generateToken(user.id);
    res.cookie("authorization", `Bearer ${token}`, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 10,
    });

    return res.status(200).json({ message: "로그인이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

router.get("/auth/profile", authMiddleware, (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.post("/auth/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken)
      return res.status(401).json({ message: "토큰이 존재하지 않습니다." });

    const data = jwt.verify(refreshToken, process.env.REFRESH_KEY);

    const id = data.userId;

    const user = await findUserById(id);

    if (!user)
      return res.status(401).json({ message: "존재하지 않는 사용자입니다." });

    const newAccessToken = jwt.sign({ userId: user.id }, process.env.JWT_KEY, {
      expiresIn: "10m",
    });

    res.cookie("authorization", `Bearer ${newAccessToken}`, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 10,
    });

    return res.status(200).json({ message: "토큰을 재발급했습니다." });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Refresh Token 만료 또는 위조" });
  }
});

export default router;
