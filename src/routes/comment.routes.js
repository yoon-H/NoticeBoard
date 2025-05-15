import { Router } from "express";
import {
  getComments,
  createComment,
  editComment,
  deleteComment,
} from "../db/query/comment/comment.db.js";

const router = Router();

router.get("/posts/:postId/comments", async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const comments = await getComments(postId);

    return res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
});

router.post("/posts/:postId/comments", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { author, content } = req.body;

    await createComment(author, content, postId);

    return res.status(201).json({ message: "댓글이 저장되었습니다." });
  } catch (err) {
    next(err);
  }
});

router.put("/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const { content, author } = req.body;

    await editComment(content, commentId, author);

    return res.status(200).json({ message: "댓글이 수정되었습니다." });
  } catch (err) {
    next(err);
  }
});

router.delete("/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const { author } = req.body;

    await deleteComment(commentId, author);

    return res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});
