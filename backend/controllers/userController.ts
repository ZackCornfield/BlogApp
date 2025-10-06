import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUserProfile = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    // Fetch user profile from database (pseudo-code)
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, createdAt: true }, // Select fields to return
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { username, password } = req.body; // Extract fields from request body

    // Hash the password if it's being updated
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user profile in database (pseudo-code)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, password: hashedPassword }, // Update fields
      select: { username: true, createdAt: true }, // Select fields to return
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecentActivities = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    // Fetch recent posts by the user
    const recentPosts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      take: 5, // Limit to 5 recent posts
      select: { id: true, title: true, content: true, createdAt: true },
    });

    console.log(recentPosts);

    res.json(recentPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
