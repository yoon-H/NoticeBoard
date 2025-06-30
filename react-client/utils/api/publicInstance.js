import axios from "axios";
import { BASE_URL } from "./constants.js";

const publicInstance = axios.create({
  baseURL: BASE_URL,
});

export default publicInstance;
