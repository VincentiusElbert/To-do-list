import { RequestHandler } from "express";
import dayjs from "dayjs";
import { PageQuerySchema, PageResponse, Todo } from "../../../shared/todos";
import { getTodosStore } from "./store";
import { handleZodErrorResponse } from "../../utils/error";

function applyFilters(list: Todo[], q: any): Todo[] {
  let out = [...list];
  const { completed, priority, dateGte, dateLte, search } = q;
  if (completed && completed !== "all") {
    out = out.filter((t) =>
      completed === "completed" ? t.completed : !t.completed,
    );
  }
  if (priority && priority !== "all") {
    out = out.filter((t) => t.priority === priority);
  }
  if (dateGte) {
    out = out.filter((t) =>
      t.date ? dayjs(t.date).isAfter(dayjs(dateGte).subtract(1, "ms")) : true,
    );
  }
  if (dateLte) {
    out = out.filter((t) =>
      t.date ? dayjs(t.date).isBefore(dayjs(dateLte).add(1, "ms")) : true,
    );
  }
  if (search) {
    const s = String(search).toLowerCase();
    out = out.filter((t) => t.title.toLowerCase().includes(s));
  }
  return out;
}

function sortTodos(
  list: Todo[],
  sort?: string,
  order: "asc" | "desc" = "asc",
): Todo[] {
  const dir = order === "asc" ? 1 : -1;
  if (sort === "priority") {
    const rank: Record<string, number> = { low: 1, medium: 2, high: 3 };
    return [...list].sort(
      (a, b) => (rank[a.priority] - rank[b.priority]) * dir,
    );
  }
  // default sort by date then createdAt
  return [...list].sort((a, b) => {
    const aTime = a.date ? dayjs(a.date).valueOf() : 0;
    const bTime = b.date ? dayjs(b.date).valueOf() : 0;
    if (aTime !== bTime) return (aTime - bTime) * dir;
    return (dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()) * dir;
  });
}

export const getTodos: RequestHandler = (req, res) => {
  try {
    const q = PageQuerySchema.parse(req.query);
    const store = getTodosStore();
    const filtered = sortTodos(applyFilters(store, q), q.sort, q.order as any);

    const start = (q.page - 1) * q.limit;
    const pageTodos = filtered.slice(start, start + q.limit);

    const totalTodos = filtered.length;
    const hasNextPage = start + q.limit < totalTodos;
    const nextPage = hasNextPage ? q.page + 1 : null;

    const payload: PageResponse = {
      todos: pageTodos,
      totalTodos,
      hasNextPage,
      nextPage,
    };
    try {
      console.log(`[api] /todos ok page=${q.page} items=${pageTodos.length}`);
    } catch {}
    res.json(payload);
  } catch (error) {
    try {
      console.error("/todos error", error);
    } catch {}
    handleZodErrorResponse(res, error);
  }
};
