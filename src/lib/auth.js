// src/lib/auth.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

export async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  if (user) {
    // find a user with matching ID in custom Users table
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (userData) {
      return { ...user, ...userData };
    }
  }

  return null;
}
