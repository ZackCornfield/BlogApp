import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPosts = async (req: any, res: any) => {
  try {
    const userId = req.user.id; // Get the current user's ID
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch posts with pagination
    const posts = await prisma.post.findMany({
      skip: skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Check if the current user has liked each post and include the likes count, also include comments count
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const liked = await prisma.like.findFirst({
          where: {
            postId: post.id,
            userId: userId,
          },
        });
        const likesCount = await prisma.like.count({
          where: {
            postId: post.id,
          },
        });
        const commentsCount = await prisma.comment.count({
          where: {
            postId: post.id,
          },
        });
        return {
          ...post,
          liked: !!liked,
          likes: likesCount,
          commentsCount: commentsCount,
        }; // Add the `liked`, `likes`, and `commentsCount` properties
      })
    );

    const totalPosts = await prisma.post.count();

    res.status(200).json({
      posts: postsWithLikes,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPost = async (req: any, res: any) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user.id; // Get the current user's ID

    if (isNaN(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user has liked the post and include the likes count
    const liked = await prisma.like.findFirst({
      where: {
        postId: post.id,
        userId: userId,
      },
    });
    const likesCount = await prisma.like.count({
      where: {
        postId: post.id,
      },
    });
    const commentsCount = await prisma.comment.count({
      where: {
        postId: post.id,
      },
    });
    const postWithLikes = {
      ...post,
      liked: !!liked,
      likes: likesCount,
      commentsCount: commentsCount,
    }; // Add the `liked`, `likes`, and `commentsCount` properties

    res.status(200).json(postWithLikes);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addPost = async (req: any, res: any) => {
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
};

export const editPost = async (req: any, res: any) => {
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
};

export const deletePost = async (req: any, res: any) => {
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
};

export const likePost = async (req: any, res: any) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if the post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add like to the post
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unlikePost = async (req: any, res: any) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if the post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove like from the post
    await prisma.like.deleteMany({
      where: {
        postId,
        userId,
      },
    });

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const getLikes = async (req: any, res: any) => {
//   try {
//     const postId = parseInt(req.params.id);

//     const likeCount = await prisma.like.count({
//       where: { postId: postId },
//     });

//     res.status(200).json({ likeCount });
//   } catch (error) {
//     console.error("Error fetching like count:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const addComment = async (req: any, res: any) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await prisma.comment.create({
      data: {
        postId: postId,
        userId: userId,
        content: content,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteComment = async (req: any, res: any) => {
  try {
    const postId = parseInt(req.params.id);
    const commentId = parseInt(req.params.commentId);
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId, postId: postId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getComments = async (req: any, res: any) => {
  try {
    const postId = parseInt(req.params.id);
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 comments per page
    const skip = (page - 1) * limit;

    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      include: { user: { select: { id: true, username: true } } },
      skip: skip,
      take: limit,
      orderBy: { createdAt: "desc" }, // Optional: Order by newest first
    });

    const totalComments = await prisma.comment.count({
      where: { postId: postId },
    });

    res.status(200).json({
      comments,
      totalComments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
