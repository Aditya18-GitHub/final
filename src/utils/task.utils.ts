import { KanbanTask } from '@/components/KanbanBoard/KanbanBoard.types';
import { format } from 'date-fns';

/**
 * Checks if a task is overdue
 */
export const isOverdue = (dueDate: Date): boolean => {
  return new Date() > dueDate;
};

/**
 * Gets initials from a name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Calculates priority color classes
 */
export const getPriorityColor = (priority: 'low' | 'medium' | 'high' | 'urgent'): string => {
  const colors = {
    low: 'bg-blue-100 text-blue-700 border-l-4 border-blue-500',
    medium: 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500',
    high: 'bg-orange-100 text-orange-700 border-l-4 border-orange-500',
    urgent: 'bg-red-100 text-red-700 border-l-4 border-red-500',
  };
  return colors[priority] || colors.medium;
};

/**
 * Formats date for display
 */
export const formatDate = (date: Date): string => {
  return format(date, 'MMM d, yyyy');
};

/**
 * Gets short priority name
 */
export const getPriorityLabel = (priority?: string): string => {
  return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';
};

/**
 * Filters tasks by criteria
 */
export const filterTasks = (
  tasks: KanbanTask[],
  searchTerm: string,
  assignee?: string,
  priority?: string,
  tags?: string[]
): KanbanTask[] => {
  return tasks.filter(task => {
    // Search term filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Assignee filter
    if (assignee && task.assignee !== assignee) {
      return false;
    }
    
    // Priority filter
    if (priority && task.priority !== priority) {
      return false;
    }
    
    // Tags filter
    if (tags && tags.length > 0 && (!task.tags || !task.tags.some(tag => tags.includes(tag)))) {
      return false;
    }
    
    return true;
  });
};

/**
 * Creates a new task with default values
 */
export const createTask = (
  id: string,
  title: string,
  columnId: string,
  overrides?: Partial<KanbanTask>
): KanbanTask => {
  return {
    id,
    title,
    status: columnId,
    createdAt: new Date(),
    priority: 'medium',
    ...overrides,
  };
};
