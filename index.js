import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

const posts = [];
let nextPostId = 1;

app.get("/post", (req, res) => {
  res.render("app", {
    formData: {},
    errorMessage: null,
  });
});

app.post("/post/new", (req, res) => {
  const title = (req.body.title || "").trim();
  const content = (req.body.content || "").trim();

  if (!content) {
    res.render("app", {
      formData: { title, content },
      errorMessage: "Please enter some content before posting.",
    });
    return;
  }

  posts.unshift({
    id: nextPostId++,
    title,
    content,
    createdAt: new Date(),
  });

  res.redirect("/post/new");
});

app.get("/post/new", (req, res) => {
  res.render("post_new", {
    posts,
  });
});

app.get("/post/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return res.status(404).render("post_view", {
      post: null,
      id,
    });
  }

  res.render("post_view", {
    post,
    id,
  });
});

app.get("/post/:id/edit", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return res.status(404).render("post_edit", {
      post: null,
      id,
      errorMessage: "Post not found.",
    });
  }

  res.render("post_edit", {
    post,
    id,
    errorMessage: null,
  });
});

app.post("/post/:id/edit", (req, res) => {
  const id = Number(req.params.id);
  const postIndex = posts.findIndex((item) => item.id === id);

  if (postIndex === -1) {
    return res.status(404).render("post_edit", {
      post: null,
      id,
      errorMessage: "Post not found.",
    });
  }

  const title = (req.body.title || "").trim();
  const content = (req.body.content || "").trim();

  if (!content) {
    const post = posts[postIndex];
    return res.render("post_edit", {
      post: { ...post, title, content },
      id,
      errorMessage: "Please enter some content before saving.",
    });
  }

  posts[postIndex] = {
    ...posts[postIndex],
    title,
    content,
  };

  res.redirect("/post/new");
});

app.post("/post/:id/delete", (req, res) => {
  const id = Number(req.params.id);
  const postIndex = posts.findIndex((item) => item.id === id);

  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
  }

  res.redirect("/post/new");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
