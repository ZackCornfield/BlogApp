import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  getAllPosts,
  getUserPosts,
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

router.get("/all", authMiddleware, getAllPosts); // Route to get everyone's posts
router.get("/user", authMiddleware, getUserPosts); // Route to get the logged-in user's posts
router.get("/:id", authMiddleware, getPost); // Get a specific post by ID

router.post("/", authMiddleware, addPost); // Create a new post

router.put("/:id", authMiddleware, editPost); // Edit a post

router.delete("/:id", authMiddleware, deletePost); // Delete a post

router.post("/:id/like", authMiddleware, likePost); // Like a post
router.post("/:id/unlike", authMiddleware, unlikePost); // Unlike a post

router.post("/:id/comment", authMiddleware, addComment); // Add a comment to a post
router.delete("/:id/comment/:commentId", authMiddleware, deleteComment); // Delete a comment from a post
router.get("/:id/comments", authMiddleware, getComments); // Get comments for a post

export default router;
