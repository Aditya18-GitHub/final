import { KanbanColumn } from '@/components/KanbanBoard/KanbanBoard.types';

/**
 * Reorders tasks after drag and drop
 */
export const reorderTasks = (
  tasks: string[],
  startIndex: number,
  endIndex: number
): string[] => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves task between columns
 */
export const moveTaskBetweenColumns = (
  sourceColumn: string[],
  destColumn: string[],
  sourceIndex: number,
  destIndex: number
): { source: string[]; destination: string[] } => {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);
  return {
    source: sourceClone,
    destination: destClone,
  };
};

/**
 * Checks if column has reached WIP limit
 */
export const isWipLimitReached = (column: KanbanColumn): boolean => {
  if (!column.maxTasks) return false;
  return column.taskIds.length >= column.maxTasks;
};

/**
 * Gets WIP limit warning status
 */
export const getWipWarningStatus = (column: KanbanColumn): 'ok' | 'warning' | 'limit' => {
  if (!column.maxTasks) return 'ok';
  const percentage = (column.taskIds.length / column.maxTasks) * 100;
  if (percentage >= 100) return 'limit';
  if (percentage >= 80) return 'warning';
  return 'ok';
};

/**
 * Calculates column count
 */
export const getColumnTaskCount = (column: KanbanColumn): number => {
  return column.taskIds.length;
};

/**
 * Gets column status text
 */
export const getColumnStatusText = (column: KanbanColumn): string => {
  const count = column.taskIds.length;
  const max = column.maxTasks;
  return max ? `${count}/${max}` : `${count}`;
};
