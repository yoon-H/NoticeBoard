import pool from "../../database.js";
import SQL_COMMENT_QUERIES from "./comment.queries.js";

export const getComments = async (postId) => {
  const comments = await pool.query(SQL_COMMENT_QUERIES.GET_COMMENTS, [postId]);

  return comments;
};

export const createComment = async (author, content, postId) => {
  await pool.query(SQL_COMMENT_QUERIES.CREATE_COMMENT, [
    author,
    content,
    postId,
  ]);
};

export const editComment = async (content, id, author) => {
  await pool.query(SQL_COMMENT_QUERIES.EDIT_COMMENT, [author, content, id]);
};

export const deleteComment = async (id, author) => {
  await pool.query(SQL_COMMENT_QUERIES.DELETE_COMMENT, [id, author]);
};
