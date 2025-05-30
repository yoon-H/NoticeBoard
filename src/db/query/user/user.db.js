import pool from "../../database.js";
import SQL_USER_QUERIES from "./user.queries.js";

export const createUser = async ({name, id, password}) => {
  await pool.query(SQL_USER_QUERIES.CREATE_USER, [name, id, password]);
};

export const findUserByLoginId = async (id) => {
  const [row] = await pool.query(SQL_USER_QUERIES.FIND_USER_BY_LOGIN_ID, [id]);

  return row[0];
};

export const findUserById = async (id) => {
  const [row] = await pool.query(SQL_USER_QUERIES.FIND_USER_BY_ID, [id]);

  return row[0];
};
