import dayjs from "dayjs";
import type { Pool } from "mysql2/promise";
import type {
  Filters,
  PageResponse,
  CursorResponse,
  Todo,
  Priority,
} from "../../types/todos";

function buildWhere(filters: Filters) {
  const clauses: string[] = [];
  const params: any = {};
  if (filters.completed && filters.completed !== "all") {
    clauses.push(`completed = :completed`);
    params.completed = filters.completed === "completed" ? 1 : 0;
  }
  if (filters.priority && filters.priority !== "all") {
    clauses.push(`priority = :priority`);
    params.priority = filters.priority;
  }
  if (filters.dateGte) {
    clauses.push(`(date IS NULL OR date >= :dateGte)`);
    params.dateGte = dayjs(filters.dateGte).toDate();
  }
  if (filters.dateLte) {
    clauses.push(`(date IS NULL OR date <= :dateLte)`);
    params.dateLte = dayjs(filters.dateLte).toDate();
  }
  if (filters.search) {
    clauses.push(`LOWER(title) LIKE :search`);
    params.search = `%${String(filters.search).toLowerCase()}%`;
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return { where, params };
}

function sortClause(sort?: string, order: "asc" | "desc" = "asc") {
  if (sort === "priority") {
    return `ORDER BY (CASE priority WHEN 'low' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END) ${order.toUpperCase()}, created_at ${order.toUpperCase()}, id ${order.toUpperCase()}`;
  }
  return `ORDER BY COALESCE(date, '1970-01-01'), created_at ${order.toUpperCase()}, id ${order.toUpperCase()}`;
}

export async function dbGetTodosPage(
  p: Pool,
  q: Filters & {
    page: number;
    limit: number;
    sort?: string;
    order?: "asc" | "desc";
  },
): Promise<PageResponse> {
  const { where, params } = buildWhere(q);
  const [[{ cnt }]]: any = await p.query(
    `SELECT COUNT(*) as cnt FROM todos ${where}`,
    params,
  );
  const offset = (q.page - 1) * q.limit;
  const [rows] = await p.query<any[]>(
    `SELECT id, title, completed, date, priority, created_at, updated_at FROM todos ${where} ${sortClause(q.sort, q.order)} LIMIT :limit OFFSET :offset`,
    { ...params, limit: q.limit, offset },
  );
  const todos: Todo[] = rows.map((r) => ({
    id: String(r.id),
    title: r.title,
    completed: !!r.completed,
    date: r.date ? dayjs(r.date).toISOString() : null,
    priority: r.priority as Priority,
    createdAt: dayjs(r.created_at).toISOString(),
    updatedAt: dayjs(r.updated_at).toISOString(),
  }));
  const hasNextPage = offset + q.limit < Number(cnt);
  return {
    todos,
    totalTodos: Number(cnt),
    hasNextPage,
    nextPage: hasNextPage ? q.page + 1 : null,
  };
}

export async function dbGetTodosScroll(
  p: Pool,
  q: Filters & {
    nextCursor?: string | null;
    limit: number;
    sort?: string;
    order?: "asc" | "desc";
  },
): Promise<CursorResponse> {
  const { where, params } = buildWhere(q);
  let cursorClause = "";
  const extraParams: any = {};
  if (q.nextCursor) {
    const [curRows] = await p.query<any[]>(
      `SELECT created_at, id FROM todos WHERE id = :cid`,
      { cid: q.nextCursor },
    );
    if (curRows.length) {
      const cur = curRows[0];
      cursorClause = `AND (created_at, id) > (:cCreatedAt, :cId)`;
      extraParams.cCreatedAt = cur.created_at;
      extraParams.cId = cur.id;
    }
  }
  const [rows] = await p.query<any[]>(
    `SELECT id, title, completed, date, priority, created_at, updated_at FROM todos ${where} ${cursorClause} ${sortClause(q.sort, q.order)} LIMIT :limit`,
    { ...params, ...extraParams, limit: q.limit },
  );
  const todos: Todo[] = rows.map((r) => ({
    id: String(r.id),
    title: r.title,
    completed: !!r.completed,
    date: r.date ? dayjs(r.date).toISOString() : null,
    priority: r.priority as Priority,
    createdAt: dayjs(r.created_at).toISOString(),
    updatedAt: dayjs(r.updated_at).toISOString(),
  }));
  const last = todos[todos.length - 1];
  const hasNextPage = todos.length === q.limit;
  return {
    todos,
    nextCursor: hasNextPage && last ? last.id : null,
    hasNextPage,
  };
}

export async function dbCreateTodo(
  p: Pool,
  input: {
    id: string;
    title: string;
    completed?: boolean;
    date?: string | null;
    priority?: Priority;
  },
): Promise<Todo> {
  const now = dayjs().toDate();
  const date = input.date ? dayjs(input.date).toDate() : null;
  await p.query(
    `INSERT INTO todos (id, title, completed, date, priority, created_at, updated_at) VALUES (:id, :title, :completed, :date, :priority, :created_at, :updated_at)`,
    {
      id: input.id,
      title: input.title,
      completed: input.completed ? 1 : 0,
      date,
      priority: input.priority ?? "low",
      created_at: now,
      updated_at: now,
    },
  );
  return {
    id: input.id,
    title: input.title,
    completed: !!input.completed,
    date: input.date ?? null,
    priority: (input.priority ?? "low") as Priority,
    createdAt: dayjs(now).toISOString(),
    updatedAt: dayjs(now).toISOString(),
  } as Todo;
}

export async function dbUpdateTodo(
  p: Pool,
  id: string,
  patch: Partial<{
    title: string;
    completed: boolean;
    date: string | null;
    priority: Priority;
  }>,
): Promise<Todo | null> {
  const [rows] = await p.query<any[]>(`SELECT * FROM todos WHERE id = :id`, {
    id,
  });
  if (!rows.length) return null;
  const cur = rows[0];
  const next = {
    title: patch.title ?? cur.title,
    completed:
      typeof patch.completed === "boolean"
        ? patch.completed
          ? 1
          : 0
        : cur.completed,
    date:
      patch.date === null
        ? null
        : patch.date
          ? dayjs(patch.date).toDate()
          : cur.date,
    priority: patch.priority ?? cur.priority,
  } as any;
  const now = dayjs().toDate();
  await p.query(
    `UPDATE todos SET title=:title, completed=:completed, date=:date, priority=:priority, updated_at=:updated_at WHERE id=:id`,
    { id, ...next, updated_at: now },
  );
  return {
    id: String(id),
    title: next.title,
    completed: !!next.completed,
    date: next.date ? dayjs(next.date).toISOString() : null,
    priority: next.priority as Priority,
    createdAt: dayjs(cur.created_at).toISOString(),
    updatedAt: dayjs(now).toISOString(),
  } as Todo;
}

export async function dbDeleteTodo(p: Pool, id: string) {
  await p.query(`DELETE FROM todos WHERE id = :id`, { id });
}
