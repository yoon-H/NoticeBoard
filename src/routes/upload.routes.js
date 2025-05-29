import { Router } from "express";
import multerMiddleware from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/upload/image", multerMiddleware, async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const imageUrl = `/uploads/images/${year}/${month}/${day}/`;

    return res.status(200).json({ imageUrl: imageUrl + req.file.filename });
  } catch (err) {
    next(err);
  }
});

export default router;
