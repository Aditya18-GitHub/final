import React, { useState, useEffect } from 'react';
import { KanbanTask, KanbanColumn } from './KanbanBoard.types';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: KanbanTask | null;
  columns: KanbanColumn[];
  onSave: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  columns,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [status, setStatus] = useState('');
  const [assignee, setAssignee] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setStatus(task.status);
      setAssignee(task.assignee || '');
      setTags(task.tags || []);
      setDueDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus(columns[0]?.id || '');
      setAssignee('');
      setTags([]);
      setDueDate('');
    }
  }, [task, columns]);
  
  const handleSave = () => {
    if (!title.trim()) return;
    
    const updatedTask: KanbanTask = {
      id: task?.id || `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status: task ? status : (status || columns[0]?.id || ''),
      assignee: assignee.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      createdAt: task?.createdAt || new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };
    
    onSave(updatedTask);
    onClose();
  };
  
  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      onClose();
    }
  };
  
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={task ? 'Edit Task' : 'Create Task'}
        description={task ? 'Update task details below' : 'Fill in the details to create a new task'}
        size="md"
      >
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter task title"
              autoFocus
            />
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter task description"
            />
          </div>
          
          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {columns.map(col => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          {/* Assignee and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="assignee" className="block text-sm font-medium text-neutral-700 mb-1">
                Assignee
              </label>
              <input
                id="assignee"
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter name"
              />
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-1">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add a tag and press Enter"
              />
              <Button onClick={handleAddTag} size="sm">Add</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-primary-900"
                    aria-label={`Remove ${tag}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            {task && (
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Task
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!title.trim()}>
                {task ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-sm text-error-700">
              You are about to delete: <strong>{task?.title}</strong>
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
