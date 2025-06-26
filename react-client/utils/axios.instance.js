import axios from "axios";
import { navigate } from "./navigate.js";

const instance = axios.create({
  baseURL: "api",
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    //401 인증 에러
    if (err.response?.status === 401 && originalRequest.retry === false) {
      originalRequest.retyr = true;

      try {
        await getNewAccessToken();

        return instance(originalRequest);
      } catch (err) {
        console.log("토큰 재발급 실패");

        navigate("/login");
      }
    }

    return Promise.reject(err);
  }
);

async function getNewAccessToken() {
  await instance.post("/auth/refresh");
}

export default instance;