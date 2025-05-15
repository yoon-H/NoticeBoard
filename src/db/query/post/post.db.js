import pool from "../../database.js";
import SQL_POST_QUERIES from "./post.queries.js";

export const getAllPosts = async () => {
  const posts = await pool.query(SQL_POST_QUERIES.GET_ALL_POSTS);

  return posts;
};

export const createPost = async (title, author, content) => {
  await pool.query(SQL_POST_QUERIES.CREATE_POST, [title, author, content]);
};

export const getPost = async (id) => {
  const post = await pool.query(SQL_POST_QUERIES.GET_POST, [id]);

  return post;
};

export const editPost = async (title, content, id, author) => {
  await pool.query(SQL_POST_QUERIES.EDIT_POST, [title, content, id, author]);
};

export const deletePost = async (id, author) => {
  await pool.query(SQL_POST_QUERIES.DELETE_POST, [id, author]);
};
