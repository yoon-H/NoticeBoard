import pool from "../../database.js";
import SQL_IMAGE_QUERIES from "./image.queries.js";

export const getImages = async (postId) => {
  const [rows] = await pool.query(SQL_IMAGE_QUERIES.GET_IMAGES_BY_POSTS, [
    postId,
  ]);

  return rows;
};

export const saveTempImage = async ({ userId, name, url }) => {
  await pool.query(SQL_IMAGE_QUERIES.SAVE_TEMP_IMAGE, [userId, name, url]);
};

export const saveImage = async ({ postId, id }) => {
  await pool.query(SQL_IMAGE_QUERIES.SAVE_IMAGE, [postId, id]);
};

export const softDeleteImage = async (id) => {
  await pool.query(SQL_IMAGE_QUERIES.SOFT_DELETE_IMAGE, [id]);
};
