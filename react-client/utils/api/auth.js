export const BASE_URL = "api";

export async function getNewAccessToken() {
  await privateInstance.post("/auth/refresh");
}
