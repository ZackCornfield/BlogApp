import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  getComments,
} from "../controllers/postController";

const router = express.Router();

router.get("/", authMiddleware, getPosts);
router.get("/:id", authMiddleware, getPost);

router.post("/", authMiddleware, addPost);

router.put("/:id", authMiddleware, editPost);

router.delete("/:id", authMiddleware, deletePost);

router.post("/:id/like", authMiddleware, likePost);
router.post("/:id/unlike", authMiddleware, unlikePost);

router.post("/:id/comment", authMiddleware, addComment);
router.delete("/:id/comment/:commentId", authMiddleware, deleteComment);
router.get("/:id/comments", authMiddleware, getComments);

export default router;
