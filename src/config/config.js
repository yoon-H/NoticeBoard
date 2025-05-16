import { ID_REG, NAME_REG, PW_REG } from "../validation/auth.validation.js";
import { columns } from "./column.js";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  HOST,
  PORT,
} from "./env.js";

export const config = {
  server: {
    host: HOST,
    port: PORT,
  },
  database: {
    name: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
  },
  reg: {
    id_reg: ID_REG,
    pw_reg: PW_REG,
    name_reg: NAME_REG,
  },
  column: columns,
};
