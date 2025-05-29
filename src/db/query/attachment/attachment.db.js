import SQL_ATTACHMENT_QUERIES from "./attachment.queries.js";

export const saveTempAttachment = async ({
  userId,
  originalName,
  storedName,
  url,
}) => {
  await pool.query(SQL_ATTACHMENT_QUERIES.SAVE_TEMP_ATTACHMENT, [
    userId,
    originalName,
    storedName,
    url,
  ]);
};
