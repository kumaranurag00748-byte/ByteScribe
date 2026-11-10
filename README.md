# ByteScribe

A small React + Node.js blog application for capturing, editing, and sharing thoughts.

## Live demo

[Open ByteScribe](https://byte-scribe-sage.vercel.app/)

The live deployment uses [Neon](https://neon.tech/) for hosted PostgreSQL storage.

For Vercel deployments, configure `DATABASE_URL` in the project’s Environment Variables for the Production environment, then redeploy. Vercel serves the API through the serverless handler in [`api/[...path].js`](./api/[...path].js).

## Features

- Create, view, edit, and delete blog posts
- React single-page interface with client-side navigation
- Express JSON API
- Responsive custom styling with a focused writing experience
- PostgreSQL storage for posts

## Project structure

- `index.js` - Express application entry point and JSON API
- `db.js` - PostgreSQL connection pool, schema initialization, and post queries
- `index.html` - React application entry point
- `.env.example` - PostgreSQL connection settings template
- `package.json` - Node dependencies and package metadata
- `public/` - Static assets
  - `main.css` - Custom styling
  - `logo-notepad.png` - App logo image
- `src/` - React components and styles

## Installation

1. Install dependencies from the project directory:

```bash
cd "C:\Users\hp\Desktop\Full Stack Web Development\ByteScribe"
npm install
```

2. Configure PostgreSQL. You can use a local database or Neon.

For a local PostgreSQL installation, run:

```sql
CREATE DATABASE blogdb;
```

For Neon:

1. Create a project and database at [Neon Console](https://console.neon.tech/).
2. Copy the pooled connection string from the **Connect** panel.
3. Set it as `DATABASE_URL` in your local `.env` file or deployment environment:

```text
DATABASE_URL=postgresql://user:password@ep-example.region.aws.neon.tech/neondb?sslmode=require
```

The application creates the `posts` table automatically on startup. Keep the connection string private and never commit `.env`.

3. Create the environment file:

```powershell
Copy-Item .env.example .env
```

Open `.env` and set `DATABASE_URL` to your Neon connection string, or replace `your_password` with the password for your local PostgreSQL user. The default local connection is:

```text
postgresql://postgres:your_password@localhost:5432/blogdb
```

You can instead set separate `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` values. `DATABASE_URL` takes precedence when provided.

4. Run the development application with Vite and the Express API:

```bash
npm run dev
```

Open the development server at:

```text
http://localhost:5173
```

To run only the production Express server:

```bash
npm start
```

For a production client bundle, run:

```bash
npm run build
```

Then open your browser at:

```bash
http://localhost:4173
```

## Usage

- Visit `/` to view the landing page and latest posts loaded from PostgreSQL.
- Visit `/post` to create a new blog post.
- After posting, you are redirected to `/post/new` where all posts are listed.
- Use the `Read` button to open a post at `/post/:id`.
- Use the `Edit` button to modify a post at `/post/:id/edit`.
- Use the `Delete` button to remove a post.

## Notes

- On startup, `db.js` creates the `posts` table if it does not already exist. Restarting the server does not delete posts.
- Post titles are optional; blank titles display as `Untitled`.
- Post content is required to create or save a post.

## Dependencies

- express
- body-parser
- react
- react-dom
- react-router-dom
- vite
- pg
- dotenv
