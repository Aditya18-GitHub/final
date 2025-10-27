import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import { KanbanColumn, KanbanTask } from './KanbanBoard.types';
import { fn } from '@storybook/test';

// Sample data
const sampleColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-1', 'task-2'], maxTasks: 10 },
  { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: ['task-3'], maxTasks: 5 },
  { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: ['task-4', 'task-5'] },
];

const sampleTasks: Record<string, KanbanTask> = {
  'task-1': {
    id: 'task-1',
    title: 'Implement drag and drop',
    description: 'Add D&D functionality to kanban cards',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    tags: ['frontend', 'feature'],
    createdAt: new Date(2024, 0, 10),
    dueDate: new Date(2024, 0, 20),
  },
  'task-2': {
    id: 'task-2',
    title: 'Design task modal',
    description: 'Create modal for editing task details',
    status: 'todo',
    priority: 'medium',
    assignee: 'Jane Smith',
    tags: ['design', 'ui'],
    createdAt: new Date(2024, 0, 11),
    dueDate: new Date(2024, 0, 18),
  },
  'task-3': {
    id: 'task-3',
    title: 'Setup TypeScript',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'John Doe',
    tags: ['setup', 'typescript'],
    createdAt: new Date(2024, 0, 9),
  },
  'task-4': {
    id: 'task-4',
    title: 'Create project structure',
    description: 'Setup folder structure and initial files',
    status: 'done',
    priority: 'low',
    assignee: 'Jane Smith',
    tags: ['setup'],
    createdAt: new Date(2024, 0, 8),
    dueDate: new Date(2024, 0, 9),
  },
  'task-5': {
    id: 'task-5',
    title: 'Install dependencies',
    status: 'done',
    priority: 'low',
    assignee: 'John Doe',
    tags: ['setup'],
    createdAt: new Date(2024, 0, 8),
  },
};

// Generate many tasks for performance testing
const generateManyTasks = (): Record<string, KanbanTask> => {
  const tasks: Record<string, KanbanTask> = {};
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const columns = ['todo', 'in-progress', 'review', 'done'];
  const people = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];
  const tagsList = ['frontend', 'backend', 'design', 'feature', 'bug', 'setup', 'documentation'];
  
  for (let i = 1; i <= 30; i++) {
    tasks[`task-${i}`] = {
      id: `task-${i}`,
      title: `Task ${i}: ${['Implement', 'Design', 'Fix', 'Test', 'Review'][i % 5]} feature ${i}`,
      description: i % 2 === 0 ? `This is a detailed description for task ${i}` : undefined,
      status: columns[i % 4],
      priority: priorities[i % 4],
      assignee: i % 3 === 0 ? undefined : people[i % 4],
      tags: i % 2 === 0 ? [tagsList[i % tagsList.length], tagsList[(i + 1) % tagsList.length]] : undefined,
      createdAt: new Date(2024, 0, 1 + i),
      dueDate: i % 3 === 0 ? undefined : new Date(2024, 0, 15 + i),
    };
  }
  
  return tasks;
};

const meta: Meta<typeof KanbanBoard> = {
  title: 'Kanban Board/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
    actions: {
      handles: ['onTaskMove', 'onTaskCreate', 'onTaskUpdate', 'onTaskDelete'],
    },
  },
  args: {
    onTaskMove: fn(),
    onTaskCreate: fn(),
    onTaskUpdate: fn(),
    onTaskDelete: fn(),
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

// Default story
export const Default: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    columns: [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: [] },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: [] },
      { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [] },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: [] },
    ],
    tasks: {},
  },
};

// Many tasks
export const WithManyTasks: Story = {
  args: {
    columns: sampleColumns,
    tasks: generateManyTasks(),
  },
};

// Different priorities
export const DifferentPriorities: Story = {
  args: {
    columns: sampleColumns,
    tasks: {
      'task-low': {
        id: 'task-low',
        title: 'Low Priority Task',
        description: 'This is a low priority task',
        status: 'todo',
        priority: 'low',
        createdAt: new Date(),
      },
      'task-medium': {
        id: 'task-medium',
        title: 'Medium Priority Task',
        description: 'This is a medium priority task',
        status: 'todo',
        priority: 'medium',
        createdAt: new Date(),
      },
      'task-high': {
        id: 'task-high',
        title: 'High Priority Task',
        description: 'This is a high priority task',
        status: 'todo',
        priority: 'high',
        createdAt: new Date(),
      },
      'task-urgent': {
        id: 'task-urgent',
        title: 'Urgent Priority Task',
        description: 'This is an urgent priority task',
        status: 'todo',
        priority: 'urgent',
        createdAt: new Date(),
      },
    },
  },
};

// Interactive demo
export const InteractiveDemo: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
  },
  parameters: {
    docs: {
      description: {
        story: 'A fully functional Kanban board with drag-and-drop capabilities. Try dragging tasks between columns!',
      },
    },
  },
};

// Mobile view
export const MobileView: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Accessibility
export const AccessibilityDemo: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
  },
  parameters: {
    docs: {
      description: {
        story: 'Keyboard navigation: Use Space/Enter to grab cards, arrow keys to navigate, and Delete to remove tasks. All interactive elements support keyboard interaction.',
      },
    },
  },
};

// With WIP limits
export const WithWipLimits: Story = {
  args: {
    columns: [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-1', 'task-2', 'task-3'], maxTasks: 3 },
      { id: 'in-progress', title: 'In Progress', color: '#3b82f6', taskIds: ['task-4'], maxTasks: 2 },
      { id: 'review', title: 'Review', color: '#f59e0b', taskIds: ['task-5', 'task-6'], maxTasks: 2 },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: [], maxTasks: 10 },
    ],
    tasks: {
      'task-1': { id: 'task-1', title: 'Task 1', status: 'todo', priority: 'low', createdAt: new Date() },
      'task-2': { id: 'task-2', title: 'Task 2', status: 'todo', priority: 'medium', createdAt: new Date() },
      'task-3': { id: 'task-3', title: 'Task 3', status: 'todo', priority: 'high', createdAt: new Date() },
      'task-4': { id: 'task-4', title: 'Task 4', status: 'in-progress', priority: 'low', createdAt: new Date() },
      'task-5': { id: 'task-5', title: 'Task 5', status: 'review', priority: 'medium', createdAt: new Date() },
      'task-6': { id: 'task-6', title: 'Task 6', status: 'review', priority: 'high', createdAt: new Date() },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'This board demonstrates WIP (Work In Progress) limits. The progress bars show when columns are approaching their limits.',
      },
    },
  },
};
