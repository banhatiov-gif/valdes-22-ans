import { NextRequest, NextResponse } from "next/server";
import { incrementHashField, readHash, deleteHashField } from "@/lib/redis";

export const dynamic = "force-dynamic";

const KEY = "guestbook:reactions";

export async function GET() {
  try {
    const reactions = await readHash(KEY);
    return NextResponse.json({ reactions });
  } catch (error) {
    console.error("[reactions:GET]", error);
    return NextResponse.json(
      { error: "Impossible de charger les réactions." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entryId = typeof body?.entryId === "string" ? body.entryId : "";
    const action = body?.action === "unreact" ? -1 : 1;

    if (!entryId) {
      return NextResponse.json(
        { error: "entryId requis." },
        { status: 400 }
      );
    }

    const count = await incrementHashField(KEY, entryId, action);
    return NextResponse.json({ entryId, count });
  } catch (error) {
    console.error("[reactions:POST]", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la réaction." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const key = request.headers.get("x-admin-key");
  const expected = process.env.ADMIN_PASSPHRASE;

  if (!expected || key !== expected) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const entryId = typeof body?.entryId === "string" ? body.entryId : "";
    if (!entryId) {
      return NextResponse.json({ error: "entryId requis." }, { status: 400 });
    }

    await deleteHashField(KEY, entryId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[reactions:DELETE]", error);
    return NextResponse.json(
      { error: "Impossible de supprimer la réaction." },
      { status: 500 }
    );
  }
}
