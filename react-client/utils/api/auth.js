import privateApi from "./privateInstance.js";
import optionalApi from "./optionalnstance.js";

export async function getNewAccessToken(isOptional = false) {
  let api;
  if (isOptional) api = optionalApi;
  else api = privateApi;
  await api.post("/auth/refresh");
}
