import type { Todo } from "../types/todos";

export const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Pratice about Frontend Developer",
    completed: false,
    date: new Date().toISOString(),
    priority: "low",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Complete JavaScript Algorithms",
    completed: false,
    date: new Date(Date.now() + 38 * 86400000).toISOString(),
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Build a Responsive Website",
    completed: false,
    date: new Date(Date.now() + 76 * 86400000).toISOString(),
    priority: "high",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Explore CSS Frameworks",
    completed: false,
    date: new Date(Date.now() + 103 * 86400000).toISOString(),
    priority: "low",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
