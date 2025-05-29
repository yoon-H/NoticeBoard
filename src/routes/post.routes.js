import { Router } from "express";
import {
  createPostWithImages,
  deletePost,
  editPost,
  getAllPosts,
  getPost,
} from "../db/query/post/post.db.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sanitizePost } from "../utils/sanitizeContent.js";

const router = Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: "게시글 전체 조회"
 *     description: "서버에 Get 방식으로 게시글 전체 조회 요청"
 *     tags: [Post]
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
 *                   title:
 *                     type: string
 *                     example: 첫 번째 게시글
 *                   name:
 *                     type: string
 *                     example: cool_user
 *                   content:
 *                     type: string
 *                     example: 게시글 내용입니다.
 *                   time:
 *                     type: string
 *                     example: 2025-05-15T15:23:05.000Z
 */
router.get("/posts", async (req, res, next) => {
  try {
    const posts = await getAllPosts();

    console.log(posts);

    return res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: "게시글 작성"
 *     description: "서버에 글 데이터를 보내 Post방식으로 저장 요청"
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: 제목입니다.
 *               author:
 *                 type: number
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: 게시글 내용입니다.
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
 *                     example : "게시글이 저장되었습니다."
 */
router.post("/posts", authMiddleware, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const author = req.user.id;

    if (!title || !author || !content)
      return res.status(400).json({ message: "요소를 전부 입력해주세요." });

    const obj = { title, author, content: sanitizePost(content) };

    // 트랜잭션
    const result = await createPostWithImages(obj);

    if (result)
      return res
        .status(201)
        .json({ id: result.insertId, message: "게시글이 저장되었습니다." });
    else
      return res.status(500).json({ message: "게시글 삭제에 실패했습니다." });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: "특정 게시글 조회"
 *     description: "서버에 Get 방식으로 특정 게시글 조회 요청"
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 게시글 ID
 *     responses:
 *       200:
 *         description: 성공 메시지
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: 첫 번째 게시글
 *                   name:
 *                     type: string
 *                     example: cool_user
 *                   content:
 *                     type: string
 *                     example: 게시글 내용입니다.
 *                   time:
 *                     type: string
 *                     example: 2025-05-15T15:23:05.000Z
 */
router.get("/posts/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;

    if (isNaN(postId))
      return res.status(400).json({ message: "자료형을 확인해주세요." });

    const post = await getPost(postId);

    if (!post)
      return res
        .status(404)
        .json({ message: "해당 게시글이 존재하지 않습니다." });

    if (post.isDeleted)
      return res
        .status(404)
        .json({ deletedCode: "post", message: "삭제된 게시글입니다." });

    return res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/posts/{postId}:
 *   put:
 *     summary: "게시글 수정"
 *     description: "서버에 글 데이터를 보내 Put방식으로 수정 요청"
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 게시글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: 수정된 제목입니다.
 *               author:
 *                 type: number
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: 수정된 게시글 내용입니다.
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
 *                     example : "게시글이 수정되었습니다."
 */
router.put("/posts/:postId", authMiddleware, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { title, content } = req.body;
    const author = req.user.id;

    if (isNaN(postId))
      return res.status(400).json({ message: "자료형을 확인해주세요." });

    if (!title || !author || !content)
      return res.status(400).json({ message: "요소를 전부 입력해주세요." });

    const post = await getPost(postId);

    if (!post) {
      return res
        .status(404)
        .json({ message: "해당 게시글이 존재하지 않습니다." });
    }

    if (post.isDeleted)
      return res
        .status(404)
        .json({ deletedCode: "post", message: "삭제된 게시글입니다." });

    const obj = {
      title,
      content: sanitizePost(content),
      id: postId,
      author,
    };

    await editPost(obj);

    return res.status(200).json({ message: "게시글이 수정되었습니다." });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: "게시글 삭제"
 *     description: "서버에 Delete방식으로 삭제 요청"
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 게시글 ID
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
 *                 type: number
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
 *                     example : "게시글이 삭제되었습니다."
 */
router.delete("/posts/:postId", authMiddleware, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const author = req.user.id;

    if (!author)
      return res.status(400).json({ message: "요소를 전부 입력해주세요." });

    if (isNaN(postId))
      return res.status(400).json({ message: "자료형을 확인해주세요." });

    const post = await getPost(postId);

    if (!post) {
      return res
        .status(404)
        .json({ message: "해당 게시글이 존재하지 않습니다." });
    }

    if (post.isDeleted)
      return res
        .status(404)
        .json({ deletedCode: "post", message: "삭제된 게시글입니다." });

    const obj = {
      id: postId,
      author,
    };

    const result = await deletePost(obj);

    if (result)
      return res.status(200).json({ message: "게시글이 삭제되었습니다." });
    else
      return res.status(500).json({ message: "게시글 삭제에 실패했습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
