import React, { memo } from 'react';
import { KanbanTask } from './KanbanBoard.types';
import { Avatar } from '../primitives/Avatar';
import { getPriorityColor, formatDate, isOverdue, getInitials } from '@/utils/task.utils';
import clsx from 'clsx';

interface KanbanCardProps {
  task: KanbanTask;
  isDragging?: boolean;
  isDraggedOver?: boolean;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (e: React.DragEvent | React.KeyboardEvent, taskId: string, columnId: string, index: number) => void;
  onDragOver: (e: React.DragEvent, columnId: string, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  columnId: string;
  index: number;
}

export const KanbanCard: React.FC<KanbanCardProps> = memo(({
  task,
  isDragging = false,
  isDraggedOver = false,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  columnId,
  index,
}) => {
  const handleClick = () => {
    onEdit(task);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };
  
  const handleDragStartEvent = (e: React.DragEvent) => {
    onDragStart(e, task.id, columnId, index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  };
  
  const handleKeyboardDrag = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onDragStart(e, task.id, columnId, index);
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onDelete(task.id);
    }
  };
  
  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e);
  };
  
  const priorityColor = task.priority ? getPriorityColor(task.priority) : '';
  
  return (
    <div
      draggable
      onDragStart={handleDragStartEvent}
      onDragOver={(e) => onDragOver(e, columnId, index)}
      onDrop={handleDropEvent}
      onKeyDown={handleKeyboardDrag}
      onClick={handleClick}
      className={clsx(
        'bg-white border border-neutral-200 rounded-lg p-3 shadow-card cursor-grab active:cursor-grabbing transition-all mb-2',
        'hover:shadow-card-hover hover:border-neutral-300',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isDragging && 'opacity-50 scale-95',
        isDraggedOver && 'bg-primary-50 border-primary-500'
      )}
      role="button"
      tabIndex={0}
      aria-label={`${task.title}. Status: ${columnId}. Priority: ${task.priority || 'medium'}. Press space to grab.`}
      aria-grabbed={isDragging}
    >
      {/* Header with title and priority */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4 className="font-medium text-sm text-neutral-900 line-clamp-2 flex-1">
          {task.title}
        </h4>
        {task.priority && (
          <span className={clsx('text-xs px-2 py-0.5 rounded whitespace-nowrap', priorityColor)}>
            {task.priority}
          </span>
        )}
      </div>
      
      {/* Description */}
      {task.description && (
        <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-2">
          {task.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-neutral-500">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Footer with assignee and due date */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {task.assignee && <Avatar name={task.assignee} size="sm" />}
          {task.dueDate && (
            <span
              className={clsx(
                'text-xs',
                isOverdue(task.dueDate) ? 'text-error-600 font-medium' : 'text-neutral-500'
              )}
            >
              Due: {formatDate(task.dueDate)}
            </span>
          )}
        </div>
        
        <button
          onClick={handleDelete}
          className="text-neutral-400 hover:text-error-600 transition-colors p-1"
          aria-label={`Delete task ${task.title}`}
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';
