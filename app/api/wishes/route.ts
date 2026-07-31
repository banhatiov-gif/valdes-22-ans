import { NextRequest, NextResponse } from "next/server";
import { pushToList, readList } from "@/lib/redis";
import type { Wish } from "@/lib/types";

export const dynamic = "force-dynamic";

const KEY = "wishes:entries";
const MESSAGE_MAX = 140;

export async function GET(request: NextRequest) {
  const key = request.headers.get("x-admin-key");
  const expected = process.env.ADMIN_PASSPHRASE;

  if (!expected || key !== expected) {
    return NextResponse.json(
      { error: "Accès refusé." },
      { status: 401 }
    );
  }

  try {
    const wishes = await readList<Wish>(KEY, 200);
    return NextResponse.json({ wishes });
  } catch (error) {
    console.error("[wishes:GET]", error);
    return NextResponse.json(
      { error: "Impossible de charger les vœux." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { error: "Le vœu ne peut pas être vide." },
        { status: 400 }
      );
    }
    if (message.length > MESSAGE_MAX) {
      return NextResponse.json(
        { error: "Le vœu est trop long." },
        { status: 400 }
      );
    }

    const wish: Wish = {
      id: crypto.randomUUID(),
      message: message.slice(0, MESSAGE_MAX),
      createdAt: new Date().toISOString(),
    };

    await pushToList(KEY, wish, 200);

    return NextResponse.json({ wish }, { status: 201 });
  } catch (error) {
    console.error("[wishes:POST]", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer le vœu." },
      { status: 500 }
    );
  }
}
