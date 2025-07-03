const SQL_ATTACHMENT_QUERIES = {
  GET_ATTACHMENTS_BY_POST:
    "SELECT id, original_name AS originalName, stored_name AS storedName, url FROM attachments WHERE post_id = ? AND is_deleted = FALSE",
  GET_ATTACHMENT_BY_ID:
    "SELECT id, original_name AS originalName, stored_name AS storedName, url FROM attachments WHERE id = ? AND is_deleted = FALSE",
  GET_TEMP_ATTACHMENTS:
    "SELECT id, original_name AS originalName, stored_name AS storedName, url FROM attachments WHERE post_id IS NULL AND user_id = ?",
  SAVE_TEMP_ATTACHMENT:
    "INSERT INTO attachments (user_id, original_name, stored_name, url) VALUES (?,?,?,?)",
  SAVE_ATTACHMENT:
    "UPDATE attachments SET post_id = ?, is_temp = FALSE WHERE id = ?",
  DELETE_TEMP_ATTACHMENT:
    "DELETE FROM attachments WHERE id = ? AND is_temp = TRUE",
  SOFT_DELETE_ATTACHMENT:
    "UPDATE attachments SET is_deleted = TRUE, delete_dt = CURRENT_TIMESTAMP WHERE id = ?",
};

export default SQL_ATTACHMENT_QUERIES;
