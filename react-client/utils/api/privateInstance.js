import axios from "axios";
import { navigate } from "../navigate.js";

const privateInstance = axios.create({
  baseURL: "api",
});

privateInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    //401 인증 에러
    if (err.response?.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      try {
        await getNewAccessToken();

        return privateInstance(originalRequest);
      } catch (err) {
        console.log("토큰 재발급 실패");

        navigate("/login");
      }
    }

    return Promise.reject(err);
  }
);

async function getNewAccessToken() {
  await privateInstance.post("/auth/refresh");
}

export default privateInstance;
