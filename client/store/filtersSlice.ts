import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CompletedFilter = "all" | "active" | "completed";
export type PriorityFilter = "all" | "low" | "medium" | "high";
export type SortKey = "date" | "priority";
export type Order = "asc" | "desc";
export type ViewMode = "page" | "scroll";

export interface FiltersState {
  completed: CompletedFilter;
  priority: PriorityFilter;
  dateGte?: string;
  dateLte?: string;
  sort: SortKey;
  order: Order;
  search: string;
  viewMode: ViewMode;
  page: number;
  limit: number;
}

const initialState: FiltersState = {
  completed: "all",
  priority: "all",
  sort: "date",
  order: "asc",
  search: "",
  viewMode: "scroll",
  page: 1,
  limit: 10,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCompleted(state, action: PayloadAction<CompletedFilter>) {
      state.completed = action.payload;
    },
    setPriority(state, action: PayloadAction<PriorityFilter>) {
      state.priority = action.payload;
    },
    setDateRange(state, action: PayloadAction<{ gte?: string; lte?: string }>) {
      state.dateGte = action.payload.gte;
      state.dateLte = action.payload.lte;
    },
    setSort(state, action: PayloadAction<SortKey>) {
      state.sort = action.payload;
    },
    setOrder(state, action: PayloadAction<Order>) {
      state.order = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    resetFilters(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setCompleted,
  setPriority,
  setDateRange,
  setSort,
  setOrder,
  setSearch,
  setViewMode,
  setPage,
  setLimit,
  resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
