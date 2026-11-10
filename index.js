import express from "express";
import { app as apiApp, initializeDatabase } from "./api.js";

const app = express();
const port = Number(process.env.PORT) || 5173;

app.use(express.static("public"));
app.use(express.static("dist"));
app.use(apiApp);

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile("index.html", { root: "dist" }, (error) => {
    if (error) {
      next(error);
    }
  });
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
