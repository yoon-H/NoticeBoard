import { createContext, useEffect, useState } from "react";
import { checkUser } from "../utils/checkUser.js";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [ user, setUser ] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await checkUser(true);

        if (!data || !data.user) throw new Error("유저 정보가 없습니다.");

        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setIsChecked(true);
      }
    };

    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isChecked }}>
      {children}
    </UserContext.Provider>
  );
}
