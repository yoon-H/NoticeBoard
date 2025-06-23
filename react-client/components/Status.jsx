import { NavLink } from "react-router-dom";

export default function Status({ isLoggedIn }) {
  let btn1;
  let btn2;

  if (isLoggedIn) {
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
