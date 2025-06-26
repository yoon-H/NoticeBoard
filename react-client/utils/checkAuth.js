import api from "./api/privateInstance.js";

export async function checkUser() {
  const res = await api.get("/auth/profile");
  return res.data;
}
