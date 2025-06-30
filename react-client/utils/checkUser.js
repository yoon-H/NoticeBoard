import privateApi from "./api/privateInstance.js";
import optionalApi from "./api/optionalnstance.js";

export async function checkUser(isPrivate = true) {
  console.log("checkuser");
  let api;
  if (isPrivate) api = privateApi;
  else api = optionalApi;
  const res = await api.get("/auth/profile");
  console.log(res);
  return res.data;
}
