import axios from "axios";
import { BASE_URL } from "./constants.js";

const optionalInstance = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;

optionalInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    //401 인증 에러
    if (err.response?.status === 401 && !isRefreshing) {
      isRefreshing = true;
      try {
        await getNewAccessToken(true);

        return optionalInstance(originalRequest);
      } catch (err) {
        console.log("토큰 재발급 실패");
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default optionalInstance;
