import { useParams, useSearchParams } from "react-router-dom";
import styles from "../css/detail.module.css";
import { useEffect, useState } from "react";
import getEffectiveDate from "../utils/getEffectiveDate.js";
import publicApi from "../utils/api/publicInstance.js";
import Page from "../components/Page.jsx";
import { useUser } from "../hooks/useUser.js";
import { navigate } from "../utils/navigate.js";
import { checkUser } from "../utils/checkUser.js";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import privateApi from "../utils/api/privateInstance.js";
import Image from "@tiptap/extension-image";

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
  const [groups, setGroups] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [searchParams] = useSearchParams();
  const { user, setUser } = useUser();
  const [myComment, setMyComment] = useState();

  const editor = useEditor({
    extensions: [StarterKit, Image],
    editable: false,
  });

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

        editor.commands.setContent(content);

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
  }, [editor]);

  // 댓글 조회
  const getComments = async () => {
    try {
      const res = await publicApi.get(`/posts/${postId}/comments`);

      if (!res || !res.data) return;

      const comments = res.data.reverse();

      const tmp = [];

      for (let i = 0; i < comments.length; i += 10) {
        tmp.push(comments.slice(i, i + 10));
      }

      setGroups(tmp);

      //console.log(groups);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  const onChange = (e) => {
    setMyComment(e.target.value);
  };

  const editPost = async () => {
    const data = await checkUser();

    if (!data || !data.user || !data.user.id) return;

    setUser(data.user);

    if (user.id !== postInfo.authorId) {
      alert("작성자가 아닙니다");
      return;
    }

    navigate(`/post/${postId}`);
  };

  const deletePost = async () => {
    const data = await checkUser();

    if (!data || !data.user || !data.user.id) return;

    setUser(data.user);

    if (user.id !== postInfo.authorId) {
      alert("작성자가 아닙니다");
      return;
    }

    const res = await privateApi.delete(`/posts/${postId}`);

    if (res) navigate("/");
  };

  const submitComment = async () => {
    const data = await checkUser();

    if (!data || !data.user || !data.user.id) return;

    setUser(data.user);

    const sendData = { content: myComment };

    await privateApi.post(`/posts/${postId}/comments`, sendData);

    setMyComment("");
    getComments();
  };

  let isVisible = true;

  if (!user || user.id !== postInfo.authorId) isVisible = false;

  return (
    <>
      <div className={styles["post-container"]}>
        <div className={styles["post-header"]}>
          <h1 className={styles["title"]}>{postInfo.title}</h1>
          <div className={styles["post-info"]}>
            <p className={styles["time"]}>{postInfo.postTime}</p>
            <p className={styles["author"]}>{postInfo.author}</p>
          </div>
          {isVisible && (
            <div className={styles["post-btns"]}>
              <button
                type="button"
                className={styles["edit-btn"]}
                onClick={editPost}
              >
                수정
              </button>
              <button
                type="button"
                className={styles["delete-btn"]}
                onClick={deletePost}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <div className={styles["post-files"]} />
        <EditorContent className={styles["post-content"]} editor={editor} />
        <div className={styles["input-comment"]}>
          <div className={styles["input-content"]}>
            <textarea
              className={styles["content"]}
              placeholder="내용"
              onChange={onChange}
              value={myComment}
            ></textarea>
          </div>
          <div className={styles["submit"]}>
            <button
              type="submit"
              className={styles["submit-btn"]}
              onClick={submitComment}
            >
              제출
            </button>
          </div>
        </div>
        <Comments
          list={groups[activePage - 1] || []}
          getComments={getComments}
        />
        <Page
          className={styles["comment-pages"]}
          totalPages={groups.length}
          currentPage={activePage}
        />
      </div>
    </>
  );
}

function Comments({ list, getComments }) {
  const comments = list.map((comment) => {
    return (
      <Comment comment={comment} getComments={getComments} key={comment.id} />
    );
  });

  return <div className={styles["comment-container"]}>{comments}</div>;
}

function Comment({ comment, getComments }) {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  // 수정 버튼 이벤트
  const editComment = async (id) => {
    await privateApi.put(`/comments/${id}`, {
      content: editedContent,
    });

    setIsEditing(false);

    getComments();
  };

  // 삭제 버튼 이벤트
  const deleteComment = async (id) => {
    await privateApi.delete(`/comments/${id}`);

    getComments();
  };

  const time = getEffectiveDate(comment.createTime, comment.updateTime);

  let isVisible = true;

  if (!user || user.id !== comment.authorId) isVisible = false;

  return (
    <div className={styles["comment"]} key={comment.id}>
      <div className={styles["comment-header"]}>
        <div className={styles["comment-info"]}>
          <p>{comment.author}</p>
          <p className={styles["time"]}>{time}</p>
        </div>
        {isEditing ? (
          <div>
            <button type="button" onClick={() => setIsEditing(false)}>
              취소
            </button>
            <button type="button" onClick={() => editComment(comment.id)}>
              저장
            </button>
          </div>
        ) : (
          isVisible && (
            <div>
              <button
                type="button"
                className={styles["comment-edit-btn"]}
                onClick={() => setIsEditing(true)}
              >
                수정
              </button>
              <button
                type="button"
                className={styles["comment-delete-btn"]}
                onClick={() => deleteComment(comment.id)}
              >
                삭제
              </button>
            </div>
          )
        )}
      </div>
      {isEditing ? (
        <textarea
          className={styles["edit-content"]}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <div className={styles["comment-content"]}>
          <p className={styles["comment-content-line"]}>{comment.content}</p>
        </div>
      )}
    </div>
  );
}
