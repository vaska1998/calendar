import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarContext, type CalendarContextValue } from '../contexts/calendar.context.tsx';
import { useAppUser } from '../contexts/user.context.tsx';
import type { Task, TasksByDay, TaskStatus } from '../infrastructure/dto/task/task.ts';

export function CalendarProvider({
  children,
  dateRange,
}: {
  children: ReactNode;
  dateRange: { from: string; to: string };
}) {
  const { client } = useAppUser();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const tasksKey = useMemo(
    () => ['tasks', dateRange.from, dateRange.to] as const,
    [dateRange.from, dateRange.to],
  );

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: tasksKey,
    queryFn: async () => {
      const response = await client.task.getAll(dateRange.from, dateRange.to);
      if (response.type === 'SUCCESS') return response.result;
      throw new Error('Failed to load tasks');
    },
  });

  const setTasksCache = useCallback(
    (updater: (prev: Task[]) => Task[]) => {
      queryClient.setQueryData<Task[]>(tasksKey, (old) => updater(old ?? []));
    },
    [queryClient, tasksKey],
  );

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: tasksKey }),
    [queryClient, tasksKey],
  );

  const createMutation = useMutation({
    mutationFn: ({ dayKey, title }: { dayKey: string; title: string }) => {
      const dayTasks = tasks.filter((t) => t.dayKey === dayKey);
      const maxOrder = dayTasks.reduce((max, t) => Math.max(max, t.order), 0);
      return client.task.create({ title, dayKey, order: maxOrder + 1 });
    },
    onSuccess: (response) => {
      if (response.type === 'SUCCESS') {
        setTasksCache((prev) => [...prev, response.result]);
      }
    },
    onError: () => invalidate(),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      fields,
    }: {
      id: string;
      fields: Partial<{ title: string; status: TaskStatus; dayKey: string; order: number }>;
    }) => client.task.update(id, fields),
    onMutate: async ({ id, fields }) => {
      await queryClient.cancelQueries({ queryKey: tasksKey });
      const previous = queryClient.getQueryData<Task[]>(tasksKey);
      setTasksCache((prev) => prev.map((t) => (t.id === id ? { ...t, ...fields } : t)));
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(tasksKey, ctx.previous);
    },
    onSettled: () => invalidate(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => client.task.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: tasksKey });
      const previous = queryClient.getQueryData<Task[]>(tasksKey);
      setTasksCache((prev) => prev.filter((t) => t.id !== id));
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(tasksKey, ctx.previous);
    },
    onSettled: () => invalidate(),
  });

  const moveTask = useCallback(
    (taskId: string, toDayKey: string, toIndex: number) => {
      setTasksCache((prev) => {
        const task = prev.find((t) => t.id === taskId);
        if (!task) return prev;

        const others = prev.filter((t) => t.id !== taskId);
        const targetDayTasks = others
          .filter((t) => t.dayKey === toDayKey)
          .sort((a, b) => a.order - b.order);

        const movedTask = { ...task, dayKey: toDayKey };
        targetDayTasks.splice(toIndex, 0, movedTask);
        const reordered = targetDayTasks.map((t, i) => ({ ...t, order: i }));

        const rest = others.filter((t) => t.dayKey !== toDayKey);
        return [...rest, ...reordered];
      });

      const allTasks = queryClient.getQueryData<Task[]>(tasksKey) ?? [];
      const targetDayTasks = allTasks
        .filter((t) => t.dayKey === toDayKey)
        .sort((a, b) => a.order - b.order);

      for (const t of targetDayTasks) {
        client.task.update(t.id, { dayKey: t.dayKey, order: t.order }).then();
      }
      invalidate().then();
    },
    [client, queryClient, tasksKey, setTasksCache, invalidate],
  );

  const reorderTasks = useCallback(
    (dayKey: string, taskIds: string[]) => {
      setTasksCache((prev) =>
        prev.map((t) => {
          if (t.dayKey !== dayKey) return t;
          const newIndex = taskIds.indexOf(t.id);
          if (newIndex === -1) return t;
          return { ...t, order: newIndex };
        }),
      );

      taskIds.forEach((id, index) => {
        client.task.update(id, { order: index }).then();
      });
      invalidate().then();
    },
    [client, setTasksCache, invalidate],
  );

  const tasksByDay = useMemo<TasksByDay>(() => {
    const map: TasksByDay = {};
    for (const task of tasks) {
      if (!map[task.dayKey]) map[task.dayKey] = [];
      map[task.dayKey].push(task);
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.order - b.order);
    }
    return map;
  }, [tasks]);

  const filteredTasksByDay = useMemo<TasksByDay>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tasksByDay;
    const map: TasksByDay = {};
    for (const [dayKey, dayTasks] of Object.entries(tasksByDay)) {
      const filtered = dayTasks.filter((t) => t.title.toLowerCase().includes(q));
      if (filtered.length > 0) map[dayKey] = filtered;
    }
    return map;
  }, [tasksByDay, searchQuery]);

  const addTask = useCallback(
    (dayKey: string, title: string) => createMutation.mutate({ dayKey, title }),
    [createMutation],
  );

  const updateTask = useCallback(
    (taskId: string, fields: { title?: string; status?: TaskStatus }) =>
      updateMutation.mutate({ id: taskId, fields }),
    [updateMutation],
  );

  const deleteTask = useCallback(
    (taskId: string) => deleteMutation.mutate(taskId),
    [deleteMutation],
  );

  const setSearch = useCallback((query: string) => setSearchQuery(query), []);

  const value = useMemo<CalendarContextValue>(
    () => ({
      tasks,
      isLoading,
      searchQuery,
      tasksByDay,
      filteredTasksByDay,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      reorderTasks,
      setSearch,
    }),
    [
      tasks,
      isLoading,
      searchQuery,
      tasksByDay,
      filteredTasksByDay,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      reorderTasks,
      setSearch,
    ],
  );

  return <CalendarContext value={value}>{children}</CalendarContext>;
}
