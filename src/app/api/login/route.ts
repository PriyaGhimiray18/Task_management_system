// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Please provide both username and password' }, { status: 400 });
  }

  try {
    const user = await prisma.users.findFirst({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set token in cookies
    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });

    // Setting token in cookies
    response.cookies.set('token', token, {
      httpOnly: true, // Make the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === 'production', // Secure only in production (HTTPS)
      maxAge: 60 * 60 * 24 * 7, // Cookie expires in 7 days
      path: '/', // Path where the cookie will be available
    });

    return response;

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
