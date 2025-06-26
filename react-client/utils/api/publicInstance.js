import axios from "axios";

const publicInstance = axios.create({
  baseURL: "api",
});

export default publicInstance;