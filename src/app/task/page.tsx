// app/task/page.tsx
'use client';

import { useRouter } from 'next/navigation';

import AddTaskForm from '@/components/AddTaskForm';

export default function TaskPage() {
  const router = useRouter();

  // Define the onSuccess function in the client component
  const handleSuccess = () => {
    // Redirect to dashboard after successful task creation
    router.push('/dashboard');
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Add New Task</h1>
      {/* Pass the onSuccess callback directly to the AddTaskForm */}
      <AddTaskForm onSuccess={handleSuccess} />
    </main>
  );
}
