import { NextRequest, NextResponse } from "next/server";
import { getHashField, setHashField, readHash, deleteHashField } from "@/lib/redis";

export const dynamic = "force-dynamic";

const KEY = "guestbook:reactions";
const NAME_MAX = 40;

function parseNames(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((n): n is string => typeof n === "string")
      : [];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const raw = await readHash(KEY);
    const reactions = Object.fromEntries(
      Object.entries(raw).map(([entryId, value]) => [entryId, parseNames(value)])
    );
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
    const name =
      typeof body?.name === "string" ? body.name.trim().slice(0, NAME_MAX) : "";
    const action = body?.action === "unreact" ? "unreact" : "react";

    if (!entryId || !name) {
      return NextResponse.json(
        { error: "entryId et prénom requis." },
        { status: 400 }
      );
    }

    const names = parseNames(await getHashField(KEY, entryId));
    const next =
      action === "unreact"
        ? names.filter((n) => n.toLowerCase() !== name.toLowerCase())
        : names.some((n) => n.toLowerCase() === name.toLowerCase())
          ? names
          : [...names, name];

    await setHashField(KEY, entryId, JSON.stringify(next));

    return NextResponse.json({ entryId, names: next });
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
