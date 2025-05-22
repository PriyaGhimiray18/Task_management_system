// src/app/api/task/route.ts

import { NextResponse } from 'next/server';
import { verifyJwtToken } from '@/utils/auth';
import { prisma } from '@/app/lib/db';
import { cookies } from 'next/headers';
import { JwtPayload } from 'jsonwebtoken';

interface MyJwtPayload extends JwtPayload {
  userId: string | number;
}

// POST: Create task
export async function POST(req: Request) {
  // Retrieve the token from the cookies
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Token not found in cookies' }, { status: 401 });
  }

  // Verify the JWT token
  const decoded = verifyJwtToken(token);

  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // Extract user ID from the decoded token
  const { userId } = decoded as MyJwtPayload;

  // Parse the incoming request body
  const { title, description } = await req.json();

  // Validate task title and description
  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }

  try {
    // Create a new task in the database
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        userId: Number(userId),  // Ensure userId is a number before saving
      },
    });

    // Return the created task with a 201 status
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// GET: Fetch tasks for the authenticated user
export async function GET(req: Request) {
  // Retrieve the token from the cookies
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Token not found in cookies' }, { status: 401 });
  }

  // Verify the JWT token
  const decoded = verifyJwtToken(token);

  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // Extract user ID from the decoded token
  const { userId } = decoded as MyJwtPayload;

  try {
    // Fetch tasks associated with the authenticated user
    const tasks = await prisma.task.findMany({
      where: {
        userId: Number(userId), // Fetch tasks for the specific user
      },
    });

    // Return the tasks
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
