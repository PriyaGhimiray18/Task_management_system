'use client';

import { useState, useEffect } from 'react';

export default function AddTaskForm({ onSuccess, taskToEdit }: { onSuccess?: () => void, taskToEdit?: any }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'To Do');
      if (taskToEdit.dueDate) {
        const date = new Date(taskToEdit.dueDate);
        const formatted = date.toISOString().split('T')[0];
        setDueDate(formatted);
      } else {
        setDueDate('');
      }
    }
  }, [taskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = taskToEdit ? 'PATCH' : 'POST';
    const url = taskToEdit ? `/api/task/${taskToEdit.id}` : '/api/task';
    const dueDateISO = dueDate ? new Date(dueDate).toISOString() : null;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description,
          status,
          dueDate: dueDateISO,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to save task:', error.error);
        return;
      }

      const data = await res.json();
      console.log('Task saved:', data);

      setTitle('');
      setDescription('');
      setStatus('To Do');
      setDueDate('');

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">
        {taskToEdit ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
}
