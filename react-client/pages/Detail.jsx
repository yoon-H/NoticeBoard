import { useParams } from "react-router-dom";
import styles from "../css/detail.module.css";
import { useEffect, useState } from "react";
import getEffectiveDate from "../utils/getEffectiveDate.js";
import publicApi from "../utils/api/publicInstance.js";

const infos = {
  title: "",
  postTime: "",
  author: "",
  content: "",
};

export default function Detail() {
  const params = useParams();
  const postId = params.id;

  const [ postInfo, setPostInfo ] = useState(infos);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await publicApi.get(`/posts/${postId}`);

        if (!res || !res.data ) return;

        const post = res.data.post;

        if(!post) return;

        const { title, createTime, updateTime, author, content } = post;

        setPostInfo({
          title: title,
          postTime: getEffectiveDate(createTime, updateTime),
          author: author,
          content: content,
        });
      } catch (err) {
        console.log(err);
      }
    };

    getPost();
  }, []);

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
            <button type="button" className={styles["edit-btn"]}>
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
        <div className={styles["comment-container"]}></div>
        <div className={styles["comment-pages"]}></div>
      </div>
    </>
  );
}
