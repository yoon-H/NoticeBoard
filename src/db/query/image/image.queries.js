const SQL_IMAGE_QUERIES = {
  GET_IMAGES_BY_POSTS:
    "SELECT id, stored_name AS name, url, FROM images WHERE post_id = ? AND is_deleted = FALSE",
  SAVE_IMAGE: "INSERT INTO images (post_id, stored_name, url) VALUES (?,?,?)",
  SOFT_DELETE_IMAGE:
    "UPDATE images SET is_deleted = TRUE, delete_dt = CURRENT_TIMESTAMP  WHERE id = ?",
};

export default SQL_IMAGE_QUERIES;
