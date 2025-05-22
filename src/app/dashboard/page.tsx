'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddTaskForm from '@/components/AddTaskForm';

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/task', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error('Failed to fetch tasks');

      const data = await res.json();
      setTasks(data.tasks);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTaskSuccess = () => {
    fetchTasks();
    setShowAddTaskForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const res = await fetch(`/api/task/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to delete task');

      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting the task.');
    }
  };

  const handleEditTask = (taskId: number) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setEditingTask(taskToEdit);
    setShowAddTaskForm(true);
  };

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/login');
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (!isAuthenticated) return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome to Your Dashboard</h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowAddTaskForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Task
        </button>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>

      {showAddTaskForm && (
        <div className="mb-6 border p-4 rounded shadow bg-white">
          <AddTaskForm onSuccess={handleAddTaskSuccess} taskToEdit={editingTask} />
        </div>
      )}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-600 text-center">No tasks available. Add one to get started!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 border rounded shadow bg-blue-50 flex justify-between items-start"
            >
              <div>
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <p className="text-sm text-gray-600">{task.description || 'No description'}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Status:</span> {task.status}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Due:</span>{' '}
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditTask(task.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDeleteId(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteTask(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
