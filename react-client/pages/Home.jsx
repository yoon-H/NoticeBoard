import { Link, NavLink } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div>Hooooome</div>
      <Link to="/post">글쓰기</Link>
      <NavLink to="/detail">디테일</NavLink>
    </>
  );
}
