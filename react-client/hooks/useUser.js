import { useContext } from "react";
import { UserContext } from "../contexts/UserContext.js";

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserProvider와 함께 사용해주세요.");
  }
  return context;
}
