import { useState, useCallback } from 'react';
import { DragState } from '@/components/KanbanBoard/KanbanBoard.types';

export const useDragAndDrop = () => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    fromColumnId: null,
    draggedIndex: null,
    dragOverColumnId: null,
    dragOverIndex: null,
  });
  
  const handleDragStart = useCallback(
    (e: React.DragEvent | React.KeyboardEvent, taskId: string, columnId: string, index: number) => {
      setDragState({
        isDragging: true,
        draggedId: taskId,
        fromColumnId: columnId,
        draggedIndex: index,
        dragOverColumnId: null,
        dragOverIndex: null,
      });
    },
    []
  );
  
  const handleDragOver = useCallback(
    (columnId: string, index: number) => {
      setDragState(prev => ({
        ...prev,
        dragOverColumnId: columnId,
        dragOverIndex: index,
      }));
    },
    []
  );
  
  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedId: null,
      fromColumnId: null,
      draggedIndex: null,
      dragOverColumnId: null,
      dragOverIndex: null,
    });
  }, []);
  
  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};