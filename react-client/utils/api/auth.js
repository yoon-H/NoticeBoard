import privateApi from "./privateInstance.js";

export const BASE_URL = "api";

export async function getNewAccessToken() {
  await privateApi.post("/auth/refresh");
}
