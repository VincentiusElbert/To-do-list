import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Pencil } from "lucide-react";
import dayjs from "dayjs";
import type { Todo } from "@shared/todos";
import { useTodosData } from "@/hooks/useTodos";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import ThreeDotsWave from "@/components/loaders/ThreeDotsWave";

function PriorityBadge({ p }: { p: Todo["priority"] }) {
  const color =
    p === "high"
      ? "bg-pink-600"
      : p === "medium"
        ? "bg-yellow-500"
        : "bg-green-600";
  return (
    <Badge className={`${color} text-white`}>
      {p.charAt(0).toUpperCase() + p.slice(1)}
    </Badge>
  );
}

export default function TodoItem({ todo }: { todo: Todo }) {
  const { toggleMutation, deleteMutation, updateMutation } = useTodosData();
  const [open, setOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [priority, setPriority] = useState<Todo["priority"]>(todo.priority);
  const [date, setDate] = useState<string>(
    todo.date ? dayjs(todo.date).format("YYYY-MM-DD") : "",
  );

  const onDelete = () => {
    setWorking(true);
    deleteMutation.mutate(todo.id, {
      onSuccess: () => toast.success("Task removed"),
      onSettled: () => setWorking(false),
    });
  };
  const onUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setWorking(true);
    updateMutation.mutate(
      {
        id: todo.id,
        patch: {
          title,
          priority,
          date: date ? dayjs(date).toISOString() : null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Changes saved");
          setOpen(false);
        },
        onSettled: () => setWorking(false),
      },
    );
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 flex items-start gap-3">
      <Checkbox
        checked={todo.completed}
        disabled={working}
        onCheckedChange={() => {
          setWorking(true);
          toggleMutation.mutate(todo, { onSettled: () => setWorking(false) });
        }}
      />
      <div className="flex-1">
        <div
          className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}
        >
          {todo.title}
        </div>
        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
          <span>
            {todo.date ? dayjs(todo.date).format("MMM D, YYYY") : "No date"}
          </span>
          <PriorityBadge p={todo.priority} />
        </div>
      </div>
      {working ? (
        <div className="w-10 flex items-center justify-center">
          <ThreeDotsWave
            colors={["bg-blue-500", "bg-green-500", "bg-red-500"]}
            size={8}
          />
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="More actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="flex items-center gap-2"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600 flex items-center gap-2"
            >
              <Trash className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md w-[92vw]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={onUpdate} className="space-y-3">
            <div>
              <Label htmlFor={`t-${todo.id}`}>Enter your task</Label>
              <Input
                id={`t-${todo.id}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>Select priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Select date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
