import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axios.instance.js";
import { useState } from "react";
import Focus from "@tiptap/extension-focus";

import EditorToolbar from "../components/EditorToolbar.jsx";
import styles from "../css/post.module.css";

export default function Post() {
  const navigate = useNavigate();
  const params = useParams();
  let postId = params.id;

  const isEditing = postId ? true : false;

  const [title, setTitle] = useState("");

  // title input 변경
  const onChange = (e) => {
    setTitle(e.target.value);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Focus.configure({
        className: "has-focus",
        mode: "shallowest",
      }),
    ],
  });

  // 1. 수정이면 본문 받아오기
  if (isEditing) {
    useEffect(() => {
      const getPost = async () => {
        try {
          const res = await api.get(`/posts/${postId}`);

          const data = res.data;

          setTitle(data.title);
          editor?.commands.setContent(data.title);
        } catch (err) {
          console.log(err);
          alert(err.response.data.message);
        }
      };

      getPost();
    });
  }

  // 2. 툴바 만들기
  // 2-1. 이미지 본문 삽입 (후순위)
  // 2-2. 첨부파일 삽입 (후순위)

  // 3. 본문 만들기

  // 4. 제출 버튼 연동 (작성 / 수정) 변경
  const submitPost = async () => {
    try {
      const data = {
        title: title,
        content: editor.getText(),
        files: [],
      };

      if (isEditing) {
        await api.put(data);
      } else {
        const res = await api.post(`/posts`, data);

        if (res.data.id) postId = res.data.id;
      }

      navigate(`/detail/${postId}`);
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  };

  return (
    <>
      <div className={styles["post-container"]}>
        <div className={styles["post-header"]}>
          <input
            type="text"
            name="title"
            className={styles["title"]}
            placeholder="제목"
            value={title}
            onChange={onChange}
          />
        </div>
        <div className={styles["post-files"]}>
          <input type="file" className={styles["attachment-header"]} multiple />
        </div>
        <EditorToolbar editor={editor}></EditorToolbar>
        <EditorContent
          className={styles["tiptap"]}
          editor={editor}
          placeholder="내용을 입력해주세요."
          onClick={() => editor?.commands.focus()}
        />
        <div className={styles["post-content"]}>
          <div className={styles["editor"]}></div>
        </div>
        <div className={styles["submit"]}>
          <button
            type="submit"
            className={styles["submit-btn"]}
            onClick={submitPost}
          >
            제출
          </button>
        </div>
      </div>
    </>
  );
}
