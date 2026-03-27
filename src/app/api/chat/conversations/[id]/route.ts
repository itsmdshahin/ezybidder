import { NextResponse } from "next/server"
import { z } from "zod"
import { supabase } from "@/lib/supabaseClient"

// ✅ Validation schema
const messageSchema = z.object({
  senderId: z.string().min(1),
  recipientId: z.string().min(1),
  content: z.string().min(1),
})

export async function POST(req: Request, context: any) {
  try {
    const conversationId = context.params.conversationId
    const body = await req.json()

    // ✅ Validate input
    const parsed = messageSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      )
    }

    const { senderId, recipientId, content } = parsed.data

    // ✅ Insert message
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        message_type: "text",
      })
      .select()
      .single()

    // ✅ HANDLE ERROR (CRITICAL)
    if (error) {
      console.error("Supabase Error:", error)
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (err: any) {
    console.error("Server Error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}