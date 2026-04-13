import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { characters, users } from "@/db/schema";
import { decrypt } from "@/lib/crypto";
import { BACKGROUND_OPTIONS, DefaultSettingsJsonType, THEME_OPTIONS } from "@/types/user";

const bodySchema = z
  .object({
    action: z.string(),
    actionFrame: z.number().int().min(0),
    emotion: z.string(),
    emotionFrame: z.number().int().min(0),
    wmotion: z.string(),
    flip: z.boolean(),
    background: z.enum(BACKGROUND_OPTIONS as [string, ...string[]]),
    theme: z.enum(THEME_OPTIONS as [string, ...string[]]),
    reviewNotification: z.boolean(),
    bio: z.string().max(200),
  })
  .partial();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const { name } = await params;
    const characterName = decodeURIComponent(name);

    // 인증 확인
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

    // 유저 조회
    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.ouid, ouid));
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 캐릭터 조회 및 소유권 확인
    const [character] = await db
      .select({ id: characters.id, userId: characters.userId })
      .from(characters)
      .where(eq(characters.characterName, characterName));

    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    if (character.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 바디 파싱
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    // bio와 defaultSettings 필드 분리
    const { bio: bioValue, ...settingsFields } = parsed.data;
    const settingsPatch = Object.fromEntries(
      Object.entries(settingsFields).filter(([, v]) => v !== undefined),
    );

    const [existing] = await db
      .select({ defaultSettings: characters.defaultSettings })
      .from(characters)
      .where(eq(characters.id, character.id));

    const newDefaultSettings =
      Object.keys(settingsPatch).length > 0
        ? ({ ...existing.defaultSettings, ...settingsPatch } as DefaultSettingsJsonType)
        : undefined;

    await db
      .update(characters)
      .set({
        ...(bioValue !== undefined ? { bio: bioValue } : {}),
        ...(newDefaultSettings !== undefined ? { defaultSettings: newDefaultSettings } : {}),
      })
      .where(eq(characters.id, character.id));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
