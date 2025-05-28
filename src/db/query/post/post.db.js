import pool from "../../database.js";
import SQL_COMMENT_QUERIES from "../comment/comment.queries.js";
import SQL_POST_QUERIES from "./post.queries.js";

export const getAllPosts = async () => {
  const [rows] = await pool.query(SQL_POST_QUERIES.GET_ALL_POSTS);

  return rows;
};

export const createPost = async ({ title, author, content }) => {
  const [row] = await pool.query(SQL_POST_QUERIES.CREATE_POST, [
    title,
    author,
    content,
  ]);

  return row;
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
