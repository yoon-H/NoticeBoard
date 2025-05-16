import { Router } from "express";
import {
  getComments,
  createComment,
  editComment,
  deleteComment,
} from "../db/query/comment/comment.db.js";

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

    const result = await getComments(postId);

    if (result.length === 0)
      return res
        .status(400)
        .json({ message: "해당 게시글이 존재하지 않습니다." });

    const comments = [];
    for (const row of result) {
      if (row.id === null) continue;

      comments.push({
        id: row.id,
        author: row.author,
        content: row.content,
        time: row.time,
      });
    }

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
router.post("/posts/:postId/comments", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { author, content } = req.body;

    if (isNaN(postId))
      return res.status(400).json({ message: "자료형을 확인해주세요." });

    if (!author || !content)
      return res.status(400).json({ message: "모든 요소를 작성해주세요." });

    await createComment(author, content, postId);

    return res.status(201).json({ message: "댓글이 저장되었습니다." });
  } catch (err) {
    next(err);
  }
});

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
router.put("/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const { content, author } = req.body;

    if (isNaN(commentId))
      return res.status(400).json({ message: "자료형을 확인해주세요." });

    if (!author || !content)
      return res.status(400).json({ message: "모든 요소를 작성해주세요." });

    const result = await editComment(commentId, content, author);

    if (result.affectedRows === 0)
      return res
        .status(400)
        .json({ message: "해당 댓글이 존재하지 않습니다." });

    return res.status(200).json({ message: "댓글이 수정되었습니다." });
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
router.delete("/comments/:commentId", async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const { author } = req.body;

    if (isNaN(commentId))
      return res.status(400).json({ message: "자료형을 확인해주세요." });

    if (!author)
      return res.status(400).json({ message: "모든 요소를 작성해주세요." });

    const result = await deleteComment(commentId, author);

    if (result.affectedRows === 0)
      return res
        .status(400)
        .json({ message: "해당 댓글이 존재하지 않습니다." });

    return res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
