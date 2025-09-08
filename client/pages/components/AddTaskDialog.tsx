import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import dayjs from "dayjs";
import { useTodosData } from "@/hooks/useTodos";
import { toast } from "sonner";

export default function AddTaskDialog() {
  const { addMutation } = useTodosData();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [errors, setErrors] = useState<{
    title?: string;
    priority?: string;
    date?: string;
  }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!title.trim()) next.title = "Title is required";
    if (!priority) next.priority = "Priority is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addMutation.mutate(
      {
        title: title.trim(),
        priority: priority as any,
        date: date ? dayjs(date).toISOString() : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Task Added!");
          setOpen(false);
          setTitle("");
          setPriority("");
          setDate("");
          setErrors({});
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">+ Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[92vw]">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <Label htmlFor="task">Enter your task</Label>
            <Textarea
              id="task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your task"
            />
            {errors.title ? (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            ) : null}
          </div>
          <div>
            <Label>Select priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority ? (
              <p className="text-xs text-red-500 mt-1">{errors.priority}</p>
            ) : null}
          </div>
          <div>
            <Label>Select date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="w-1/2">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-1/2"
              disabled={addMutation.isPending}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
