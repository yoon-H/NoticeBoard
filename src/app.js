import express from "express";
import { config } from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";

const app = express();
const HOST = config.server.host;
const PORT = config.server.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", [authRoutes, postRoutes]);

app.listen(PORT, HOST, () => {
  console.log(HOST, PORT, "서버가 열렸습니다.");
});
