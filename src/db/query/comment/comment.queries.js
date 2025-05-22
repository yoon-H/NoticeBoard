const SQL_COMMENT_QUERIES = {
  GET_COMMENTS:
    "SELECT p.id AS post_id, c.id AS id, u.name AS author, u.id AS authorId, c.content AS content, c.create_dt AS createTime, c.update_dt AS updateTime FROM posts AS p LEFT JOIN comments AS c ON p.id = c.post_id LEFT JOIN users AS u ON c.author = u.id WHERE p.id = ?",
  CREATE_COMMENT:
    "INSERT INTO comments (author, content, post_id) VALUES (?,?,?)",
  EDIT_COMMENT: "UPDATE comments SET content = ? WHERE id = ? AND author = ?",
  DELETE_COMMENT: "DELETE FROM comments WHERE id = ? AND author = ?",
  GET_UPDATE_TIME: "SELECT update_dt AS time FROM comments WHERE id =?",
};

export default SQL_COMMENT_QUERIES;
