import { RequestHandler } from "express";
import dayjs from "dayjs";
import { CreateTodoSchema, Todo } from "../../../shared/todos";
import { getTodosStore, setTodosStore } from "./store";
import { handleZodErrorResponse } from "../../utils/error";

export const createTodo: RequestHandler = (req, res) => {
  try {
    const input = CreateTodoSchema.parse(req.body);
    const now = dayjs().toISOString();
    const todo: Todo = {
      id: globalThis.crypto?.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
      title: input.title,
      completed: input.completed ?? false,
      date: input.date ?? null,
      priority: input.priority,
      createdAt: now,
      updatedAt: now,
    };
    const store = getTodosStore();
    setTodosStore([todo, ...store]);
    res.status(201).json(todo);
  } catch (error) {
    handleZodErrorResponse(res, error);
  }
};
