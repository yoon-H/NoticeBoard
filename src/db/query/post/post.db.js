import pool from "../../database.js";
import SQL_COMMENT_QUERIES from "../comment/comment.queries.js";
import SQL_POST_QUERIES from "./post.queries.js";
import SQL_IMAGE_QUERIES from "../image/image.queries.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { getImageList } from "../../../utils/getImageList.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getAllPosts = async () => {
  const [rows] = await pool.query(SQL_POST_QUERIES.GET_ALL_POSTS);

  return rows;
};

export const createPostWithImages = async ({ title, author, content }) => {
  const tran = await pool.getConnection();
  await tran.beginTransaction();

  let result = false;

  if (tran) {
    try {
      // 글 저장
      const [postResult] = await tran.query(SQL_POST_QUERIES.CREATE_POST, [
        title,
        author,
        content,
      ]);
      const postId = postResult.insertId;

      const list = getImageList(content);

      // 임시 이미지 불러오기
      const [tempImages] = await tran.query(SQL_IMAGE_QUERIES.GET_TEMP_IMAGES, [
        author,
      ]);

      // 이미지 확인
      for (const img of tempImages) {
        if (!list.includes(img.url)) {
          // 안 쓰이면
          // 로컬 파일 삭제
          const filePath = path.join(__dirname, "../../../../public", img.url);
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

export const getPost = async (id) => {
  const [row] = await pool.query(SQL_POST_QUERIES.GET_POST, [id]);

  console.log(row);

  return row[0];
};

export const editPost = async ({ title, content, id, author }) => {
  const [row] = await pool.query(SQL_POST_QUERIES.EDIT_POST, [
    title,
    content,
    id,
    author,
  ]);

  return row;
};

export const deletePost = async ({ id, author }) => {
  const tran = await pool.getConnection();
  await tran.beginTransaction();

  let result = false;

  if (tran) {
    try {
      await tran.query(SQL_POST_QUERIES.DELETE_POST, [id, author]);
      await tran.query(SQL_COMMENT_QUERIES.DELETE_COMMENTS_BY_POST_ID, [id]);
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
