import express from "express";
import bodyParser from "body-parser";
import {
  createPost,
  deletePost,
  findPostById,
  initializeDatabase,
  listPosts,
  updatePost,
} from "./db.js";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const asyncRoute = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const getPostId = (req) => {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

app.get("/api/posts", asyncRoute(async (req, res) => {
  const posts = await listPosts();
  res.json(posts);
}));

app.post("/api/posts", asyncRoute(async (req, res) => {
  const title = (req.body.title || "").trim();
  const content = (req.body.content || "").trim();

  if (!content) {
    return res.status(400).json({ message: "Please enter some content before posting." });
  }

  const post = await createPost(title, content);
  res.status(201).json(post);
}));

app.get("/api/posts/:id", asyncRoute(async (req, res) => {
  const id = getPostId(req);
  const post = id ? await findPostById(id) : null;

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  res.json(post);
}));

app.put("/api/posts/:id", asyncRoute(async (req, res) => {
  const id = getPostId(req);
  const post = id ? await findPostById(id) : null;

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  const title = (req.body.title || "").trim();
  const content = (req.body.content || "").trim();

  if (!content) {
    return res.status(400).json({ message: "Please enter some content before saving." });
  }

  const updatedPost = await updatePost(id, title, content);
  res.json(updatedPost);
}));

app.delete("/api/posts/:id", asyncRoute(async (req, res) => {
  const id = getPostId(req);
  if (id) {
    const deleted = await deletePost(id);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found." });
    }
  }
  res.status(204).end();
}));

app.use((error, req, res, next) => {
  console.error("Request failed:", error);
  if (req.path.startsWith("/api/")) {
    return res.status(500).json({ message: "A database error occurred. Please try again later." });
  }
  next(error);
});

export { app, initializeDatabase };
