const SQL_COMMENT_QUERIES = {
  GET_COMMENTS:
    "SELECT id, author, content, create_dt FROM comments WHERE post_id = ?",
  CREATE_COMMENT:
    "INSERT INTO comments (author, content, post_id) VALUES (?,?,?)",
  EDIT_COMMENT: "UPDATE comments SET content = ? WHERE id = ? AND author = ?",
  DELETE_POST: "DELETE FROM comments WHERE id = ? AND author = ?",
};

export default SQL_COMMENT_QUERIES;
