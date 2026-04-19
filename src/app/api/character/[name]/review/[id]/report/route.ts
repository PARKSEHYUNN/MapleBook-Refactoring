import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { reviewReports, reviews, users } from "@/db/schema";
import { decrypt } from "@/lib/crypto";
import { ReviewReportReason } from "@/types/common";

const REPORT_REASONS: [ReviewReportReason, ...ReviewReportReason[]] = [
  "스팸",
  "욕설/비하",
  "허위 정보",
  "기타",
];

const bodySchema = z.object({
  reason: z.enum(REPORT_REASONS),
  comment: z.string().max(500).optional(),
});

export async function POST(
  request: NextRequest,
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

    // 리뷰 존재 여부 확인 (삭제 안 된 것만)
    const [review] = await db
      .select({ id: reviews.id, reviewerId: reviews.reviewerId })
      .from(reviews)
      .where(and(eq(reviews.id, reviewId), isNull(reviews.deletedAt)));

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // 본인 리뷰는 신고 불가
    if (review.reviewerId === user.id) {
      return NextResponse.json({ error: "본인 리뷰는 신고할 수 없습니다" }, { status: 403 });
    }

    // 바디 파싱
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { reason, comment } = parsed.data;

    try {
      await db.insert(reviewReports).values({
        reporterId: user.id,
        reviewId: reviewId,
        reason,
        comment: comment ?? null,
      });
    } catch {
      // unique constraint 위반 → 이미 신고한 리뷰
      return NextResponse.json({ error: "이미 신고한 리뷰입니다" }, { status: 409 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
