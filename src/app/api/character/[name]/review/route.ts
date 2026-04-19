import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { characters, reviews, users } from "@/db/schema";
import { decrypt } from "@/lib/crypto";

const bodySchema = z.object({
  mannerScore: z.number().int().min(1).max(5),
  content: z.string().max(1000).optional(),
  images: z.array(z.string().url()).max(5).optional(),
});

export async function POST(
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
    const [user] = await db
      .select({ id: users.id, mainCharacterId: users.mainCharacterId })
      .from(users)
      .where(eq(users.ouid, ouid));

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Hard Rule 5: 대표 캐릭터 미설정 시 리뷰 작성 불가
    if (!user.mainCharacterId) {
      return NextResponse.json(
        { error: "대표 캐릭터를 설정한 후 리뷰를 작성할 수 있습니다" },
        { status: 403 },
      );
    }

    // 대상 캐릭터 조회
    const [character] = await db
      .select({ id: characters.id, userId: characters.userId })
      .from(characters)
      .where(eq(characters.characterName, characterName));

    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    // 본인 캐릭터에는 리뷰 작성 불가
    if (character.userId === user.id) {
      return NextResponse.json(
        { error: "본인 캐릭터에는 리뷰를 작성할 수 없습니다" },
        { status: 403 },
      );
    }

    // 중복 리뷰 확인 (삭제되지 않은 리뷰 기준)
    const [existing] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(
        and(
          eq(reviews.reviewerId, user.id),
          eq(reviews.targetId, character.id),
          isNull(reviews.deletedAt),
        ),
      );

    if (existing) {
      return NextResponse.json(
        { error: "이미 이 캐릭터에 리뷰를 작성했습니다" },
        { status: 409 },
      );
    }

    // 바디 파싱
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { mannerScore, content, images } = parsed.data;

    const [inserted] = await db
      .insert(reviews)
      .values({
        reviewerId: user.id,
        targetId: character.id,
        mannerScore: mannerScore as 1 | 2 | 3 | 4 | 5,
        content: content ?? null,
        images: images ?? null,
      })
      .returning({
        id: reviews.id,
        reviewerId: reviews.reviewerId,
        mannerScore: reviews.mannerScore,
        content: reviews.content,
        createdAt: reviews.createdAt,
      });

    let reviewerCharacterName: string | null = null;
    let reviewerCharacterImage: string | null = null;
    if (user.mainCharacterId) {
      const [reviewerChar] = await db
        .select({ characterName: characters.characterName, characterImage: characters.characterImage })
        .from(characters)
        .where(eq(characters.id, user.mainCharacterId));
      reviewerCharacterName = reviewerChar?.characterName ?? null;
      reviewerCharacterImage = reviewerChar?.characterImage ?? null;
    }

    return NextResponse.json(
      {
        ok: true,
        review: {
          id: inserted.id,
          reviewerId: inserted.reviewerId,
          mannerScore: inserted.mannerScore,
          content: inserted.content,
          createdAt: inserted.createdAt,
          reviewerCharacterName,
          reviewerCharacterImage,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
