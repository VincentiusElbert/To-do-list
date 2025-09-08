import { RequestHandler } from "express";
import dayjs from "dayjs";
import { UpdateTodoSchema } from "../../../shared/todos";
import { getTodosStore, setTodosStore } from "./store";
import { handleZodErrorResponse } from "../../utils/error";

export const updateTodo: RequestHandler = (req, res) => {
  try {
    const id = String(req.params.id);
    const patch = UpdateTodoSchema.parse(req.body);
    const store = getTodosStore();
    const idx = store.findIndex((t) => t.id === id);
    if (idx === -1) return res.status(404).json({ error: "NotFound" });
    const updated = {
      ...store[idx],
      ...patch,
      updatedAt: dayjs().toISOString(),
    };
    const next = [...store];
    next[idx] = updated;
    setTodosStore(next);
    res.json(updated);
  } catch (error) {
    handleZodErrorResponse(res, error);
  }
};
