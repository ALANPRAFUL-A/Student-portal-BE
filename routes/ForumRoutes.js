
  import express from "express";
  import ForumPost from "../models/ForumPost.js";
  import Student from "../models/Student.js";
  import { verifyToken } from "../middleware/auth.js";

  const forumRouter = express.Router();


forumRouter.get("/", async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });

    const postsWithNames = await Promise.all(
      posts.map(async (post) => {
        const student = await Student.findById(post.author).select("name");
        return {
          ...post.toObject(),
          authorName: student ? student.name : "Unknown",
          authorId: post.author?.toString() || null
        };
      })
    );

    res.json(postsWithNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch forum posts" });
  }
});

  forumRouter.post("/", verifyToken, async (req, res) => {
    try {
      const { title, content } = req.body;
      const newPost = new ForumPost({
        title,
        content,
        author: req.userId
      });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ message: "Error creating post", error });
    }
  });


forumRouter.delete("/:id", async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});


  export default forumRouter