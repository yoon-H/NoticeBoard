import { Link, NavLink, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axios.instance.js";

import styles from "../css/home.module.css";
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
        const res = await api.get("/posts");
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
      <div className={styles["board-container"]}>
        <div className={styles["board-header"]}>
          <Link to="/post" className={styles["write-btn"]}>
            글쓰기
          </Link>
        </div>
        <div className={styles["post-list"]}>
          <div className={styles["post"]}>
            <p className={styles["number"]}>번호</p>
            <p className={styles["title"]}>제목</p>
            <p className={styles["author"]}>저자</p>
          </div>
          <PostList list={groups[activePage - 1] || []} />
        </div>
      </div>
      <Page totalPages={groups.length} currentPage={activePage} />
    </>
  );
}
