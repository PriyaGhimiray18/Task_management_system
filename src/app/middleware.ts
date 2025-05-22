// src/app/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token'); // This may return string or undefined

  if (!token || typeof token !== 'string') {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login if no token or invalid token type
  }

  try {
    // Verify token if it exists and is a valid string
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next(); // Allow the request to proceed
  } catch (err) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect to login if invalid token
  }
}

export const config = {
  matcher: ['/dashboard', '/tasks'], // Protect these routes
};
