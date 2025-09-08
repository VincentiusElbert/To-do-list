import { RequestHandler } from "express";
import { getTodos } from "./getTodos";
import { getScrollTodos } from "./getScrollTodos";
import { createTodo } from "./createTodo";
import { updateTodo } from "./updateTodo";
import { deleteTodo } from "./deleteTodo";

export const registerTodosRoutes = (app: any) => {
  app.get("/api/todos", getTodos as RequestHandler);
  app.get("/api/todos/scroll", getScrollTodos as RequestHandler);
  app.post("/api/todos", createTodo as RequestHandler);
  app.put("/api/todos/:id", updateTodo as RequestHandler);
  app.delete("/api/todos/:id", deleteTodo as RequestHandler);
};

export { getTodos, getScrollTodos, createTodo, updateTodo, deleteTodo };
