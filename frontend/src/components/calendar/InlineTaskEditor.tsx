import styled from '@emotion/styled';
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../ui';
import { useCalendar } from '../../contexts/calendar.context.tsx';

const EditorWrapper = styled.div`
  padding: 0 2px;
`;

const CompactInput = styled(Input)`
  width: 100%;
  padding: 4px 6px;
  font-size: 12px;
  box-sizing: border-box;
`;

interface InlineTaskEditorProps {
  dayKey: string;
  onClose: () => void;
  taskId?: string;
  initialTitle?: string;
}

const InlineTaskEditor = ({
  dayKey,
  onClose,
  taskId,
  initialTitle = '',
}: InlineTaskEditorProps) => {
  const { addTask, updateTask } = useCalendar();
  const [value, setValue] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      onClose();
      return;
    }

    if (taskId) {
      updateTask(taskId, { title: trimmed });
    } else {
      addTask(dayKey, trimmed);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <EditorWrapper>
      <CompactInput
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder="Task title..."
      />
    </EditorWrapper>
  );
};

export default InlineTaskEditor;
