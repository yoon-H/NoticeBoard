import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Detail from "./pages/Detail.jsx";
import Post from "./pages/Post.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Nav from "./components/Nav.jsx";
import { useEffect, useState } from "react";
import { setNavigate } from "./utils/navigate.js";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const changeStatus = (flag) => {
    setIsLoggedIn(flag);
  };

  useEffect(() => {
    setNavigate(navigate);
  }, []);

  return (
    <BrowserRouter>
      <Nav isLoggedIn={isLoggedIn} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login setIsLoggedIn={changeStatus} />} />
        {/* <Route path="/mypage" element={<Mypage/>} /> TODO */}
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </BrowserRouter>
  );
}
