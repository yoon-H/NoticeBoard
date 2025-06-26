import axios from "axios";
import { BASE_URL } from "./auth.js";


const publicInstance = axios.create({
  baseURL: BASE_URL,
});

export default publicInstance;