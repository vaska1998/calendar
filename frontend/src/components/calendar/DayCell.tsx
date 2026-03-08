import styled from '@emotion/styled';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import HolidayChip from './HolidayChip';
import InlineTaskEditor from './InlineTaskEditor';
import { useState } from 'react';
import { ButtonGhost } from '../ui';
import type { Task } from '../../infrastructure/dto/task/task.ts';
import type { DayCellModel } from '../../types';
import type { Holiday } from '../../infrastructure/dto/nager-date/holiday.ts';

const CellContainer = styled.div<{
  isCurrentMonth: boolean;
  isToday: boolean;
  isOver: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 120px;
  background: ${({ isCurrentMonth, isOver }) =>
    isOver
      ? 'linear-gradient(180deg, #e8f5e9, #dff0df)'
      : isCurrentMonth
        ? 'linear-gradient(180deg, #ffffff, #f7f7f7)'
        : 'linear-gradient(180deg, #f5f5f5, #ececec)'};
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.15s;
  will-change: transform, box-shadow;

  box-shadow: ${({ isToday, isOver }) =>
    isToday
      ? '0 8px 24px rgba(242,157,56,0.18)'
      : isOver
        ? '0 8px 20px rgba(0,0,0,0.08)'
        : '0 2px 6px rgba(0,0,0,0.06)'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ isToday }) =>
      isToday ? '0 12px 30px rgba(242,157,56,0.22)' : '0 12px 26px rgba(0,0,0,0.12)'};
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0));
    mix-blend-mode: overlay;
    opacity: 0.6;
  }
`;

const CellHeader = styled.div<{ isToday: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  flex-shrink: 0;
`;

const DayNumber = styled.span<{ isToday: boolean; isCurrentMonth: boolean }>`
  font-size: 13px;
  font-weight: ${({ isToday }) => (isToday ? 700 : 500)};
  color: ${({ isCurrentMonth }) => (isCurrentMonth ? '#333' : '#aaa')};
  background: ${({ isToday }) => (isToday ? '#f29d38' : 'none')};
  color: ${({ isToday, isCurrentMonth }) => (isToday ? '#fff' : isCurrentMonth ? '#333' : '#aaa')};
  width: ${({ isToday }) => (isToday ? '24px' : 'auto')};
  height: ${({ isToday }) => (isToday ? '24px' : 'auto')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const TaskCount = styled.span`
  font-size: 10px;
  color: #999;
`;

const HolidaysArea = styled.div`
  padding: 0 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
`;

const TasksArea = styled.div`
  flex: 1;
  padding: 2px 4px 4px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-height: 24px;
`;

interface DayCellProps {
  day: DayCellModel;
  tasks: Task[];
  holidays: Holiday[];
}

const DayCell = ({ day, tasks, holidays }: DayCellProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day.dayKey}`,
    data: {
      type: 'day',
      dayKey: day.dayKey,
    },
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <CellContainer
      isCurrentMonth={day.isCurrentMonth}
      isToday={day.isToday}
      isOver={isOver}
      ref={setNodeRef}
    >
      <CellHeader isToday={day.isToday}>
        <DayNumber isToday={day.isToday} isCurrentMonth={day.isCurrentMonth}>
          {day.dayNumber}
        </DayNumber>
        {tasks.length > 0 && (
          <TaskCount>
            {tasks.length} card{tasks.length !== 1 ? 's' : ''}
          </TaskCount>
        )}
      </CellHeader>
      {holidays.length > 0 && (
        <HolidaysArea>
          {holidays.map((h, i) => (
            <HolidayChip key={`${h.date}-${i}`} holiday={h} />
          ))}
        </HolidaysArea>
      )}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <TasksArea>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}

          {isAdding ? (
            <InlineTaskEditor dayKey={day.dayKey} onClose={() => setIsAdding(false)} />
          ) : (
            <ButtonGhost onClick={() => setIsAdding(true)}>+ Add task</ButtonGhost>
          )}
        </TasksArea>
      </SortableContext>
    </CellContainer>
  );
};

export default DayCell;
