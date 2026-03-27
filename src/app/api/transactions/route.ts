// app/api/transactions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServerClient';

export async function GET() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const userId = auth.user.id;

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json(data);
}
