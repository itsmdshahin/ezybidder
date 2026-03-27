// src/app/api/users/route.ts

import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServerClient"

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("profiles")
      .select("id, full_name, email, role, status, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}