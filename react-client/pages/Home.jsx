import { Link, NavLink, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "../css/home.css";
import PostList from "../components/PostList.jsx";
import Page from "../components/Page.jsx";

export default function Home() {
  const [postDatas, setPostDatas] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const param = parseInt(searchParams.get("page") || "1", 10);
    setActivePage(param);
  }, [searchParams]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get("/api/posts");
        setPostDatas(res.data.reverse());
      } catch (err) {
        console.log(err);
      }
    };

    getPosts();
  }, []);

  const groups = [];

  for (let i = 0; i < postDatas.length; i += 10) {
    groups.push(postDatas.slice(i, i + 10));
  }

  return (
    <>
      <div className="board-container">
        <div className="board-header">
          <Link to="/post" className="write-btn">
            글쓰기
          </Link>
        </div>
        <div className="post-list">
          <div className="post">
            <p className="number">번호</p>
            <p className="title">제목</p>
            <p className="author">저자</p>
          </div>
          <PostList list={groups[activePage - 1] || []} />
        </div>
      </div>
      <Page totalPages={groups.length} currentPage={activePage} />
    </>
  );
}
