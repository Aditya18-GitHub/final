import React, { useState, useCallback } from 'react';
import { KanbanViewProps, KanbanTask } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { reorderTasks, moveTaskBetweenColumns } from '@/utils/column.utils';

export const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns: initialColumns,
  tasks: initialTasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);
  
  const dragAndDrop = useDragAndDrop();
  
  const handleTaskEdit = useCallback((task: KanbanTask) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  }, []);
  
  const handleTaskDeleteClick = useCallback((taskId: string) => {
    onTaskDelete(taskId);
  }, [onTaskDelete]);
  
  const handleAddTask = useCallback((columnId: string) => {
    setSelectedTask(null);
    setTargetColumnId(columnId);
    setIsTaskModalOpen(true);
  }, []);
  
  const handleTaskSave = useCallback((task: KanbanTask) => {
    if (selectedTask) {
      onTaskUpdate(task.id, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignee: task.assignee,
        tags: task.tags,
        dueDate: task.dueDate,
      });
      
      // If status changed, move the task between columns
      if (selectedTask.status !== task.status) {
        onTaskMove(task.id, selectedTask.status, task.status, 0);
      }
    } else if (targetColumnId) {
      onTaskCreate(targetColumnId, task);
    }
    
    setIsTaskModalOpen(false);
    setSelectedTask(null);
    setTargetColumnId(null);
  }, [selectedTask, targetColumnId, onTaskCreate, onTaskUpdate, onTaskMove]);
  
  const handleTaskDeleteConfirm = useCallback((taskId: string) => {
    onTaskDelete(taskId);
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  }, [onTaskDelete]);
  
  const handleDragStart = useCallback(
    (e: React.DragEvent | React.KeyboardEvent, taskId: string, columnId: string, index: number) => {
      dragAndDrop.handleDragStart(e, taskId, columnId, index);
    },
    [dragAndDrop]
  );
  
  const handleDragOver = useCallback(
    (e: React.DragEvent, columnId: string, index: number) => {
      e.preventDefault();
      dragAndDrop.handleDragOver(columnId, index);
    },
    [dragAndDrop]
  );
  
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      
      const { dragState } = dragAndDrop;
      
      if (!dragState.draggedId || !dragState.fromColumnId || dragState.dragOverColumnId === null) {
        dragAndDrop.handleDragEnd();
        return;
      }
      
      const sourceColumn = columns.find(c => c.id === dragState.fromColumnId);
      const destColumn = columns.find(c => c.id === dragState.dragOverColumnId);
      
      if (!sourceColumn || !destColumn) {
        dragAndDrop.handleDragEnd();
        return;
      }
      
      const dragIndex = dragState.draggedIndex ?? 0;
      const dropIndex = dragState.dragOverIndex ?? 0;
      
      if (dragState.fromColumnId === dragState.dragOverColumnId) {
        // Reorder within same column
        const newTaskIds = reorderTasks(sourceColumn.taskIds, dragIndex, dropIndex);
        setColumns(prev => prev.map(col =>
          col.id === sourceColumn.id ? { ...col, taskIds: newTaskIds } : col
        ));
      } else {
        // Move between columns
        const { source, destination } = moveTaskBetweenColumns(
          sourceColumn.taskIds,
          destColumn.taskIds,
          dragIndex,
          dropIndex
        );
        
        setColumns(prev => prev.map(col => {
          if (col.id === sourceColumn.id) return { ...col, taskIds: source };
          if (col.id === destColumn.id) return { ...col, taskIds: destination };
          return col;
        }));
        
        // Update task status
        onTaskMove(dragState.draggedId, sourceColumn.id, destColumn.id, dropIndex);
      }
      
      dragAndDrop.handleDragEnd();
    },
    [dragAndDrop, columns, onTaskMove]
  );
  
  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-neutral-900">Kanban Board</h1>
        <p className="text-sm text-neutral-600 mt-1">Drag and drop tasks to organize your work</p>
      </div>
      
      {/* Board */}
      <div
        className="flex-1 overflow-x-auto px-6 py-6"
        onDragEnd={dragAndDrop.handleDragEnd}
        onDrop={(e) => e.preventDefault()}
      >
        <div className="flex gap-4 h-full">
          {columns.map(column => {
            const columnTasks = column.taskIds
              .map(id => tasks[id])
              .filter((task): task is KanbanTask => !!task);
            
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={columnTasks}
                onTaskEdit={handleTaskEdit}
                onTaskDelete={handleTaskDeleteClick}
                onAddTask={handleAddTask}
                dragState={dragAndDrop.dragState}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            );
          })}
        </div>
      </div>
      
      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
          setTargetColumnId(null);
        }}
        task={selectedTask}
        columns={columns}
        onSave={handleTaskSave}
        onDelete={handleTaskDeleteConfirm}
      />
    </div>
  );
};