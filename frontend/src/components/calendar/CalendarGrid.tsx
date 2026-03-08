import styled from '@emotion/styled';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import DayCell from './DayCell';
import { WEEKDAYS } from '../../utils/date';
import type { Task } from '../../infrastructure/dto/task/task.ts';
import type { DayCellModel } from '../../types';
import type { HolidaysByDay } from '../../infrastructure/dto/nager-date/holiday.ts';
import { useCalendar } from '../../contexts/calendar.context.tsx';

const GridWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background: #e8e8e8;
`;

const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const WeekdayLabel = styled.div`
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 1px;
  flex: 1;
  background: #e0e0e0;
`;

const DragOverlayCard = styled.div`
  padding: 4px 8px;
  background: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface CalendarGridProps {
  cells: DayCellModel[];
  holidaysByDay: HolidaysByDay;
}

const CalendarGrid = ({ cells, holidaysByDay }: CalendarGridProps) => {
  const { filteredTasksByDay, tasksByDay, reorderTasks, moveTask, searchQuery } = useCalendar();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as Task | undefined;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskData = active.data.current?.task as Task | undefined;
    if (!activeTaskData) return;

    const overId = String(over.id);
    const overData = over.data.current;

    let targetDayKey: string;
    if (overData?.type === 'day') {
      targetDayKey = overData.dayKey as string;
    } else if (overData?.type === 'task') {
      targetDayKey = (overData.task as Task).dayKey;
    } else if (overId.startsWith('day-')) {
      targetDayKey = overId.replace('day-', '');
    } else {
      const allTasks = Object.values(tasksByDay).flat();
      const overTask = allTasks.find((t) => t.id === overId);
      if (!overTask) return;
      targetDayKey = overTask.dayKey;
    }

    const sourceDayKey = activeTaskData.dayKey;

    if (sourceDayKey === targetDayKey) {
      const dayTasks = [...(tasksByDay[sourceDayKey] || [])];
      const oldIndex = dayTasks.findIndex((t) => t.id === active.id);
      let newIndex = dayTasks.findIndex((t) => t.id === over.id);

      if (oldIndex === -1) return;
      if (newIndex === -1) newIndex = dayTasks.length - 1;

      const reordered = arrayMove(dayTasks, oldIndex, newIndex);
      reorderTasks(
        sourceDayKey,
        reordered.map((t) => t.id),
      );
    } else {
      const targetTasks = [...(tasksByDay[targetDayKey] || [])];
      let toIndex = targetTasks.findIndex((t) => t.id === over.id);
      if (toIndex === -1) toIndex = targetTasks.length;

      moveTask(activeTaskData.id, targetDayKey, toIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <GridWrapper>
        <WeekdayHeader>
          {WEEKDAYS.map((day) => (
            <WeekdayLabel key={day}>{day}</WeekdayLabel>
          ))}
        </WeekdayHeader>

        <GridContainer>
          {cells.map((cell) => (
            <DayCell
              key={cell.dayKey}
              day={cell}
              tasks={
                searchQuery ? filteredTasksByDay[cell.dayKey] || [] : tasksByDay[cell.dayKey] || []
              }
              holidays={holidaysByDay[cell.dayKey] || []}
            />
          ))}
        </GridContainer>
      </GridWrapper>

      <DragOverlay>
        {activeTask ? <DragOverlayCard>{activeTask.title}</DragOverlayCard> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CalendarGrid;
