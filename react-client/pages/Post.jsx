import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Focus from "@tiptap/extension-focus";

import EditorToolbar from "../components/EditorToolbar.jsx";
import "../css/post.css";

export default function Post() {
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
          const res = await axios.get(`/api/posts/${postId}`);

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
        content: editor.getText,
        files: [],
      };

      if (isEditing) {
        await axios.put(data);
      } else {
        const res = await axios.post(`/api/posts`,data);

        if (res.id) postId = res.id;
      }

      const navigate = useNavigate();
      navigate(`/detail/${postId}`);
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  };

  return (
    <>
      <div id="post-container">
        <div id="post-header">
          <input
            type="text"
            id="title"
            name="title"
            placeholder="제목"
            value={title}
            onChange={onChange}
          />
        </div>
        <div id="post-files">
          <input type="file" id="attachment-header" multiple />
        </div>
        <EditorToolbar editor={editor}></EditorToolbar>
        <EditorContent
          id="tiptap"
          className="tiptap"
          editor={editor}
          onClick={() => editor?.commands.focus()}
        />
        <div id="post-content">
          <div id="editor"></div>
        </div>
        <div id="submit">
          <button type="submit" id="submit-btn" onClick={submitPost}>
            제출
          </button>
        </div>
      </div>
    </>
  );
}
