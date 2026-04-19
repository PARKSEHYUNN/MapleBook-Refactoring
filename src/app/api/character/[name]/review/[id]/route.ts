import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { reviews, users } from "@/db/schema";
import { decrypt } from "@/lib/crypto";

const patchBodySchema = z.object({
  mannerScore: z.number().int().min(1).max(5),
  content: z.string().max(1000).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ name: string; id: string }> },
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id, 10);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
    }

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

    const [review] = await db
      .select({ id: reviews.id, reviewerId: reviews.reviewerId })
      .from(reviews)
      .where(and(eq(reviews.id, reviewId), isNull(reviews.deletedAt)));

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.reviewerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = patchBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { mannerScore, content } = parsed.data;

    await db
      .update(reviews)
      .set({
        mannerScore: mannerScore as 1 | 2 | 3 | 4 | 5,
        content: content ?? null,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(reviews.id, reviewId));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string; id: string }> },
) {
  try {
    const { id } = await params;
    const reviewId = parseInt(id, 10);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
    }

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

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.ouid, ouid));
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 리뷰 조회 (본인 리뷰 + 삭제 안 된 것만)
    const [review] = await db
      .select({ id: reviews.id, reviewerId: reviews.reviewerId })
      .from(reviews)
      .where(and(eq(reviews.id, reviewId), isNull(reviews.deletedAt)));

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    if (review.reviewerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 소프트 삭제
    await db
      .update(reviews)
      .set({ deletedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(reviews.id, reviewId));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
