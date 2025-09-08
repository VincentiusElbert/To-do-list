import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store";
import { setCompleted, setDateRange, setLimit } from "@/store/filtersSlice";
import FiltersBar from "./components/FiltersBar";
import AddTaskDialog from "./components/AddTaskDialog";
import TodoList from "./components/TodoList";
import ThemeToggle from "@/components/ThemeToggle";
import dayjs from "dayjs";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ThreeDotsWave from "@/components/loaders/ThreeDotsWave";

export default function Index() {
  const f = useAppSelector((s) => s.filters);
  const dispatch = useAppDispatch();

  const [switching, setSwitching] = useState(false);
  const startSwitch = () => {
    setSwitching(true);
    setTimeout(() => setSwitching(false), 500);
  };

  const setToday = () => {
    startSwitch();
    const start = dayjs().startOf("day").toISOString();
    const end = dayjs().endOf("day").toISOString();
    dispatch(setCompleted("all"));
    dispatch(setDateRange({ gte: start, lte: end }));
    dispatch(setLimit(10));
  };
  const setUpcoming = () => {
    startSwitch();
    const start = dayjs().add(1, "day").startOf("day").toISOString();
    dispatch(setCompleted("all"));
    dispatch(setDateRange({ gte: start, lte: undefined }));
    dispatch(setLimit(20));
  };
  const setCompletedOnly = () => {
    startSwitch();
    dispatch(setCompleted("completed"));
    dispatch(setDateRange({ gte: undefined, lte: undefined }));
    dispatch(setLimit(5));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl lg:max-w-3xl mx-auto p-4 space-y-4">
        <header className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">What's on Your Plan Today?</h1>
              <p className="text-sm text-muted-foreground">
                Your productivity starts now.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <Tabs
          value={
            f.completed === "completed"
              ? "completed"
              : f.dateGte
                ? dayjs(f.dateGte).isAfter(dayjs(), "day")
                  ? "upcoming"
                  : "today"
                : "today"
          }
        >
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger
              value="today"
              onClick={setToday}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              onClick={setUpcoming}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              onClick={setCompletedOnly}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Completed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="today" />
          <TabsContent value="upcoming" />
          <TabsContent value="completed" />
        </Tabs>

        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">
            {f.completed === "completed"
              ? "Completed"
              : f.dateGte
                ? dayjs(f.dateGte).isAfter(dayjs(), "day")
                  ? "Upcoming"
                  : "Today"
                : "Today"}
          </h2>
          <span className="text-xs rounded-full bg-muted px-2 py-0.5">
            {f.limit} Item
          </span>
        </div>

        <FiltersBar />

        <div className="relative min-h-10">
          <AnimatePresence initial={false} mode="popLayout">
            {switching && (
              <motion.div
                key="switch-loader"
                className="absolute inset-0 grid place-items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <ThreeDotsWave
                  colors={["bg-blue-500", "bg-green-500", "bg-red-500"]}
                  size={12}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={`${f.completed}-${f.dateGte ?? ""}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TodoList />
          </motion.div>
        </div>

        <AddTaskDialog />
      </div>
    </div>
  );
}
