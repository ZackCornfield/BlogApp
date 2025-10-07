import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  getPosts,
  addPost,
  editPost,
  deletePost,
} from "../controllers/postController";

const router = express.Router();

router.get("/", authMiddleware, getPosts);

router.post("/", authMiddleware, addPost);

router.put("/:id", authMiddleware, editPost);

router.delete("/:id", authMiddleware, deletePost);

export default router;
