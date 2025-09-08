import dayjs from "dayjs";
import { Priority, Todo } from "../../../shared/todos";

let todos: Todo[] = [];

function seed() {
  if (todos.length) return;
  const base: Array<{
    title: string;
    date?: string;
    priority: Priority;
    completed?: boolean;
  }> = [
    {
      title: "Pratice about Frontend Developer",
      date: dayjs().toISOString(),
      priority: "low",
    },
    {
      title: "Complete JavaScript Algorithms",
      date: dayjs().add(38, "day").toISOString(),
      priority: "medium",
    },
    {
      title: "Build a Responsive Website",
      date: dayjs().add(76, "day").toISOString(),
      priority: "high",
    },
    {
      title: "Explore CSS Frameworks",
      date: dayjs().add(103, "day").toISOString(),
      priority: "low",
    },
  ];
  todos = base.map((b, idx) => ({
    id: String(idx + 1),
    title: b.title,
    completed: false,
    date: b.date,
    priority: b.priority,
    createdAt: dayjs().toISOString(),
    updatedAt: dayjs().toISOString(),
  }));
}
seed();

export function getTodosStore() {
  return todos;
}

export function setTodosStore(next: Todo[]) {
  todos = next;
}
