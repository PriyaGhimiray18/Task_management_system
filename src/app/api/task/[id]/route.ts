import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';  // Import Prisma client

// DELETE: Delete a task by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = parseInt(params.id);  // Parse the task ID from the URL parameters

    if (isNaN(taskId)) {
      console.error('Invalid task ID:', params.id); // Log invalid task ID
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    // Attempt to delete the task
    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    // Return the deleted task (optional)
    return NextResponse.json(deletedTask, { status: 200 });
  } catch (error) {
    console.error('Error deleting task:', error); // Log error details
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = parseInt(params.id);
    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const body = await req.json();
    const { title, description, status, dueDate } = body;

    const updateData: any = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    // ✅ Only add dueDate if it's a valid ISO string
    if (dueDate && dueDate.trim() !== '') {
      const isoDate = new Date(dueDate).toISOString(); // Convert to proper ISO string
      updateData.dueDate = isoDate;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

