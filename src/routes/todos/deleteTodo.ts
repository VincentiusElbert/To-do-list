import type { RequestHandler } from "express";
import { getTodosStore, setTodosStore } from "./store";
import { getMySqlPool } from "./db";
import { dbDeleteTodo } from "./dbRepo";

export const deleteTodo: RequestHandler = async (req, res) => {
  const id = String(req.params.id);
  const pool = await getMySqlPool();
  if (pool) {
    await dbDeleteTodo(pool, id);
    return res.status(204).end();
  }
  const store = getTodosStore();
  const exists = store.some((t) => t.id === id);
  if (!exists) return res.status(404).json({ error: "NotFound" });
  setTodosStore(store.filter((t) => t.id !== id));
  res.status(204).end();
};
