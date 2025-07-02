import pool from "../../database.js";
import SQL_COMMENT_QUERIES from "../comment/comment.queries.js";
import SQL_POST_QUERIES from "./post.queries.js";
import SQL_IMAGE_QUERIES from "../image/image.queries.js";
import SQL_ATTACHMENT_QUERIES from "../attachment/attachment.queries.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { extractContentData } from "../../../utils/htmlParser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getAllPosts = async () => {
  const [rows] = await pool.query(SQL_POST_QUERIES.GET_ALL_POSTS);

  return rows;
};

export const createPost = async ({ title, author, content }) => {
  const tran = await pool.getConnection();
  await tran.beginTransaction();

  let result = {};

  if (tran) {
    try {
      // 글 저장
      const [postResult] = await tran.query(SQL_POST_QUERIES.CREATE_POST, [
        title,
        author,
        content,
      ]);
      const postId = postResult.insertId;

      const { imageList, fileList } = extractContentData(content);

      // 임시 이미지 불러오기
      const [tempImages] = await tran.query(SQL_IMAGE_QUERIES.GET_TEMP_IMAGES, [
        author,
      ]);

      // 이미지 확인
      for (const img of tempImages) {
        if (!imageList.includes(img.url)) {
          // 안 쓰이면
          // 로컬 파일 삭제
          const filePath = path.join(__dirname, "../uploads", img.url);
          fs.unlink(filePath, (err) => {
            if (err) console.error(`${filePath} 삭제 실패했습니다. :`, err);
          });

          // DB 삭제
          await tran.query(SQL_IMAGE_QUERIES.DELETE_TEMP_IMAGE, [img.id]);
        } else {
          // 쓰이면
          await tran.query(SQL_IMAGE_QUERIES.SAVE_IMAGE, [postId, img.id]);
        }
      }

      // 첨부파일 처리
      const [tempFiles] = await tran.query(
        SQL_ATTACHMENT_QUERIES.GET_TEMP_ATTACHMENTS,
        [author]
      );

      const fileNames = fileList.map((e) => e.name);

      for (const file of tempFiles) {
        if (!fileNames.includes(String(file.originalName))) {
          // 안 쓰이면
          // 로컬 파일 삭제
          const filePath = path.join(__dirname, file.url);
          fs.unlink(filePath, (err) => {
            if (err) console.error(`${filePath} 삭제 실패했습니다. :`, err);
          });

          // DB 삭제
          await tran.query(SQL_ATTACHMENT_QUERIES.DELETE_TEMP_ATTACHMENT, [
            file.id,
          ]);
        } else {
          // 쓰이면
          await tran.query(SQL_ATTACHMENT_QUERIES.SAVE_ATTACHMENT, [
            postId,
            file.id,
          ]);
        }
      }

      await tran.commit();

      result.insertId = postId;
      result.files = fileList;
    } catch (err) {
      console.error(`Transaction error : ${err.message}`);
      await tran.rollback();
    } finally {
      tran.release();
    }
  }

  return result;
};

export const getPost = async (id) => {
  const [row] = await pool.query(SQL_POST_QUERIES.GET_POST, [id]);

  return row[0];
};

