import express from "express";
import { config } from "./config/config.js";

import errorHandlerMiddleware from "./middlewares/error-handler.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import { specs, swaggerUi } from "./swagger/swagger.js";

const app = express();
const HOST = config.server.host;
const PORT = config.server.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", [authRoutes, postRoutes, commentRoutes]);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandlerMiddleware);

app.listen(PORT, HOST, () => {
  console.log(HOST, PORT, "서버가 열렸습니다.");
});
