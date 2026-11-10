import { defineConfig } from "vite";
import { app as apiApp, initializeDatabase } from "./api.js";

export default defineConfig({
  plugins: [{
    name: "bytescribe-api",
    async configureServer(server) {
      await initializeDatabase();
      server.middlewares.use(apiApp);
    },
  }],
  server: {
    port: 5173,
  },
});
