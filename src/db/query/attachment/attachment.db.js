import SQL_ATTACHMENT_QUERIES from "./attachment.queries.js";
import pool from "../../database.js";

export const getAttachmentsByPost = async (postId) => {
  const [rows] = await pool.query(
    SQL_ATTACHMENT_QUERIES.GET_ATTACHMENTS_BY_POST, [postId]
  );

  return rows;
};

export const saveTempAttachment = async ({
  userId,
  originalName,
  storedName,
  url,
}) => {
  const [row] = await pool.query(SQL_ATTACHMENT_QUERIES.SAVE_TEMP_ATTACHMENT, [
    userId,
    originalName,
    storedName,
    url,
  ]);

  return row;
};

export const softDeleteAttachment = async (id) => {
  await pool.query(SQL_ATTACHMENT_QUERIES.SOFT_DELETE_ATTACHMENT, [id]);
};
