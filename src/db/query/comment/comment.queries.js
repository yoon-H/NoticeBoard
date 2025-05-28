const SQL_COMMENT_QUERIES = {
  GET_COMMENTS:
    "SELECT c.id AS id, u.name AS author, u.id AS authorId, c.content AS content, c.create_dt AS createTime, c.update_dt AS updateTime FROM comments AS c LEFT JOIN users AS u ON c.author = u.id WHERE c.post_id = ? AND c.is_deleted = FALSE",
  CREATE_COMMENT:
    "INSERT INTO comments (author, content, post_id) VALUES (?,?,?)",
  EDIT_COMMENT: "UPDATE comments SET content = ? WHERE id = ? AND author = ?",
  DELETE_COMMENT:
    "UPDATE comments SET is_deleted = TRUE WHERE id = ? AND author = ?",
  DELETE_COMMENTS_BY_POST_ID:
    "UPDATE comments SET is_deleted = TRUE WHERE post_id = ?",
  GET_UPDATE_TIME: "SELECT update_dt AS time FROM comments WHERE id =?",
};

export default SQL_COMMENT_QUERIES;
