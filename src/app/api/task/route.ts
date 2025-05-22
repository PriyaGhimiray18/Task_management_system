// src/app/api/task/route.ts

import { NextResponse } from 'next/server';
import { verifyJwtToken } from '@/utils/auth';
import { prisma } from '@/app/lib/db';
import { cookies } from 'next/headers';

// Instead of extending JwtPayload which causes type issues,
// define your own interface with just what you need:
interface MyJwtPayload {
  userId: string | number;
  iat?: number;  // issued at timestamp (optional)
  exp?: number;  // expiration timestamp (optional)
}

// POST: Create task
export async function POST(req: Request) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Token not found in cookies' }, { status: 401 });
  }

  const decoded = verifyJwtToken(token);

  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const { userId } = decoded as MyJwtPayload;

  // Safely parse userId to number
  const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

  const { title, description } = await req.json();

  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        userId: numericUserId,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// GET: Fetch tasks for authenticated user
export async function GET(req: Request) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Token not found in cookies' }, { status: 401 });
  }

  const decoded = verifyJwtToken(token);

  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const { userId } = decoded as MyJwtPayload;
  const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: numericUserId,
      },
    });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
