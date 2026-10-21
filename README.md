# BlogWebApp

A small Node.js + Express blog application with server-side rendered views using EJS.

## Features

- Create, view, edit, and delete blog posts
- Server-side rendered pages with EJS templates
- Bootstrap-based layout and custom styles
- PostgreSQL storage for posts

## Project structure

- `index.js` - Main Express application entry point
- `db.js` - PostgreSQL connection pool, schema initialization, and post queries
- `.env.example` - PostgreSQL connection settings template
- `package.json` - Node dependencies and package metadata
- `public/` - Static assets
  - `main.css` - Custom styling
  - `logo-notepad.png` - App logo image
- `views/` - EJS view templates
  - `index.ejs` - Landing/home page
  - `app.ejs` - New blog post form
  - `post_new.ejs` - List of published posts
  - `post_view.ejs` - Single post display
  - `post_edit.ejs` - Edit form for an existing post
  - `partials/` - Shared components
    - `header.ejs` - Header with navigation
    - `footer.ejs` - Footer content

## Installation

1. Install dependencies from the project directory:

```bash
cd "C:\Users\hp\Desktop\Full Stack Web Development\BlogWebApp"
npm install
```

2. Create a PostgreSQL database. For a local PostgreSQL installation, run:

```sql
CREATE DATABASE blogdb;
```

3. Create the environment file:

```powershell
Copy-Item .env.example .env
```

Open `.env` and replace `your_password` with the password for the PostgreSQL user. The default local connection is:

```text
postgresql://postgres:your_password@localhost:5432/blogdb
```

You can instead set separate `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD` values. `DATABASE_URL` takes precedence when provided.

4. Run the application:

```bash
npm start
```

3. Open your browser at:

```bash
http://localhost:3000
```

## Usage

- Visit `/` to view the landing page and saved posts loaded from PostgreSQL.
- Visit `/post` to create a new blog post.
- After posting, you are redirected to `/post/new` where all posts are listed.
- Use the `View` button to open a post at `/post/:id`.
- Use the `Edit` button to modify a post at `/post/:id/edit`.
- Use the `Delete` button to remove a post.

## Notes

- On startup, `db.js` creates the `posts` table if it does not already exist. Restarting the server does not delete posts.
- Post titles are optional; blank titles display as `Untitled`.
- Post content is required to create or save a post.

## Dependencies

- express
- body-parser
- ejs
- pg
- dotenv
