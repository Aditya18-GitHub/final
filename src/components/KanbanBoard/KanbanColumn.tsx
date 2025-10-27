import React, { memo, useRef, useState } from 'react';
import { KanbanColumn as KanbanColumnType, KanbanTask, KanbanViewProps } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '../primitives/Button';
import { getColumnStatusText, getWipWarningStatus } from '@/utils/column.utils';
import clsx from 'clsx';

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  onTaskEdit: (task: KanbanTask) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
  dragState: {
    isDragging: boolean;
    draggedId: string | null;
    dragOverColumnId: string | null;
    dragOverIndex: number | null;
  };
  onDragStart: (e: React.DragEvent | React.KeyboardEvent, taskId: string, columnId: string, index: number) => void;
  onDragOver: (e: React.DragEvent, columnId: string, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = memo(({
  column,
  tasks,
  onTaskEdit,
  onTaskDelete,
  onAddTask,
  dragState,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const taskCount = tasks.length;
  const statusText = getColumnStatusText(column);
  const wipStatus = getWipWarningStatus(column);
  const isDragOver = dragState.dragOverColumnId === column.id;
  
  const handleAddTask = () => {
    onAddTask(column.id);
  };
  
  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragState.isDragging) return;
    onDragOver(e, column.id, tasks.length);
  };
  
  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e);
  };
  
  return (
    <div
      className="flex-shrink-0 w-80 flex flex-col"
      role="region"
      aria-label={`${column.title} column. ${taskCount} tasks.`}
    >
      {/* Column Header */}
      <div className="bg-white border-b-2 border-neutral-200 px-4 py-3 rounded-t-lg sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
              aria-hidden="true"
            />
            <h3 className="font-semibold text-neutral-900 text-sm">
              {column.title}
            </h3>
            <span className="text-xs text-neutral-500">
              {statusText}
            </span>
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-neutral-400 hover:text-neutral-600 p-1"
            aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${column.title} column`}
          >
            <svg
              className={clsx('w-5 h-5 transition-transform', isCollapsed && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* WIP Limit Indicator */}
        {column.maxTasks && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
              <span>WIP Limit</span>
              <span className={clsx(
                'font-medium',
                wipStatus === 'limit' && 'text-error-600',
                wipStatus === 'warning' && 'text-warning-600',
                wipStatus === 'ok' && 'text-neutral-600'
              )}>
                {taskCount} / {column.maxTasks}
              </span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-1.5">
              <div
                className={clsx(
                  'h-1.5 rounded-full transition-all',
                  wipStatus === 'limit' && 'bg-error-500',
                  wipStatus === 'warning' && 'bg-warning-500',
                  wipStatus === 'ok' && 'bg-primary-500'
                )}
                style={{ width: `${Math.min(100, (taskCount / column.maxTasks) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Column Content */}
      {!isCollapsed && (
        <>
          <div
            ref={dropZoneRef}
            className={clsx(
              'flex-1 overflow-y-auto px-3 py-2 min-h-[400px] transition-colors',
              isDragOver && 'bg-primary-50'
            )}
            onDragOver={handleDropZoneDragOver}
            onDrop={handleDropZoneDrop}
          >
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-neutral-400 text-sm py-8">
                No tasks yet
              </div>
            ) : (
              <>
                {tasks.map((task, index) => {
                  const taskColumnId = column.id;
                  const isDragging = dragState.draggedId === task.id;
                  const isDraggedOver = dragState.isDragging &&
                    dragState.dragOverColumnId === taskColumnId &&
                    dragState.dragOverIndex === index;
                  
                  return (
                    <KanbanCard
                      key={task.id}
                      task={task}
                      isDragging={isDragging}
                      isDraggedOver={isDraggedOver}
                      onEdit={onTaskEdit}
                      onDelete={onTaskDelete}
                      onDragStart={onDragStart}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                      columnId={taskColumnId}
                      index={index}
                    />
                  );
                })}
                
                {/* Drop indicator at the bottom */}
                {isDragOver && dragState.dragOverIndex === tasks.length && (
                  <div className="border-2 border-dashed border-primary-500 rounded-lg p-4 text-center text-primary-600 text-sm mb-2">
                    Drop here
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Add Task Button */}
          <div className="px-3 py-2 border-t border-neutral-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddTask}
              className="w-full justify-center"
              aria-label={`Add task to ${column.title}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </Button>
          </div>
        </>
      )}
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';
