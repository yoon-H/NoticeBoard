import privateApi from "./api/privateInstance.js";
import optionaApi from "./api/optionalnstance.js";

export async function checkUser(isPrivate = true) {
  let api;
  if (isPrivate) api = privateApi;
  else api = optionaApi;
  const res = await api.get("/auth/profile");
  return res.data;
}
