const SQL_COMMENT_QUERIES = {
  GET_COMMENTS:
    "SELECT p.id AS post_id, c.id AS id, u.name AS author, c.content AS content, c.create_dt AS time FROM posts AS p LEFT JOIN comments AS c ON p.id = c.post_id LEFT JOIN users AS u ON c.author = u.id WHERE p.id = ?",
  CREATE_COMMENT:
    "INSERT INTO comments (author, content, post_id) VALUES (?,?,?)",
  EDIT_COMMENT: "UPDATE comments SET content = ? WHERE id = ? AND author = ?",
  DELETE_COMMENT: "DELETE FROM comments WHERE id = ? AND author = ?",
};

export default SQL_COMMENT_QUERIES;
