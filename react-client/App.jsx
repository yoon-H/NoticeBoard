import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Detail from "./pages/Detail.jsx";
import Post from "./pages/Post.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Nav from "./components/Nav.jsx";
import { useEffect } from "react";
import { setNavigate } from "./utils/navigate.js";
import { UserProvider } from "./contexts/UserContext.jsx";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, []);

  return (
    <>
      <UserProvider>
        <Nav />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/mypage" element={<Mypage/>} /> TODO */}
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/post" element={<Post />} />
          <Route path="/post/:id" element={<Post />} />
        </Routes>
      </UserProvider>
    </>
  );
}
