import { NavLink } from "react-router-dom";

import styles from "../css/nav.module.css";
import { useUser } from "../hooks/useUser.js";

function Status() {
  const { user } = useUser();

  const btn1 = <NavLink to="/sign-up">회원가입</NavLink>;
  const btn2 = <NavLink to="/login">로그인</NavLink>;

  return (
    <>
      {!user ? (
        <>
          <li>{btn1}</li>
          <li>{btn2}</li>
        </>
      ) : (
        <p>{user.name}님, 환영합니다.</p>
      )}
    </>
  );
}

export default function Nav() {
  return (
    <div>
      <h1 className={styles["my-title"]}>
        <NavLink to="/">게시판</NavLink>
      </h1>
      <ul>
        <Status />
      </ul>
    </div>
  );
}
