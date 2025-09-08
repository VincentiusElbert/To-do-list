import { z } from "zod";

export const PriorityEnum = z.enum(["low", "medium", "high"]);
export type Priority = z.infer<typeof PriorityEnum>;

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  completed: z.boolean(),
  date: z.string().datetime().optional().nullable(),
  priority: PriorityEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Todo = z.infer<typeof TodoSchema>;

export const CreateTodoSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean().optional(),
  date: z.string().datetime().optional(),
  priority: PriorityEnum.default("low"),
});
export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;

export const UpdateTodoSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
  date: z.string().datetime().nullable().optional(),
  priority: PriorityEnum.optional(),
});
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;

export const FiltersSchema = z.object({
  completed: z
    .union([z.literal("all"), z.literal("active"), z.literal("completed")])
    .optional(),
  priority: z.union([z.literal("all"), PriorityEnum]).optional(),
  dateGte: z.string().datetime().optional(),
  dateLte: z.string().datetime().optional(),
  sort: z.union([z.literal("date"), z.literal("priority")]).optional(),
  order: z.union([z.literal("asc"), z.literal("desc")]).optional(),
  search: z.string().optional(),
});
export type Filters = z.infer<typeof FiltersSchema>;

export const PageQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  })
  .and(FiltersSchema.partial());
export type PageQuery = z.infer<typeof PageQuerySchema>;

export const CursorQuerySchema = z
  .object({
    nextCursor: z.union([z.string(), z.null()]).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .and(FiltersSchema.partial());
export type CursorQuery = z.infer<typeof CursorQuerySchema>;

export interface PageResponse {
  todos: Todo[];
  totalTodos: number;
  hasNextPage: boolean;
  nextPage: number | null;
}

export interface CursorResponse {
  todos: Todo[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
