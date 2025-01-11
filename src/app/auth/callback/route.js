// src/app/auth/callback/route.js
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  const authType = searchParams.get('authType') ?? 'login';

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // 1) Exchange the code for a session

  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error('Error exchanging code for session:', error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // 2) Now that we have a session, fetch the user from Supabase
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user after OAuth:', userError);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // 3) Check or create user in Prisma
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name:
            user.user_metadata?.full_name ||
            user.email?.split('@')[0] ||
            '',
        },
      });
      console.log('Created user in DB');
    }
  } catch (dbErr) {
    console.error('Error handling user in DB:', dbErr);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // 4) Redirect after successful OAuth
  return NextResponse.redirect(`${origin}${next}`);
}
