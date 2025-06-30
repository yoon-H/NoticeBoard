import privateApi from "./api/privateInstance.js";
import optionalApi from "./api/optionalnstance.js";

export async function checkUser(isOptional = false) {
  let api;
  if (isOptional) api = optionalApi;
  else api = privateApi;
  const res = await api.get("/auth/profile");
  return res.data;
}
