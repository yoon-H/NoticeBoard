import { Router } from "express";
import {
  multerAttachment,
  multerImage,
} from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { saveTempImage } from "../db/query/image/image.db.js";
import { saveTempAttachment } from "../db/query/attachment/attachment.db.js";

const router = Router();

router.post(
  "/upload/image",
  authMiddleware,
  multerImage,
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
      }

      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const imageUrl = `/uploads/images/${req.user.id}/${year}/${month}/${day}/`;
      const url = imageUrl + req.file.filename;

      const obj = {
        userId: req.user.id,
        name: req.file.filename,
        url: url,
      };

      await saveTempImage(obj);

      return res.status(200).json({ imageUrl: url });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/upload/attachment",
  authMiddleware,
  multerAttachment,
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
      }

      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const attachmentUrl = `/uploads/attachments/${req.user.id}/${year}/${month}/${day}/`;
      const url = attachmentUrl + req.file.filename;

      const obj = {
        userId: req.user.id,
        originalName: req.file.originalname,
        storedName: req.file.filename,
        url: url,
      };

      await saveTempAttachment(obj);

      return res.status(200).json({ attachmentUrl: url });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
