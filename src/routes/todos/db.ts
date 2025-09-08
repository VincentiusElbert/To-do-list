import type { Pool } from "mysql2/promise";
import dayjs from "dayjs";
import { mockTodos } from "../../mockup/todos";

let pool: Pool | null = null;

export async function getMySqlPool() {
  if (
    !process.env.MYSQL_HOST ||
    !process.env.MYSQL_DATABASE ||
    !process.env.MYSQL_USER
  )
    return null;
  if (pool) return pool;
  const mysql = await import("mysql2/promise");
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD ?? undefined,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    namedPlaceholders: true,
    timezone: "+00:00",
  });
  await ensureSchema(pool);
  await seedIfEmpty(pool);
  return pool;
}

async function ensureSchema(p: Pool) {
  await p.query(`CREATE TABLE IF NOT EXISTS todos (
    id VARCHAR(36) PRIMARY KEY,
    title TEXT NOT NULL,
    completed TINYINT(1) NOT NULL DEFAULT 0,
    date DATETIME NULL,
    priority ENUM('low','medium','high') NOT NULL DEFAULT 'low',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
}

async function seedIfEmpty(p: Pool) {
  const [[{ cnt }]]: any = await p.query(`SELECT COUNT(*) as cnt FROM todos`);
  if (Number(cnt) > 0) return;
  const now = dayjs().toDate();
  for (const t of mockTodos) {
    await p.query(
      `INSERT INTO todos (id, title, completed, date, priority, created_at, updated_at)
       VALUES (:id, :title, :completed, :date, :priority, :created_at, :updated_at)`,
      {
        id: t.id,
        title: t.title,
        completed: t.completed ? 1 : 0,
        date: t.date ? dayjs(t.date).toDate() : null,
        priority: t.priority,
        created_at: now,
        updated_at: now,
      },
    );
  }
}
