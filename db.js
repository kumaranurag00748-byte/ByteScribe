import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL?.trim();
const password = process.env.PGPASSWORD;

const pool = new Pool({
  connectionString: databaseUrl || undefined,
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

export async function initializeDatabase() {
  if (!databaseUrl && !password) {
    throw new Error(
      "PostgreSQL credentials are missing. Create .env from .env.example and set DATABASE_URL or PGPASSWORD.",
    );
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function listPosts() {
  const { rows } = await pool.query(`
    SELECT id, title, content, created_at AS "createdAt"
    FROM posts
    ORDER BY created_at DESC, id DESC
  `);
  return rows;
}

export async function findPostById(id) {
  const { rows } = await pool.query(
    `
      SELECT id, title, content, created_at AS "createdAt"
      FROM posts
      WHERE id = $1
    `,
    [id],
  );
  return rows[0] || null;
}

export async function createPost(title, content) {
  const { rows } = await pool.query(
    `
      INSERT INTO posts (title, content)
      VALUES ($1, $2)
      RETURNING id, title, content, created_at AS "createdAt"
    `,
    [title, content],
  );
  return rows[0];
}

export async function updatePost(id, title, content) {
  const { rows } = await pool.query(
    `
      UPDATE posts
      SET title = $1, content = $2
      WHERE id = $3
      RETURNING id, title, content, created_at AS "createdAt"
    `,
    [title, content, id],
  );
  return rows[0] || null;
}

export async function deletePost(id) {
  const { rowCount } = await pool.query("DELETE FROM posts WHERE id = $1", [id]);
  return rowCount > 0;
}
