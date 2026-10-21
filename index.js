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
const port = Number(process.env.PORT) || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const asyncRoute = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const getPostId = (req) => {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

app.get("/", asyncRoute(async (req, res) => {
  const posts = await listPosts();
  res.render("index", { posts });
}));

app.get("/post", (req, res) => {
  res.render("app", {
    formData: {},
    errorMessage: null,
  });
});

app.post("/post/new", asyncRoute(async (req, res) => {
  const title = (req.body.title || "").trim();
  const content = (req.body.content || "").trim();

  if (!content) {
    res.render("app", {
      formData: { title, content },
      errorMessage: "Please enter some content before posting.",
    });
    return;
  }

  await createPost(title, content);
  res.redirect("/post/new");
}));

app.get("/post/new", asyncRoute(async (req, res) => {
  const posts = await listPosts();
  res.render("post_new", { posts });
}));

app.get("/post/:id", asyncRoute(async (req, res) => {
  const id = getPostId(req);
  const post = id ? await findPostById(id) : null;

  if (!post) {
    return res.status(404).render("post_view", {
      post: null,
      id: req.params.id,
    });
  }

  res.render("post_view", { post, id });
}));

app.get("/post/:id/edit", asyncRoute(async (req, res) => {
  const id = getPostId(req);
  const post = id ? await findPostById(id) : null;

  if (!post) {
    return res.status(404).render("post_edit", {
      post: null,
      id: req.params.id,
      errorMessage: "Post not found.",
    });
  }

  res.render("post_edit", {
    post,
    id,
    errorMessage: null,
  });
}));

app.post("/post/:id/edit", asyncRoute(async (req, res) => {
  const id = getPostId(req);
  const existingPost = id ? await findPostById(id) : null;

  if (!existingPost) {
    return res.status(404).render("post_edit", {
      post: null,
      id: req.params.id,
      errorMessage: "Post not found.",
    });
  }

  const title = (req.body.title || "").trim();
  const content = (req.body.content || "").trim();

  if (!content) {
    return res.render("post_edit", {
      post: { ...existingPost, title, content },
      id,
      errorMessage: "Please enter some content before saving.",
    });
  }

  await updatePost(id, title, content);
  res.redirect("/post/new");
}));

app.post("/post/:id/delete", asyncRoute(async (req, res) => {
  const id = getPostId(req);
  if (id) {
    await deletePost(id);
  }
  res.redirect("/post/new");
}));

app.use((error, req, res, next) => {
  console.error("Request failed:", error);
  res.status(500).send("A database error occurred. Please try again later.");
});

async function start() {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error("Unable to initialize PostgreSQL:", error);
  process.exit(1);
});
