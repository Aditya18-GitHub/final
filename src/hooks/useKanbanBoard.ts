import { useState, useCallback, useMemo } from 'react';
import { KanbanTask, KanbanColumn } from '@/components/KanbanBoard/KanbanBoard.types';
import { reorderTasks, moveTaskBetweenColumns } from '@/utils/column.utils';

export const useKanbanBoard = (initialColumns: KanbanColumn[], initialTasks: Record<string, KanbanTask>) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAssignee, setFilterAssignee] = useState<string | undefined>();
  const [filterPriority, setFilterPriority] = useState<string | undefined>();
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  
  const handleTaskMove = useCallback((taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        status: toColumn,
      },
    }));
    
    setColumns(prev => {
      const newColumns = [...prev];
      const fromCol = newColumns.find(c => c.id === fromColumn);
      const toCol = newColumns.find(c => c.id === toColumn);
      
      if (!fromCol || !toCol) return prev;
      
      if (fromColumn === toColumn) {
        // Reorder within same column
        const newTaskIds = reorderTasks(fromCol.taskIds, fromCol.taskIds.indexOf(taskId), newIndex);
        fromCol.taskIds = newTaskIds;
      } else {
        // Move between columns
        const { source, destination } = moveTaskBetweenColumns(
          fromCol.taskIds,
          toCol.taskIds,
          fromCol.taskIds.indexOf(taskId),
          newIndex
        );
        fromCol.taskIds = source;
        toCol.taskIds = destination;
      }
      
      return newColumns;
    });
  }, []);
  
  const handleTaskCreate = useCallback((columnId: string, task: KanbanTask) => {
    setTasks(prev => ({ ...prev, [task.id]: task }));
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, taskIds: [...col.taskIds, task.id] } : col
    ));
  }, []);
  
  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...updates },
    }));
  }, []);
  
  const handleTaskDelete = useCallback((taskId: string) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[taskId];
      return newTasks;
    });
    
    setColumns(prev => prev.map(col => ({
      ...col,
      taskIds: col.taskIds.filter(id => id !== taskId),
    })));
  }, []);
  
  const filteredColumns = useMemo(() => {
    return columns.map(column => ({
      ...column,
      taskIds: column.taskIds.filter(taskId => {
        const task = tasks[taskId];
        if (!task) return false;
        
        // Apply filters
        if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !task.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        
        if (filterAssignee && task.assignee !== filterAssignee) {
          return false;
        }
        
        if (filterPriority && task.priority !== filterPriority) {
          return false;
        }
        
        return true;
      }),
    }));
  }, [columns, tasks, searchTerm, filterAssignee, filterPriority]);
  
  return {
    columns: filteredColumns,
    tasks,
    searchTerm,
    filterAssignee,
    filterPriority,
    selectedTask,
    setSearchTerm,
    setFilterAssignee,
    setFilterPriority,
    setSelectedTask,
    handleTaskMove,
    handleTaskCreate,
    handleTaskUpdate,
    handleTaskDelete,
  };
};
