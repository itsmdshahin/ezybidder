//src/app/api/users/actions/route.ts

import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServerClient"

// ✅ Helper: Admin check (basic)
async function checkAdmin() {
  const { data } = await supabaseServer.auth.getUser()

  if (!data?.user) {
    throw new Error("Unauthorized")
  }

  // OPTIONAL: check role from profiles
  const { data: profile } = await supabaseServer
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  if (profile?.role !== "admin") {
    throw new Error("Forbidden")
  }

  return data.user
}

export async function POST(req: NextRequest) {
  try {
    await checkAdmin()

    const body = await req.json()
    const { action, userIds } = body

    if (!action || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    let updateData: any = {}

    // ✅ ACTION HANDLING
    if (action === "suspend") {
      updateData = { status: "suspended" }
    } else if (action === "activate") {
      updateData = { status: "active" }
    }

    // ✅ UPDATE USERS
    if (action === "suspend" || action === "activate") {
      const { error } = await supabaseServer
        .from("profiles")
        .update(updateData)
        .in("id", userIds)

      if (error) {
        console.error(error)
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
      }
    }

    // ✅ DELETE USERS
    if (action === "delete") {
      const { error } = await supabaseServer
        .from("profiles")
        .delete()
        .in("id", userIds)

      if (error) {
        console.error(error)
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: 401 }
    )
  }
}