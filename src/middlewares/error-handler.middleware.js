import { config } from "../config/config.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

  switch (err.code) {
    case "ER_DUP_ENTRY": // 데이터 중복 문제
      const match = err.message.match(/for key '(.+?)'/);
      let field = match[1].split(".")[1] ?? "(알 수 없음)";

      field = config.column[field] ?? field;
      
      return res
        .status(400)
        .json({ message: `이미 존재하는 ${field}입니다.`, field: field });
  }

  return res.status(500).json({ message: err.message });
};

export default errorHandlerMiddleware;
