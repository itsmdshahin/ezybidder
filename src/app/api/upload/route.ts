// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

// ensure Node runtime (Buffer usage)
// export const runtime = "nodejs"; // uncomment if using Next.js edge/experimental config and you need node runtime

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseServer; // server helper (uses service role key)

    const form = await request.formData();
    const file = form.get("file") as File | null;
    const folder = (form.get("folder") as string) || "vehicles";
    const bucket = "vehicles";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const fileType = (file as any).type;
    if (!allowed.includes(fileType)) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });

    const size = (file as any).size ?? null;
    if (size && size > 10 * 1024 * 1024) return NextResponse.json({ error: "File too big" }, { status: 400 });

    const ts = Date.now();
    const original = (file as any).name || "file";
    const safe = String(original).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_.]/g, "");
    const filename = `${folder}/${ts}-${Math.random().toString(36).slice(2, 8)}-${safe}`;

    const arrayBuffer = await (file as any).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadErr } = await supabase.storage.from(bucket).upload(filename, buffer, {
      contentType: fileType,
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadErr) {
      console.error("Supabase storage upload error:", uploadErr);
      if ((uploadErr as any)?.message?.toLowerCase().includes("bucket")) {
        return NextResponse.json({ error: `Storage bucket "${bucket}" not found. Create it.` }, { status: 400 });
      }
      return NextResponse.json({ error: uploadErr.message ?? "Storage upload failed" }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    return NextResponse.json({ url: data.publicUrl, path: filename, size });
  } catch (err: any) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
