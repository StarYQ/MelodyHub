// middleware.js (at project root)
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  // The "updateSession" function below does the supabase.auth.getUser() trick
  return await updateSession(request);
}

// Limit middleware usage with a matcher so it doesn’t run on static files, etc.
export const config = {
  matcher: [
    // This matches all paths except certain static or image routes, etc.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
};
