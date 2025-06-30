import { NavLink } from "react-router-dom";
import { useState } from "react";

import styles from "../css/nav.module.css";
import { useUser } from "../hooks/useUser.js";

function Status() {
  const { user } = useUser();

  let btn1;
  let btn2;

  if (!user) {
    btn1 = <NavLink to="/sign-up">회원가입</NavLink>;
    btn2 = <NavLink to="/login">로그인</NavLink>;
  } else {
    btn1 = <NavLink to="/mypage">마이페이지</NavLink>;
    btn2 = <NavLink to="/">로그아웃</NavLink>;
  }

  return (
    <>
      <li>{btn1}</li>
      <li>{btn2}</li>
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
