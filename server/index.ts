import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { registerTodosRoutes } from "./routes/todos";
import { createApp as createPublicTodosApp } from "../src/app";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, _res, next) => {
    try {
      console.log(`[api] ${req.method} ${req.path}`);
    } catch {}
    next();
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Todos API (with /api prefix)
  registerTodosRoutes(app);

  // Public API without /api prefix (matches requested VSCode src structure): /todos, /todos/scroll, ...
  const publicApi = createPublicTodosApp();
  app.use("/", publicApi);

  return app;
}
