import { Router } from "express";
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getPost,
} from "../db/query/post/post.db.js";

const router = Router();

router.get("/posts", async (req, res) => {
  const posts = await getAllPosts();

  return res.status(200).json(posts);
});

router.post("/posts", async (req, res) => {
  const { title, author, content } = req.body;

  await createPost(title, author, content);

  return res.status(200).json({ message: "게시글이 저장되었습니다." });
});

router.get("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;

  const post = await getPost(postId);

  return res.status(200).json(post);
});

router.put("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;
  const { title, content, id } = req.body;

  await editPost(title, content, postId, id);

  return res.status(200).json({ message: "게시글이 수정되었습니다." });
});

router.delete("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;
  const { id } = req.body;

  await deletePost(postId, id);

  return res.status(200).json({ message: "게시글이 수정되었습니다." });
});

export default router;
