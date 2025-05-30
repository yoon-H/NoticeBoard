const SQL_POST_QUERIES = {
  GET_ALL_POSTS:
    "SELECT p.id AS id, p.title AS title, u.name AS author, p.content AS content, p.create_dt AS createTime, p.update_dt AS updateTime FROM posts AS p LEFT JOIN users AS u ON p.author = u.id WHERE p.is_deleted = FALSE;",
  CREATE_POST: "INSERT INTO posts (title, author, content) VALUES (?,?,?)",
  GET_POST:
    "SELECT p.id AS id, p.title AS title, u.id AS userId, u.name AS author, p.content AS content, p.create_dt AS createTime, p.update_dt AS updateTime, p.is_deleted AS isDeleted FROM posts AS p LEFT JOIN users AS u ON p.author = u.id WHERE p.id = ?;",
  EDIT_POST:
    "UPDATE posts SET title = ?, content = ? WHERE id = ? AND author = ?",
  DELETE_POST: "UPDATE posts SET is_deleted = TRUE WHERE id = ? AND author =?",
};

export default SQL_POST_QUERIES;
