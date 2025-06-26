import { Link, NavLink, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import privateApi from "../utils/api/privateInstance.js";
import publicApi from "../utils/api/publicInstance.js";

import styles from "../css/home.module.css";
import PostList from "../components/PostList.jsx";
import Page from "../components/Page.jsx";
import { checkUser } from "../utils/checkAuth.js";
import { navigate } from "../utils/navigate.js";

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
        const res = await publicApi.get("/posts");
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

  const handleWriteBtn = async () => {
    const data = await checkUser();

    if (!data || !data.user || !data.user.id) return;

    navigate("/post");
  };

  return (
    <>
      <div className={styles["board-container"]}>
        <div className={styles["board-header"]}>
          <button className={styles["write-btn"]} onClick={handleWriteBtn}>
            글쓰기
          </button>
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
