import express from "express";
import cors from "cors";
import {
  getTodos,
  getScrollTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./routes/todos";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/todos", getTodos as any);
  app.get("/todos/scroll", getScrollTodos as any);
  app.post("/todos", createTodo as any);
  app.put("/todos/:id", updateTodo as any);
  app.delete("/todos/:id", deleteTodo as any);

  return app;
}
