// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  // Sign out on client is usually enough; provide server route for clearing cookies if you set any
  try {
    // Nothing to do server-side with anon key; client should call supabase.auth.signOut()
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
