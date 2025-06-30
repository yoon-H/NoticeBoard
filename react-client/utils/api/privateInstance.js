import axios from "axios";
import { navigate } from "../navigate.js";
import { BASE_URL, getNewAccessToken } from "./auth.js";

const privateInstance = axios.create({
  baseURL: BASE_URL,
});

privateInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = originalRequest || err.config;

    //401 인증 에러
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await getNewAccessToken();ew

        return privateInstance(originalRequest);
      } catch (err) {
        console.log("토큰 재발급 실패");

        navigate("/login");
      }
    }

    return Promise.reject(err);
  }
);

export default privateInstance;
