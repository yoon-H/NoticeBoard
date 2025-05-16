import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "NoticeBoard",
      description:
        "Node.js Swaager swagger-jsdoc 방식 RestFul API 클라이언트 UI",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [path.join(dirname, "../routes/*.routes.js")],
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
