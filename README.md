# BlogWebApp

A small Node.js + Express blog application with server-side rendered views using EJS.

## Features

- Create, view, edit, and delete blog posts
- Server-side rendered pages with EJS templates
- Bootstrap-based layout and custom styles
- In-memory storage for posts (no database required)

## Project structure

- `index.js` - Main Express application entry point
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

1. Install dependencies:

```bash
npm install
```

2. Run the application:

```bash
node index.js
```

3. Open your browser at:

```bash
http://localhost:3000
```

## Usage

- Visit `/` to view the landing page.
- Visit `/post` to create a new blog post.
- After posting, you are redirected to `/post/new` where all posts are listed.
- Use the `View` button to open a post at `/post/:id`.
- Use the `Edit` button to modify a post at `/post/:id/edit`.
- Use the `Delete` button to remove a post.

## Notes

- The application stores posts in memory only. Restarting the server clears all posts.
- Post titles are optional; blank titles display as `Untitled`.
- Post content is required to create or save a post.

## Dependencies

- express
- body-parser
- ejs


