import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId, isRefresh = false) => {
  let token;

  if (isRefresh) {
    token = jwt.sign({ userId: userId }, process.env.REFRESH_KEY, {
      expiresIn: "7d",
    });
  } else {
    token = jwt.sign({ userId: userId }, process.env.JWT_KEY, {
      expiresIn: "10m",
    });
  }

  return token;
};
