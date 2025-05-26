import pool from "../../database.js";
import SQL_COMMENT_QUERIES from "./comment.queries.js";

export const getComments = async (postId) => {
  const [rows] = await pool.query(SQL_COMMENT_QUERIES.GET_COMMENTS, [postId]);

  return rows;
};

export const createComment = async ({ author, content, postId }) => {
  await pool.query(SQL_COMMENT_QUERIES.CREATE_COMMENT, [
    author,
    content,
    postId,
  ]);
};

export const editComment = async ({ id, content, author }) => {
  const [row] = await pool.query(SQL_COMMENT_QUERIES.EDIT_COMMENT, [
    content,
    id,
    author,
  ]);

  return row;
};

export const deleteComment = async ({ id, author }) => {
  const [row] = await pool.query(SQL_COMMENT_QUERIES.DELETE_COMMENT, [
    id,
    author,
  ]);

  return row;
};

export const getUpdateTime = async (id) => {
  const [row] = await pool.query(SQL_COMMENT_QUERIES.GET_UPDATE_TIME, [id]);

  return row[0];
};
