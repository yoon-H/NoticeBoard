import { Router } from "express";
import {
  multerAttachment,
  multerImage,
} from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { saveTempImage } from "../db/query/image/image.db.js";
import {
  getAttachmentById,
  saveTempAttachment,
  softDeleteAttachment,
} from "../db/query/attachment/attachment.db.js";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
      }

      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const attachmentUrl = `/uploads/attachments/${req.user.id}/${year}/${month}/${day}/`;

      const savedFiles = [];

      for (const file of req.files) {
        const obj = {
          userId: req.user.id,
          originalName: file.originalname,
          storedName: file.filename,
          url: attachmentUrl + file.filename,
        };

        const result = await saveTempAttachment(obj);

        if (result.insertId) {
          savedFiles.push({
            id: result.insertId,
            originalName: file.originalname,
            storedName: file.filename,
            url: attachmentUrl + file.filename,
          });
        }
      }

      return res.status(200).json({ files: savedFiles });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/upload/attachment/:attachmentId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const attachmentId = req.params.attachmentId;

      if (isNaN(attachmentId))
        return res.status(400).json({ message: "자료형을 확인해주세요." });

      await softDeleteAttachment(attachmentId);

      return res.status(200).json({ message: "파일이 삭제되었습니다." });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/download/:fileId", async (req, res, next) => {
  const fileId = req.params.fileId;

  const file = await getAttachmentById(fileId);

  const filePath = path.join(__dirname, "../", file.url);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("파일이 존재하지 않습니다.");
  }

  res.setHeader(
    "Content-Disposition",
    `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`
  );
  res.setHeader("Content-Type", "application/octet-stream");

  fs.createReadStream(filePath).pipe(res);
});

export default router;
