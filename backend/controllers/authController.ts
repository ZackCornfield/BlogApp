import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.json({ token: token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: any, res: any) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ status: "success", message: "User registered successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Registration error:", error.message);
    } else {
      console.error("Registration error:", error);
    }
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
