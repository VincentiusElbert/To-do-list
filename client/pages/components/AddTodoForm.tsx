import { useState } from "react";
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
import dayjs from "dayjs";
import { useTodosData } from "@/hooks/useTodos";

export default function AddTodoForm() {
  const { addMutation } = useTodosData();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low");
  const [date, setDate] = useState<string>("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addMutation.mutate({
      title: title.trim(),
      priority: priority as any,
      date: date ? dayjs(date).toISOString() : undefined,
    });
    setTitle("");
    setPriority("low");
    setDate("");
  };

  return (
    <form onSubmit={submit} className="grid gap-2 md:grid-cols-4 items-end">
      <div className="md:col-span-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
        />
      </div>
      <div>
        <Label>Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="md:col-span-4">
        <Button type="submit" className="w-full">
          + Add Task
        </Button>
      </div>
    </form>
  );
}
