import axios from "axios";
import { BASE_URL, getNewAccessToken } from "./auth.js";

const optionalInstance = axios.create({
  baseURL: BASE_URL,
});

optionalInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    //401 인증 에러
    if (err.response?.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      try {
        await getNewAccessToken();

        return optionalInstance(originalRequest);
      } catch (err) {
        console.log("토큰 재발급 실패");
      }
    }

    return Promise.reject(err);
  }
);

export default optionalInstance;
