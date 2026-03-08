import styled from '@emotion/styled';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import InlineTaskEditor from './InlineTaskEditor';
import { IconButton } from '../ui';
import type { Task } from '../../infrastructure/dto/task/task.ts';
import {
  TASK_STATUS_COLORS,
  TASK_STATUS_LABELS,
  type TaskStatus,
} from '../../infrastructure/dto/task/task.ts';
import { useCalendar } from '../../contexts/calendar.context.tsx';

const STATUS_ORDER: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

const CardWrapper = styled.div<{ isDragging: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 4px 6px;
  margin: 2px 0;
  background: ${({ isDragging }) => (isDragging ? '#e3f2fd' : '#fff')};
  border: 1px solid ${({ isDragging }) => (isDragging ? '#90caf9' : '#e0e0e0')};
  border-radius: 4px;
  font-size: 12px;
  color: #333;
  cursor: grab;
  user-select: none;
  line-height: 1.4;
  box-shadow: ${({ isDragging }) =>
    isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.05)'};
  opacity: ${({ isDragging }) => (isDragging ? 0.9 : 1)};
  transition:
    box-shadow 0.15s,
    border-color 0.15s;

  &:hover {
    border-color: #bbb;
  }
`;

const TaskTitle = styled.span`
  flex: 1;
  word-break: break-word;
`;

const DeleteBtn = styled(IconButton)`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  font-size: 14px;
  color: #bbb;

  &:hover {
    color: #e53935;
    background: #ffebee;
    border-color: transparent;
  }
`;

const ColorBar = styled.div<{ color: string }>`
  width: 8px;
  min-height: 14px;
  align-self: stretch;
  border-radius: 2px;
  background: ${({ color }) => color};
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.7;
  }
`;

const StatusTooltip = styled.div<{ top: number; left: number }>`
  position: fixed;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  z-index: 9999;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: 2px 0;
  min-width: 110px;
`;

const StatusOption = styled.button<{ active: boolean; color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  border: none;
  background: ${({ active }) => (active ? '#f5f5f5' : 'transparent')};
  padding: 5px 10px;
  font-size: 11px;
  color: #333;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #f0f0f0;
  }

  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ color }) => color};
  }
`;

const CardInner = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { deleteTask, updateTask } = useCalendar();
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const colorBarRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleStatusChange = (status: TaskStatus) => {
    updateTask(task.id, { status });
    setShowStatusMenu(false);
  };

  const openStatusMenu = useCallback(() => {
    if (colorBarRef.current) {
      const rect = colorBarRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 2, left: rect.left });
    }
    setShowStatusMenu(true);
  }, []);

  useEffect(() => {
    if (!showStatusMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        colorBarRef.current &&
        !colorBarRef.current.contains(e.target as Node)
      ) {
        setShowStatusMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showStatusMenu]);

  if (isEditing) {
    return (
      <InlineTaskEditor
        dayKey={task.dayKey}
        taskId={task.id}
        initialTitle={task.title}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  const statusColor = TASK_STATUS_COLORS[task.status ?? 'TODO'];

  return (
    <CardWrapper
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      {...attributes}
      {...listeners}
    >
      <CardInner>
        <ColorBar
          ref={colorBarRef}
          color={statusColor}
          title={`Status: ${TASK_STATUS_LABELS[task.status ?? 'TODO']}. Click to change.`}
          onClick={(e) => {
            e.stopPropagation();
            openStatusMenu();
          }}
          onPointerDown={(e) => e.stopPropagation()}
        />
        {showStatusMenu &&
          createPortal(
            <StatusTooltip
              ref={menuRef}
              top={menuPos.top}
              left={menuPos.left}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {STATUS_ORDER.map((s) => (
                <StatusOption
                  key={s}
                  active={s === (task.status ?? 'TODO')}
                  color={TASK_STATUS_COLORS[s]}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(s);
                  }}
                >
                  {TASK_STATUS_LABELS[s]}
                </StatusOption>
              ))}
            </StatusTooltip>,
            document.body,
          )}
        <TaskTitle onDoubleClick={() => setIsEditing(true)}>{task.title}</TaskTitle>
      </CardInner>
      <DeleteBtn
        onClick={(e) => {
          e.stopPropagation();
          deleteTask(task.id);
        }}
        title="Delete task"
        onPointerDown={(e) => e.stopPropagation()}
      >
        ×
      </DeleteBtn>
    </CardWrapper>
  );
};

export default TaskCard;
