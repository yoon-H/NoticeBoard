import axios from "axios";
import { navigate } from "../navigate.js";
import { BASE_URL } from "./constants.js";
import { getNewAccessToken } from "./auth.js";

const privateInstance = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;

privateInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    //401 인증 에러
    if (err.response?.status === 401 && !isRefreshing) {
      isRefreshing = true;
      try {
        await getNewAccessToken();

        return privateInstance(originalRequest);
      } catch (err) {
        console.log("토큰 재발급 실패");

        navigate("/login");
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default privateInstance;
