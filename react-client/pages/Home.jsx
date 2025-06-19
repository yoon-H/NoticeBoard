import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../css/home.css";

export default function Home() {
  const [postDatas, setPostDatas] = useState([]);

  useEffect(() => {
    axios
      .get("/api/posts")
      .then((res) => {
        setPostDatas(res.data);
        console.log(res);
      })
      .catch((err) => console.error(err));
  }, []);

  let posts;
  if (postDatas) {
    posts = postDatas.map((data) => {
      return (
        <div className="post">
          <p className="number">{data.id}</p>
          <Link to="/detail" className="title">
            {data.title}
          </Link>
          <p className="author">{data.author}</p>
        </div>
      );
    });
  }

  return (
    <>
      <Link to="/post">글쓰기</Link>
      <div id="post-list">
        <div className="post" id="info">
          <p className="number">번호</p>
          <p className="title">제목</p>
          <p className="author">저자</p>
        </div>
        <div id="post-container">
          {posts}
        </div>
      </div>
    </>
  );
}
