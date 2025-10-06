import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";
import postRouter from "./routes/postRouter";
import userRouter from "./routes/userRouter";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
