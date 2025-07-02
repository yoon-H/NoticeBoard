import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useNavigate, useParams } from "react-router-dom";
import privateApi from "../utils/api/privateInstance.js";
import { useEffect, useState } from "react";
import Focus from "@tiptap/extension-focus";

import EditorToolbar from "../components/EditorToolbar.jsx";
import styles from "../css/post.module.css";
import { SERVER_URL } from "../utils/api/constants.js";

export default function Post() {
  const navigate = useNavigate();
  const params = useParams();
  let postId = params.id;

  const isEditing = postId ? true : false;

  const [title, setTitle] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Focus.configure({
        className: "has-focus",
        mode: "shallowest",
      }),
    ],
  });

  // 1. 수정이면 본문 받아오기
  useEffect(() => {
    if (!isEditing) return;

    const getPost = async () => {
      try {
        const res = await privateApi.get(`/posts/${postId}`);

        const data = res.data;

        if (!data || !data.post) return;

        const post = data.post;

        setTitle(post.title);
        editor?.commands.setContent(post.content);
      } catch (err) {
        console.log(err);
        alert(err.response.data.message);
      }
    };

    getPost();
  }, [editor]);

  // title input 변경
  const onChange = (e) => {
    setTitle(e.target.value);
  };

  // 2. 툴바 만들기
  // 2-1. 이미지 본문 삽입 (후순위)
  // 2-2. 첨부파일 삽입 (후순위)

  // 3. 본문 만들기

  // 4. 제출 버튼 연동 (작성 / 수정) 변경
  const submitPost = async () => {
    try {
      const data = {
        title: title,
        content: editor.getHTML(),
        files: [],
      };

      if (isEditing) {
        await privateApi.put(`/posts/${postId}`, data);
      } else {
        const res = await privateApi.post(`/posts`, data);

        if (res.data.id) postId = res.data.id;
      }

      navigate(`/detail/${postId}`);
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  };

  // 이미지 추가
  const addImage = () => {
    console.log("addImage");
    const input = document.createElement("input");
    input.setAttribute("type", "file"); // 파일 선택창으로 변경
    input.setAttribute("accept", "image/*"); // 이미지 파일 제한
    input.click();

    console.log("data");

    input.onchange = async () => {
      // 파일을 선택했을 때
      const file = input.files[0];
      const formData = new FormData(); // 이미지 파일로 보내기 위해 서버에 보낼 객체 생성
      formData.append("image", file); // 파일 담기

      try {
        const res = await privateApi.post(`/upload/image`, formData);

        if (!res || !res.data || !res.data.imageUrl) return;

        const url = SERVER_URL + res.data.imageUrl;

        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.log(err);
      }
    };
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
            value={title ?? ""}
            onChange={onChange}
          />
        </div>
        <div className={styles["post-files"]}>
          <input type="file" className={styles["attachment-header"]} multiple />
        </div>
        <EditorToolbar editor={editor} addImage={addImage}></EditorToolbar>
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
