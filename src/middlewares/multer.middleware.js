import multer from "multer";
import { v4 as uuidv4 } from "uuid";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imageStorage = multer.diskStorage({
  destination: function (req, file, done) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const uploadPath = path.join(
      __dirname,
      `../uploads/images/${req.user.id}/${year}/${month}/${day}`
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    done(null, uploadPath);
  },
  filename: function (req, file, done) {
    const ext = path.extname(file.originalname);
    const name = uuidv4() + ext;

    done(null, name);
  },
});

export const multerImage = multer({ storage: imageStorage }).single("image");

const attachmentStorage = multer.diskStorage({
  destination: function (req, file, done) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const uploadPath = path.join(
      __dirname,
      `../uploads/attachments/${req.user.id}/${year}/${month}/${day}`
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    done(null, uploadPath);
  },
  filename: function (req, file, done) {
    const ext = path.extname(file.originalname);
    const name = uuidv4() + ext;

    done(null, name);
  },
});

export const multerAttachment = multer({ storage: attachmentStorage }).array(
  "attachment",
  10
);
