import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", authMiddleware, async (req, res) => {
  try {
    // Access the user ID from req.user
    const userId = (req as any).user.id;

    // Fetch posts for the authenticated user
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
    });

    // Check if posts exist
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    // Access the user ID from req.user
    const userId = (req as any).user.id;

    // Validate input
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Create a new post
    const newPost = await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: userId,
      },
    });

    // Respond with the created post
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    // Access the user ID from req.user
    const userId = (req as any).user.id;

    // Validate post ID
    const postId = Number(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Validate content
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Check if the post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to modify this post" });
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content: content },
    });

    // Respond with the updated post
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Access the user ID from req.user
    const userId = (req as any).user.id;

    // Validate post ID
    const postId = Number(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    // Check if the post exists and belongs to the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to modify this post" });
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    // Respond with a success message
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
