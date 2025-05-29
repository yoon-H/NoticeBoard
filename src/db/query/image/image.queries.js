const SQL_IMAGE_QUERIES = {
  GET_IMAGES_BY_POSTS:
    "SELECT id, stored_name AS name, url, FROM images WHERE post_id = ? AND is_deleted = FALSE",
  SAVE_TEMP_IMAGE:
    "INSERT INTO images (user_id, stored_name, url) VALUES (?,?,?)",
  SAVE_IMAGE: "UPDATE images SET post_id = ?, is_temp = FALSE WHERE id = ?",
  SOFT_DELETE_IMAGE:
    "UPDATE images SET is_deleted = TRUE, delete_dt = CURRENT_TIMESTAMP  WHERE id = ?",
};

export default SQL_IMAGE_QUERIES;
