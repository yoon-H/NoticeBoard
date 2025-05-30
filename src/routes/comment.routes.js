import { Router } from "express";
import {
  getComments,
  createComment,
  editComment,
  deleteComment,
  getUpdateTime,
  getComment,
} from "../db/query/comment/comment.db.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getPost } from "../db/query/post/post.db.js";
import { sanitizeComment } from "../utils/sanitizeContent.js";

const router = Router();
/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   get:
 *     summary: "특정 게시글의 모든 댓글 조회"
 *     description: "서버에 Get방식으로 특정 게시글의 모든 댓글 조회 요청"
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 게시글 ID
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: 성공 메시지
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   author:
 *                     type: string
 *                     example: cool_user
 *                   content:
 *                     type: string
 *                     example: 댓글 내용입니다.
 *                   time:
 *                     type: string
 *                     example: 2025-05-15T15:23:05.000Z
 */
router.get("/posts/:postId/comments", async (req, res, next) => {
  try {
    const postId = req.params.postId;

    if (isNaN(postId))
      return res.status(400).json({ message: "자료형을 확인해주세요." });

    const post = await getPost(postId);

    if (!post)
      return res
        .status(404)
        .json({ message: "해당 게시글이 존재하지 않습니다." });

    const comments = await getComments(postId);

    return res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: "댓글 작성"
 *     description: "서버에 댓글 데이터를 보내 Post방식으로 저장 요청"
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 작성할 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author
 *               - content
 *             properties:
 *               author:
 *                 type: int
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: 댓글 내용입니다.
 *     responses:
 *       201:
 *         description: 성공 메시지
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                     example : "댓글이 저장되었습니다."
 */
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const { content } = req.body;
      const author = req.user.id;

      if (isNaN(postId))
        return res.status(400).json({ message: "자료형을 확인해주세요." });

      if (!author || !content)
        return res.status(400).json({ message: "모든 요소를 작성해주세요." });

      const post = await getPost(postId);

      if (!post)
        return res
          .status(404)
          .json({ message: "해당 게시글이 존재하지 않습니다." });

      if (post.isDeleted)
        return res
          .status(404)
          .json({ deletedCode: "post", message: "삭제된 게시글입니다." });

      const obj = { author, content: sanitizeComment(content), postId };

      await createComment(obj);

      return res.status(201).json({ message: "댓글이 저장되었습니다." });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   put:
 *     summary: "댓글 수정"
 *     description: "서버에 수정 데이터를 보내 Put방식으로 수정 요청"
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 댓글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author
 *               - content
 *             properties:
 *               author:
 *                 type: int
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: 수정된 댓글 내용입니다.
 *     responses:
 *       200:
 *         description: 성공 메시지
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                     example : "댓글이 수정되었습니다."
 */
router.put("/comments/:commentId", authMiddleware, async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;
    const author = req.user.id;

    if (isNaN(commentId))
      return res.status(400).json({ message: "자료형을 확인해주세요." });

    if (!author || !content)
      return res.status(400).json({ message: "모든 요소를 작성해주세요." });

    const comment = await getComment(commentId);

    if (!comment)
      return res
        .status(404)
        .json({ message: "해당 댓글이 존재하지 않습니다." });

    if (comment.authorId !== author)
      return res.status(403).json({ message: "작성자가 아닙니다." });

    if (comment.isDeleted) {
      const post = await getPost(comment.postId);

      if (!post)
        return res
          .status(404)
          .json({ message: "해당 게시글이 존재하지 않습니다." });

      if (post.isDeleted)
        return res
          .status(404)
          .json({ deletedCode: "post", message: "삭제된 게시글입니다." });

      return res
        .status(404)
        .json({ deletedCode: "comment", message: "삭제된 댓글입니다." });
    }

    const obj = {
      id: commentId,
      content: sanitizeComment(content),
      author,
    };

    await editComment(obj);

    const time = await getUpdateTime(commentId);

    return res.status(200).json({
      time: time.time,
      message: "댓글이 수정되었습니다.",
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: "댓글 삭제"
 *     description: "서버에 Delete방식으로 삭제 요청"
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 댓글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author
 *             properties:
 *               author:
 *                 type: int
 *                 example: 1
 *     responses:
 *       200:
 *         description: 성공 메시지
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   message:
 *                     type: string
 *                     example : "댓글이 삭제되었습니다."
 */
router.delete(
  "/comments/:commentId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const author = req.user.id;

      if (isNaN(commentId))
        return res.status(400).json({ message: "자료형을 확인해주세요." });

      if (!author)
        return res.status(400).json({ message: "모든 요소를 작성해주세요." });

      // 댓글 및 게시글 검사
      const comment = await getComment(commentId);

      if (!comment)
        return res
          .status(404)
          .json({ message: "해당 댓글이 존재하지 않습니다." });

      if (comment.authorId !== author)
        return res.status(403).json({ message: "작성자가 아닙니다." });

      if (comment.isDeleted) {
        const post = await getPost(comment.postId);

        if (!post)
          return res
            .status(404)
            .json({ message: "해당 게시글이 존재하지 않습니다." });

        if (post.isDeleted)
          return res
            .status(404)
            .json({ deletedCode: "post", message: "삭제된 게시글입니다." });

        return res
          .status(404)
          .json({ deletedCode: "comment", message: "삭제된 댓글입니다." });
      }

      const obj = { id: commentId, author };

      await deleteComment(obj);

      return res.status(200).json({ message: "댓글이 삭제되었습니다." });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
