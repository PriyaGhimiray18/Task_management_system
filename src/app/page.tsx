'use client';  // This is required to mark it as a Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if there is a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, redirect to the dashboard
      router.push('/dashboard');
    } else {
      // Otherwise, redirect to the login page
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Task Management System</h1>
    </div>
  );
};

export default HomePage;
