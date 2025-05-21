import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserById } from "../db/query/user/user.db.js";

dotenv.config();
export const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    if (!authorization)
      return res.status(401).json({ message: "토큰이 존재하지 않습니다." });

    const [tokenType, token] = authorization.split(" ");

    if (tokenType !== "Bearer")
      return res
        .status(401)
        .json({ message: "토큰 타입이 일치하지 않습니다." });

    const data = jwt.verify(token, process.env.JWT_KEY);
    const id = data.id;

    const user = await findUserById(id);

    req.user = user;

    next();
  } catch (err) {
    res.clearCookie("authorization");

    // jwt.verify에서 일어난 에러 처리
    switch (err.name) {
      case "TokenExpiredError":
        return res.status(401).json({ message: "토큰이 만료되었습니다." });
      case "JsonWebTokenError":
        return res.status(401).json({ message: "토큰이 조작되었습니다." });

      default:
        return res
          .status(401)
          .json({ message: error.message ?? "비정상적인 요청입니다." });
    }
  }
};
