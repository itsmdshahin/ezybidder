// app/api/saved-vehicles/route.ts


import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServerClient";

export async function GET() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const userId = auth.user.id;

  const { data, error } = await supabase
    .from('watchlist')
    .select(`
      id,
      created_at,
      vehicles (
        id, make, model, year, price, images, mileage, fuel_type, transmission, location
      )
    `)
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json(data);
}
