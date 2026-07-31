import { NextRequest, NextResponse } from "next/server";
import { pushToList, readList } from "@/lib/redis";
import type { GuestbookEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

const KEY = "guestbook:entries";
const NAME_MAX = 40;
const MESSAGE_MAX = 280;

export async function GET() {
  try {
    const entries = await readList<GuestbookEntry>(KEY, 200);
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("[guestbook:GET]", error);
    return NextResponse.json(
      { error: "Impossible de charger le livre d'or." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";

    if (!name || !message) {
      return NextResponse.json(
        { error: "Prénom et message sont requis." },
        { status: 400 }
      );
    }
    if (name.length > NAME_MAX || message.length > MESSAGE_MAX) {
      return NextResponse.json(
        { error: "Prénom ou message trop long." },
        { status: 400 }
      );
    }

    const entry: GuestbookEntry = {
      id: crypto.randomUUID(),
      name: name.slice(0, NAME_MAX),
      message: message.slice(0, MESSAGE_MAX),
      createdAt: new Date().toISOString(),
    };

    await pushToList(KEY, entry, 200);

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("[guestbook:POST]", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer le message." },
      { status: 500 }
    );
  }
}