export const editPost = async ({ title, content, id, author }, files) => {
  const tran = await pool.getConnection();
  await tran.beginTransaction();

  let result = false;

  if (tran) {
    try {
      // 글 업데이트
      await pool.query(SQL_POST_QUERIES.EDIT_POST, [
        title,
        content,
        id,
        author,
      ]);

      const list = extractContentData(content);

      // 기존 이미지 가져오기
      const [prevImages] = await tran.query(
        SQL_IMAGE_QUERIES.GET_IMAGES_BY_POST,
        [id]
      );

      // 삭제된 이미지 처리
      for (const img of prevImages) {
        if (!list.includes(img.url)) {
          // 안 쓰이면
          // 로컬 파일 삭제
          const filePath = path.join(__dirname, "../uploads", img.url);
          fs.unlink(filePath, (err) => {
            if (err) console.error(`${filePath} 삭제 실패했습니다. :`, err);
          });

          // DB 삭제
          await tran.query(SQL_IMAGE_QUERIES.SOFT_DELETE_IMAGE, [img.id]);
        }
      }

      // 임시 이미지 불러오기
      const [tempImages] = await tran.query(SQL_IMAGE_QUERIES.GET_TEMP_IMAGES, [
        author,
      ]);

      // 이미지 확인
      for (const img of tempImages) {
        if (!list.includes(img.url)) {
          // 안 쓰이면
          // 로컬 파일 삭제
          const filePath = path.join(__dirname, "../uploads", img.url);
          fs.unlink(filePath, (err) => {
            if (err) console.error(`${filePath} 삭제 실패했습니다. :`, err);
          });

          // DB 삭제
          await tran.query(SQL_IMAGE_QUERIES.DELETE_TEMP_IMAGE, [img.id]);
        } else {
          // 쓰이면

          await tran.query(SQL_IMAGE_QUERIES.SAVE_IMAGE, [id, img.id]);
        }
      }

      // 기존 파일 불러오기
      const [prevFiles] = await tran.query(
        SQL_ATTACHMENT_QUERIES.GET_ATTACHMENTS_BY_POST,
        [id]
      );

      // 삭제된 파일 처리
      for (const file of prevFiles) {
        if (!files.includes(String(file.id))) {
          // 안 쓰이면
          // 로컬 파일 삭제
          const filePath = path.join(__dirname, "../uploads", file.url);
          fs.unlink(filePath, (err) => {
            if (err) console.error(`${filePath} 삭제 실패했습니다. :`, err);
          });

          // DB 삭제
          await tran.query(SQL_ATTACHMENT_QUERIES.SOFT_DELETE_ATTACHMENT, [
            file.id,
          ]);
        }
      }

      // 임시 파일 불러오기
      const [tempFiles] = await tran.query(
        SQL_ATTACHMENT_QUERIES.GET_TEMP_ATTACHMENTS,
        [author]
      );

      // 파일 추가
      for (const file of tempFiles) {
        if (!files.includes(String(file.id))) {
          // 안 쓰이면
          // 로컬 파일 삭제
          const filePath = path.join(__dirname, "../uploads", file.url);
          fs.unlink(filePath, (err) => {
            if (err) console.error(`${filePath} 삭제 실패했습니다. :`, err);
          });

          // DB 삭제
          await tran.query(SQL_ATTACHMENT_QUERIES.DELETE_TEMP_ATTACHMENT, [
            file.id,
          ]);
        } else {
          // 쓰이면
          await tran.query(SQL_ATTACHMENT_QUERIES.SAVE_ATTACHMENT, [
            id,
            file.id,
          ]);
        }
      }

      await tran.commit();

      result = true;
    } catch (err) {
      console.error(`Transaction error : ${err.message}`);
      await tran.rollback();
    } finally {
      tran.release();
    }
  }

  return result;
};

export const deletePost = async ({ id, author }) => {
  const tran = await pool.getConnection();
  await tran.beginTransaction();

  let result = false;

  if (tran) {
    try {
      await tran.query(SQL_POST_QUERIES.DELETE_POST, [id, author]);
      await tran.query(SQL_COMMENT_QUERIES.DELETE_COMMENTS_BY_POST_ID, [id]);
      await tran.query(SQL_IMAGE_QUERIES.SOFT_DELETE_IMAGE, [id]);
      await tran.query(SQL_ATTACHMENT_QUERIES.SOFT_DELETE_ATTACHMENT, [id]);
      await tran.commit();

      result = true;
    } catch (err) {
      console.error(`Transaction error : ${err.message}`);
      await tran.rollback();
    } finally {
      tran.release();
    }
  }

  return result;
};
