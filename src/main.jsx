import React, { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import "./styles.css";

const initialForm = { title: "", content: "" };
const dailyThoughts = [
  { text: "The best ideas begin as scribbles.", author: "ByteScribe" },
  { text: "A small step written down becomes a path.", author: "ByteScribe" },
  { text: "Make room for the thought that keeps returning.", author: "ByteScribe" },
  { text: "Clarity often arrives after the first sentence.", author: "ByteScribe" },
  { text: "Your perspective is worth preserving.", author: "ByteScribe" },
  { text: "Write what you know. Discover what you don't.", author: "ByteScribe" },
  { text: "Every finished page started with a blank one.", author: "ByteScribe" },
];

function getDailyThought() {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const today = new Date();
  const dayOfYear = Math.floor((today - startOfYear) / 86400000);
  return dailyThoughts[dayOfYear % dailyThoughts.length];
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }
  return data;
}

function Header() {
  const navigate = useNavigate();
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <img src="/logo-notepad.png" alt="" />
        <span>
          <strong>ByteScribe</strong>
          <small>Your thoughts, compiled.</small>
        </span>
      </Link>
      <button className="button button-primary" onClick={() => navigate("/post")}>
        <span aria-hidden="true">+</span> New post
      </button>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>Made with ❤️ in India.</span>
      <span>© {new Date().getFullYear()} ByteScribe</span>
    </footer>
  );
}

function Layout({ children }) {
  return <div className="app-shell"><Header /><main>{children}</main><Footer /></div>;
}

function Loading() {
  return <div className="state-card"><span className="spinner" />Loading your posts…</div>;
}

function ErrorMessage({ message }) {
  return <div className="alert alert-error" role="alert">{message}</div>;
}

function PostCard({ post, onDelete }) {
  const navigate = useNavigate();
  const title = post.title || "Untitled";
  const excerpt = post.content.length > 220 ? `${post.content.slice(0, 220)}…` : post.content;
  return (
    <article className="post-card">
      <div className="post-card-top">
        <span className="post-label">Published thought</span>
      </div>
      <h3>{title}</h3>
      <p>{excerpt}</p>
      <div className="card-actions">
        <button className="button button-primary button-small" onClick={() => navigate(`/post/${post.id}`)}>Read</button>
        <button className="button button-quiet button-small" onClick={() => navigate(`/post/${post.id}/edit`)}>Edit</button>
        <button className="button button-danger button-small" onClick={() => onDelete(post.id)}>Delete</button>
      </div>
    </article>
  );
}

function Posts({ featured = false }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = () => {
    setLoading(true);
    request("/api/posts").then(setPosts).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(loadPosts, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      await request(`/api/posts/${id}`, { method: "DELETE" });
      setPosts((current) => current.filter((post) => post.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const visiblePosts = featured ? posts.slice(0, 4) : posts;
  return (
    <section className={featured ? "posts-section home-posts" : "posts-section"}>
      <div className="section-heading">
        <div>
          <span className="eyebrow">Your collection</span>
          <h2>{featured ? "Latest thoughts" : "Published posts"}</h2>
        </div>
        <span className="post-count">{posts.length} {posts.length === 1 ? "post" : "posts"}</span>
      </div>
      {error && <ErrorMessage message={error} />}
      {loading ? <Loading /> : visiblePosts.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">✦</span><h3>No posts yet</h3><p>Your first idea is only a few words away.</p><button className="button button-primary" onClick={() => navigate("/post")}>Write your first post</button></div>
      ) : (
        <div className="posts-grid">{visiblePosts.map((post) => <PostCard key={post.id} post={post} onDelete={handleDelete} />)}</div>
      )}
      {featured && posts.length > 4 && <button className="button button-quiet view-all" onClick={() => navigate("/post/new")}>View all posts <span>→</span></button>}
    </section>
  );
}

function Home() {
  const navigate = useNavigate();
  const thought = getDailyThought();
  return <Layout><section className="hero"><div className="hero-copy"><span className="eyebrow">A home for your ideas</span><h1>Write it down.<br /><em>Make it matter.</em></h1><p>ByteScribe gives your thoughts a quiet, beautiful place to become something more.</p><button className="button button-primary button-large" onClick={() => navigate("/post")}>Start writing <span>→</span></button></div><div className="hero-art"><div className="art-note"><span>today's thought</span><strong>“{thought.text}”</strong><small>— {thought.author}</small></div></div></section><Posts featured /></Layout>;
}

function PostForm({ post, editing = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: post?.title || "", content: post?.content || "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const saved = await request(editing ? `/api/posts/${post.id}` : "/api/posts", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      navigate(editing ? `/post/${saved.id}` : "/post/new");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return <Layout><section className="editor-page"><button className="back-link" onClick={() => navigate(editing ? `/post/${post.id}` : "/")}>← Back</button><div className="editor-heading"><span className="eyebrow">{editing ? "Refine your idea" : "A blank page awaits"}</span><h1>{editing ? "Edit post" : "Write something wonderful."}</h1><p>{editing ? "Small changes can make a big difference." : "Put the first sentence down. The rest will follow."}</p></div>{error && <ErrorMessage message={error} />}<form className="editor-form" onSubmit={submit}><label>Title <span>Optional</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Give your thought a name" /></label><label>Content<textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Start writing here…" rows="12" required /></label><div className="form-footer"><span>{form.content.length} characters</span><button className="button button-primary button-large" disabled={saving}>{saving ? "Saving…" : editing ? "Save changes" : "Publish post"} <span>→</span></button></div></form></section></Layout>;
}

function PostView({ id }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { request(`/api/posts/${id}`).then(setPost).catch((err) => setError(err.message)); }, [id]);
  if (error) return <Layout><section className="narrow-page"><ErrorMessage message={error} /><button className="button button-quiet" onClick={() => navigate("/post/new")}>← Back to posts</button></section></Layout>;
  if (!post) return <Layout><section className="narrow-page"><Loading /></section></Layout>;
  return <Layout><article className="reading-page"><button className="back-link" onClick={() => navigate("/post/new")}>← All posts</button><span className="eyebrow">Published thought</span><h1>{post.title || "Untitled"}</h1><div className="reading-meta">A ByteScribe entry · {new Date(post.createdAt).toLocaleDateString()}</div><div className="reading-content">{post.content}</div><div className="reading-actions"><button className="button button-primary" onClick={() => navigate(`/post/${post.id}/edit`)}>Edit post</button><button className="button button-quiet" onClick={() => navigate("/post/new")}>Back to posts</button></div></article></Layout>;
}

function PostsPage() {
  return <Layout><Posts /></Layout>;
}

function PostEditor() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { request(`/api/posts/${id}`).then(setPost).catch((err) => setError(err.message)); }, [id]);
  if (error) return <Layout><section className="narrow-page"><ErrorMessage message={error} /></section></Layout>;
  return post ? <PostForm post={post} editing /> : <Layout><section className="narrow-page"><Loading /></section></Layout>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post" element={<PostForm />} />
      <Route path="/post/new" element={<PostsPage />} />
      <Route path="/post/:id" element={<PostRoute />} />
      <Route path="/post/:id/edit" element={<PostEditor />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function PostRoute() {
  const { id } = useParams();
  return <PostView id={id} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
