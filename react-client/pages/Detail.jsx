import { useParams, useSearchParams } from "react-router-dom";
import styles from "../css/detail.module.css";
import { useEffect, useState } from "react";
import getEffectiveDate from "../utils/getEffectiveDate.js";
import publicApi from "../utils/api/publicInstance.js";
import Page from "../components/Page.jsx";
import { useUser } from "../hooks/useUser.js";
import { navigate } from "../utils/navigate.js";
import { checkUser } from "../utils/checkUser.js";

const infos = {
  title: "",
  postTime: "",
  author: "",
  authorId: "",
  content: "",
};

export default function Detail() {
  const params = useParams();
  const postId = params.id;

  const [postInfo, setPostInfo] = useState(infos);
  const [comments, setComments] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [searchParams] = useSearchParams();
  const { user, setUser } = useUser();

  // 페이지 조회
  useEffect(() => {
    const param = parseInt(searchParams.get("page") || "1", 10);
    setActivePage(param);
  }, [searchParams]);

  // 글 조회
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await publicApi.get(`/posts/${postId}`);

        if (!res || !res.data) return;

        const post = res.data.post;

        if (!post) return;

        const { title, createTime, updateTime, author, content, userId } = post;

        setPostInfo({
          title: title,
          postTime: getEffectiveDate(createTime, updateTime),
          author: author,
          authorId: userId,
          content: content,
        });
      } catch (err) {
        console.log(err);
      }
    };

    getPost();
  }, []);

  // 댓글 조회
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await publicApi.get(`/posts/${postId}/comments`);

        if (!res || !res.data) return;

        setComments(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getComments();
  }, []);

  const groups = [];

  for (let i = 0; i < comments.length; i += 10) {
    groups.push(comments.slice(i, i + 10));
  }

  const editPost = async () => {
    const data = await checkUser();

    if(!data || !data.user || !data.user.id) return;

    setUser(data.user);

    console.log(data.user);
    console.log(user);
    console.log(postInfo);

    if (user.id !== postInfo.authorId) return;

    navigate(`/post/${postId}`);
  };

  return (
    <>
      <div className={styles["post-container"]}>
        <div className={styles["post-header"]}>
          <h1 className={styles["title"]}>{postInfo.title}</h1>
          <div className={styles["post-info"]}>
            <p className={styles["time"]}>{postInfo.postTime}</p>
            <p className={styles["author"]}>{postInfo.author}</p>
          </div>
          <div className={styles["post-btns"]}>
            <button
              type="button"
              className={styles["edit-btn"]}
              onClick={editPost}
            >
              수정
            </button>
            <button type="button" className={styles["delete-btn"]}>
              삭제
            </button>
          </div>
        </div>
        <div className={styles["post-files"]} />
        <div className={styles["post-content"]}>{postInfo.content}</div>
        <div className={styles["input-comment"]}>
          <div className={styles["input-content"]}>
            <textarea
              className={styles["content"]}
              placeholder="내용"
            ></textarea>
          </div>
          <div className={styles["submit"]}>
            <button type="submit" className={styles["submit-btn"]}>
              제출
            </button>
          </div>
        </div>
        <Comments list={groups[activePage - 1] || []} />
        <Page
          className={styles["comment-pages"]}
          totalPages={groups.length}
          currentPage={activePage}
          baseUrl={"/detail"}
        />
      </div>
    </>
  );
}

function Comments({ list }) {
  const comments = list.map((comment) => {
    const time = getEffectiveDate(comment.createTime, comment.updateTime);

    return (
      <div className={styles["comment"]} key={comment.id}>
        <div className={styles["comment-header"]}>
          <div className={styles["comment-info"]}>
            <p>{comment.author}</p>
            <p className={styles["time"]}>{time}</p>
          </div>
          <div>
            <button type="button" className={styles["comment-edit-btn"]}>
              수정
            </button>
            <button type="button" className={styles["comment-delete-btn"]}>
              삭제
            </button>
          </div>
        </div>
        <div className={styles["comment-content"]}>
          <p>{comment.content}</p>
        </div>
      </div>
    );
  });

  return <div className={styles["comment-container"]}>{comments}</div>;
}
