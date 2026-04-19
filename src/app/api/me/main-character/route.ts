import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { characters, users } from "@/db/schema";
import { decrypt } from "@/lib/crypto";

const bodySchema = z.object({
  ocid: z.string(),
});

export async function PATCH(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext();
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken || !env.COOKIE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decrypted = await decrypt(authToken, env.COOKIE_SECRET);
    if (!decrypted) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ouid } = JSON.parse(decrypted);

    const db = await getDb();

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.ouid, ouid));
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { ocid } = parsed.data;

    const [character] = await db
      .select({ id: characters.id, characterLevel: characters.characterLevel })
      .from(characters)
      .where(eq(characters.ocid, ocid));

    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    // Hard Rule 4: 265레벨 이상만 대표 캐릭터로 설정 가능
    if (character.characterLevel < 265) {
      return NextResponse.json(
        { error: "265레벨 이상의 캐릭터만 대표 캐릭터로 설정할 수 있습니다" },
        { status: 403 },
      );
    }

    await db.update(users).set({ mainCharacterId: character.id }).where(eq(users.id, user.id));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
