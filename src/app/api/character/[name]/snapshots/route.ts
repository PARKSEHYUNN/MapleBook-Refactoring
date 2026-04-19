import { NextRequest, NextResponse } from "next/server";

import { asc, eq } from "drizzle-orm";

import { getDb } from "@/db";
import { characterSnapshots, characters } from "@/db/schema";
import { logger } from "@/lib/logger";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  try {
    const db = await getDb();

    const [character] = await db
      .select({ id: characters.id })
      .from(characters)
      .where(eq(characters.characterName, decodedName));

    if (!character) {
      return NextResponse.json({ errorCode: "CHARACTER_NOT_FOUND" }, { status: 404 });
    }

    const snapshots = await db
      .select({
        snapshotDate: characterSnapshots.snapshotDate,
        snapshotData: characterSnapshots.snapshotData,
      })
      .from(characterSnapshots)
      .where(eq(characterSnapshots.characterId, character.id))
      .orderBy(asc(characterSnapshots.snapshotDate))
      .limit(30);

    return NextResponse.json({ data: snapshots }, { status: 200 });
  } catch (error) {
    logger.error("SnapshotsAPI", "스냅샷 조회 중 오류 발생", error);
    return NextResponse.json({ errorCode: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
