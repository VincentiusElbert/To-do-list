import { useAppDispatch, useAppSelector } from "@/store";
import {
  resetFilters,
  setCompleted,
  setDateRange,
  setOrder,
  setPriority,
  setSearch,
  setSort,
  setViewMode,
} from "@/store/filtersSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function FiltersBar() {
  const f = useAppSelector((s) => s.filters);
  const dispatch = useAppDispatch();

  return (
    <>
      {/* Mobile: search + filter icon */}
      <div className="md:hidden space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            value={f.search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search"
          />
          {f.search && (
            <button
              type="button"
              aria-label="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
              onClick={() => dispatch(setSearch(""))}
            >
              ×
            </button>
          )}
        </div>
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Filter">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => dispatch(setPriority("all"))}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch(setPriority("low"))}>
                Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch(setPriority("medium"))}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch(setPriority("high"))}>
                High
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop: full filter grid */}
      <div className="hidden md:grid gap-2 md:grid-cols-6">
        <div className="md:col-span-2">
          <Label>Search</Label>
          <div className="relative">
            <Input
              value={f.search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              placeholder="Search..."
            />
            {f.search && (
              <button
                type="button"
                aria-label="Clear"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm"
                onClick={() => dispatch(setSearch(""))}
              >
                ×
              </button>
            )}
          </div>
        </div>
        <div>
          <Label>Completed</Label>
          <Select
            value={f.completed}
            onValueChange={(v) => dispatch(setCompleted(v as any))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Priority</Label>
          <Select
            value={f.priority}
            onValueChange={(v) => dispatch(setPriority(v as any))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Sort</Label>
          <Select
            value={f.sort}
            onValueChange={(v) => dispatch(setSort(v as any))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Order</Label>
          <Select
            value={f.order}
            onValueChange={(v) => dispatch(setOrder(v as any))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Asc</SelectItem>
              <SelectItem value="desc">Desc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>View</Label>
          <Select
            value={f.viewMode}
            onValueChange={(v) => dispatch(setViewMode(v as any))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="page">Page</SelectItem>
              <SelectItem value="scroll">Infinite</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {f.viewMode === "page" && (
          <div>
            <Label>Per Page</Label>
            <Select
              value={String(f.limit)}
              onValueChange={(v) => dispatch(setLimit(Number(v)))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="md:col-span-2">
          <Label>Date From</Label>
          <Input
            type="date"
            value={f.dateGte?.slice(0, 10) ?? ""}
            onChange={(e) =>
              dispatch(
                setDateRange({
                  gte: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                  lte: f.dateLte,
                }),
              )
            }
          />
        </div>
        <div className="md:col-span-2">
          <Label>Date To</Label>
          <Input
            type="date"
            value={f.dateLte?.slice(0, 10) ?? ""}
            onChange={(e) =>
              dispatch(
                setDateRange({
                  gte: f.dateGte,
                  lte: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                }),
              )
            }
          />
        </div>
        <div className="md:col-span-2 flex items-end">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => dispatch(resetFilters())}
          >
            Reset
          </Button>
        </div>
      </div>
    </>
  );
}
