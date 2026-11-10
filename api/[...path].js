import { app as apiApp, initializeDatabase } from "../api.js";

let databaseInitialization;

function ensureDatabase() {
  if (!databaseInitialization) {
    databaseInitialization = initializeDatabase().catch((error) => {
      databaseInitialization = undefined;
      throw error;
    });
  }
  return databaseInitialization;
}

export default async function handler(req, res) {
  try {
    await ensureDatabase();
    return apiApp(req, res);
  } catch (error) {
    console.error("Unable to initialize PostgreSQL:", error);
    return res.status(500).json({
      message: "The database is unavailable. Please try again later.",
    });
  }
}
