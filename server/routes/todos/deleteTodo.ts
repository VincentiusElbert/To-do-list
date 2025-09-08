import { RequestHandler } from "express";
import { getTodosStore, setTodosStore } from "./store";

export const deleteTodo: RequestHandler = (req, res) => {
  const id = String(req.params.id);
  const store = getTodosStore();
  const exists = store.some((t) => t.id === id);
  if (!exists) return res.status(404).json({ error: "NotFound" });
  setTodosStore(store.filter((t) => t.id !== id));
  res.status(204).end();
};
