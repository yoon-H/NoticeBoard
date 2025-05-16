import mysql from "mysql2/promise";
import { config } from "../config/config.js";

const { database } = config;

const createPool = (db) => {
  const pool = mysql.createPool({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const originQuery = pool.query;

  pool.query = (sql, params) => {
    console.log(
      `Executing query: ${sql} ${params ? `, ${JSON.stringify(params)}` : ``}`
    );
    return originQuery.call(pool, sql, params);
  };

  return pool;
};

const pool = createPool(database);

export default pool;
