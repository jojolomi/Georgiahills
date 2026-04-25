import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/server/supabase";
import { resolveAdminRole } from "../../../../lib/server/admin-auth";
import { listMediaAssets, uploadMediaAsset } from "../../../../lib/server/media-storage";

export const runtime = "nodejs";

async function assertAdmin() {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { ok: false as const, response: NextResponse.json({ error: "auth_unavailable" }, { status: 503 }) };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, response: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }

  const role = resolveAdminRole(user);
  if (role !== "SuperAdmin" && role !== "Editor") {
    return { ok: false as const, response: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  }

  return { ok: true as const };
}

export async function GET() {
  const auth = await assertAdmin();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const payload = await listMediaAssets();
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error: "list_failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await assertAdmin();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "missing_file" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "invalid_file_type" }, { status: 400 });
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "file_too_large" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await uploadMediaAsset({
      fileName: file.name,
      fileBuffer: Buffer.from(arrayBuffer),
      mimeType: file.type
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "upload_failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
