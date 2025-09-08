import { useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppSelector } from "@/store";
import type {
  CursorResponse,
  PageResponse,
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
} from "@shared/todos";
import { toast } from "sonner";
import { apiFetch } from "@/lib/apiFetch";

function buildQueryParams(obj: Record<string, any>) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    params.set(k, String(v));
  });
  return params.toString();
}

export function useTodosData() {
  const filters = useAppSelector((s) => s.filters);
  const queryKey = useMemo(() => ["todos", filters], [filters]);
  const queryClient = useQueryClient();

  const pageQuery = useQuery<PageResponse>({
    queryKey,
    queryFn: async () => {
      const qs = buildQueryParams({
        page: filters.page,
        limit: filters.limit,
        completed: filters.completed,
        priority: filters.priority,
        dateGte: filters.dateGte,
        dateLte: filters.dateLte,
        sort: filters.sort,
        order: filters.order,
        search: filters.search || undefined,
      });
      const res = await apiFetch(`/todos?${qs}`);
      return res.json();
    },
    enabled: filters.viewMode === "page",
    staleTime: 5_000,
  });

  const infQuery = useInfiniteQuery<CursorResponse>({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const qs = buildQueryParams({
        nextCursor: pageParam ?? null,
        limit: filters.limit,
        completed: filters.completed,
        priority: filters.priority,
        dateGte: filters.dateGte,
        dateLte: filters.dateLte,
        sort: filters.sort,
        order: filters.order,
        search: filters.search || undefined,
      });
      const res = await apiFetch(`/todos/scroll?${qs}`);
      return res.json();
    },
    initialPageParam: null,
    getNextPageParam: (last) =>
      last && last.hasNextPage ? last.nextCursor : null,
    initialData: { pages: [], pageParams: [null] } as any,
    retry: 1,
    enabled: filters.viewMode === "scroll",
    staleTime: 5_000,
  });

  const addMutation = useMutation({
    mutationFn: async (input: CreateTodoInput) => {
      const res = await apiFetch("/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      return res.json() as Promise<Todo>;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const optimistic: Todo = {
        id: `opt-${Date.now()}`,
        title: variables.title,
        completed: variables.completed ?? false,
        date: variables.date ?? null,
        priority: variables.priority ?? "low",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (filters.viewMode === "page") {
        const prev = queryClient.getQueryData<PageResponse>(queryKey);
        if (prev) {
          const copy = { ...prev, todos: [optimistic, ...prev.todos] };
          queryClient.setQueryData(queryKey, copy);
        }
      } else {
        const prev = queryClient.getQueryData<{
          pages: CursorResponse[];
          pageParams: any[];
        }>(queryKey);
        if (prev) {
          const first = prev.pages[0];
          const nextPages = [
            { ...first, todos: [optimistic, ...first.todos] },
            ...prev.pages.slice(1),
          ];
          queryClient.setQueryData(queryKey, { ...prev, pages: nextPages });
        }
      }
      return { queryKey };
    },
    onError: (_err, _vars, ctx) => {
      toast.error("Failed to create todo");
      if (ctx) queryClient.invalidateQueries({ queryKey: ctx.queryKey });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const toggleMutation = useMutation({
    mutationFn: async (todo: Todo) => {
      const res = await apiFetch(`/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      return res.json() as Promise<Todo>;
    },
    onMutate: async (todo) => {
      await queryClient.cancelQueries({ queryKey });
      const updateIn = (list: Todo[]) =>
        list.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t,
        );
      if (filters.viewMode === "page") {
        const prev = queryClient.getQueryData<PageResponse>(queryKey);
        if (prev)
          queryClient.setQueryData(queryKey, {
            ...prev,
            todos: updateIn(prev.todos),
          });
      } else {
        const prev = queryClient.getQueryData<{
          pages: CursorResponse[];
          pageParams: any[];
        }>(queryKey);
        if (prev) {
          const pages = prev.pages.map((p) => ({
            ...p,
            todos: updateIn(p.todos),
          }));
          queryClient.setQueryData(queryKey, { ...prev, pages });
        }
      }
      return { queryKey };
    },
    onError: () => {
      toast.error("Failed to update");
      queryClient.invalidateQueries({ queryKey });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: UpdateTodoInput;
    }) => {
      const res = await apiFetch(`/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      return res.json() as Promise<Todo>;
    },
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey });
      const apply = (list: Todo[]) =>
        list.map((t) => (t.id === id ? { ...t, ...patch } : t));
      if (filters.viewMode === "page") {
        const prev = queryClient.getQueryData<PageResponse>(queryKey);
        if (prev)
          queryClient.setQueryData(queryKey, {
            ...prev,
            todos: apply(prev.todos),
          });
      } else {
        const prev = queryClient.getQueryData<{
          pages: CursorResponse[];
          pageParams: any[];
        }>(queryKey);
        if (prev) {
          const pages = prev.pages.map((p) => ({
            ...p,
            todos: apply(p.todos),
          }));
          queryClient.setQueryData(queryKey, { ...prev, pages });
        }
      }
      return { queryKey };
    },
    onError: () => {
      toast.error("Failed to update");
      queryClient.invalidateQueries({ queryKey });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/todos/${id}`, { method: "DELETE" });
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      if (filters.viewMode === "page") {
        const prev = queryClient.getQueryData<PageResponse>(queryKey);
        if (prev)
          queryClient.setQueryData(queryKey, {
            ...prev,
            todos: prev.todos.filter((t) => t.id !== id),
          });
      } else {
        const prev = queryClient.getQueryData<{
          pages: CursorResponse[];
          pageParams: any[];
        }>(queryKey);
        if (prev) {
          const pages = prev.pages.map((p) => ({
            ...p,
            todos: p.todos.filter((t) => t.id !== id),
          }));
          queryClient.setQueryData(queryKey, { ...prev, pages });
        }
      }
      return { queryKey };
    },
    onError: () => {
      toast.error("Failed to delete");
      queryClient.invalidateQueries({ queryKey });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    filters,
    pageQuery,
    infQuery,
    addMutation,
    toggleMutation,
    deleteMutation,
    updateMutation,
  };
}
