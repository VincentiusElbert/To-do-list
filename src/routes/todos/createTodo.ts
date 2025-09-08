import type { RequestHandler } from "express";
import dayjs from "dayjs";
import { CreateTodoSchema, type Todo } from "../../types/todos";
import { getTodosStore, setTodosStore } from "./store";
import { handleZodErrorResponse } from "../../utils/error";
import { getMySqlPool } from "./db";
import { dbCreateTodo } from "./dbRepo";

export const createTodo: RequestHandler = async (req, res) => {
  try {
    const input = CreateTodoSchema.parse(req.body);
    const pool = await getMySqlPool();
    if (pool) {
      const todo = await dbCreateTodo(pool, {
        id: String(Date.now()),
        title: input.title,
        completed: input.completed ?? false,
        date: input.date ?? null,
        priority: input.priority ?? "low",
      });
      return res.status(201).json(todo);
    }
    const store = getTodosStore();
    const todo: Todo = {
      id: String(Date.now()),
      title: input.title,
      completed: input.completed ?? false,
      date: input.date ?? null,
      priority: input.priority ?? "low",
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    };
    setTodosStore([todo, ...store]);
    res.status(201).json(todo);
  } catch (error) {
    handleZodErrorResponse(res, error);
  }
};
