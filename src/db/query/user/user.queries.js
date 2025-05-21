const SQL_USER_QUERIES = {
  FIND_USER_BY_LOGIN_ID:
    "SELECT id, name, password FROM users WHERE login_id = ?",
  FIND_USER_BY_ID:
    "SELECT id, name, login_id, password FROM users WHERE id = ?",
  CREATE_USER: "INSERT INTO users (name, login_id, password) VALUES (?,?,?)",
};

export default SQL_USER_QUERIES;
