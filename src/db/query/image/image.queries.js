const SQL_IMAGE_QUERIES = {
  GET_IMAGES_BY_POSTS:
    "SELECT id, stored_name AS name, url FROM images WHERE post_id = ? AND is_deleted = FALSE",
  GET_TEMP_IMAGES:
    "SELECT id, stored_name AS name, url FROM images WHERE post_id IS NULL AND user_id = ?",
  SAVE_TEMP_IMAGE:
    "INSERT INTO images (user_id, stored_name, url) VALUES (?,?,?)",
  SAVE_IMAGE: "UPDATE images SET post_id = ?, is_temp = FALSE WHERE id = ?",
  DELETE_TEMP_IMAGE: "DELETE FROM images WHERE id = ? AND is_temp = TRUE",
  SOFT_DELETE_IMAGES:
    "UPDATE images SET is_deleted = TRUE, delete_dt = CURRENT_TIMESTAMP WHERE post_id = ?",
};

export default SQL_IMAGE_QUERIES;
