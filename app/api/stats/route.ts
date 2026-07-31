import { NextResponse } from "next/server";
import { listLength } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [guestbookCount, wishesCount] = await Promise.all([
      listLength("guestbook:entries"),
      listLength("wishes:entries"),
    ]);
    return NextResponse.json({ guestbookCount, wishesCount });
  } catch (error) {
    console.error("[stats:GET]", error);
    return NextResponse.json(
      { error: "Impossible de charger les statistiques." },
      { status: 500 }
    );
  }
}
