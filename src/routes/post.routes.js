import { Router } from "express";
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getPost,
} from "../db/query/post/post.db.js";

const router = Router();

router.get("/posts", async (req, res, next) => {
  try {
    const posts = await getAllPosts();

    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

router.post("/posts", async (req, res, next) => {
  try {
    const { title, author, content } = req.body;

    if (!title || !author || !content)
      return res.status(400).json({ message: "요소를 전부 입력해주세요." });

    await createPost(title, author, content);

    return res.status(201).json({ message: "게시글이 저장되었습니다." });
  } catch (err) {
    next(err);
  }
});

router.get("/posts/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await getPost(postId);

    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

router.put("/posts/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { title, content, author } = req.body;

    if (!title || !author || !content)
      return res.status(400).json({ message: "요소를 전부 입력해주세요." });

    await editPost(title, content, postId, author);

    return res.status(200).json({ message: "게시글이 수정되었습니다." });
  } catch (err) {
    next(err);
  }
});

router.delete("/posts/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { author } = req.body;

    if (!author)
      return res.status(400).json({ message: "요소를 전부 입력해주세요." });

    await deletePost(postId, author);

    return res.status(200).json({ message: "게시글이 수정되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
