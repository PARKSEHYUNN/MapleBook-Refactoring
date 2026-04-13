/**
 * @file src/features/me/api.ts - 사용자 세션 유효성 검사 및 상태 분기 API
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 클라이언트의 요청 쿠키를 분석하여 사용자의 현재 인증 상태와 서비스 이용 단계를 판별합니다.
 * JWT(auth_token) 복호화를 통해 세션을 확인하며, 24시간이 경과한 유효 세션의 경우
 * '자동 로그인' 로그를 기록하고 쿠키 만료 시간을 연장합니다.
 * 최신 약관 동의 여부, 대표 캐릭터 설정 여부 등 비즈니스 로직에 따라
 * ACTIVE, NEEDS_SETUP, NEEDS_CONSENT, NEEDS_CHARACTER 등의 세부 상태를 반환하여
 * 온보딩 프로세스를 제어합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { TERMS_VERSION } from "@/constants/terms";
import { getDb } from "@/db";
import { characters, consentLogs, loginHistory, users } from "@/db/schema";
import { decrypt, encrypt } from "@/lib/crypto";
import { logger } from "@/lib/logger";
import { getCharacterBasic, getCharacterList } from "@/lib/nexon";
import { parseUserAgent } from "@/lib/ua";

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
}

const cookiePayloadSchema = z.object({
  ouid: z.string(),
  rememberMe: z.boolean().optional(),
  loggedAt: z.number().optional(),
});

const setupBodySchema = z.object({
  termsVersion: z.string().min(1, "termsVersion is missing."),
  privacyVersion: z.string().min(1, "privacyVersion is missing."),
  mainCharacterId: z.coerce.string().nullable().optional(),
});

/**
 * @function meHandler
 * @async
 * @description
 * 현재 접속 중인 사용자의 세션을 검증하고, 온보딩 및 계정 상태를 반환하는 핸들러입니다.
 * 클라이언트(주로 미들웨어 및 전역 Auth Provider)에서 사용자의 현재 상태를 파악하는 데 사용됩니다.
 * * 주요 처리 로직:
 * 1. **세션 검증**: `auth_token` 쿠키를 복호화하여 유효한 사용자(OUID)인지 DB와 대조합니다.
 * 2. **자동 로그인 갱신 (Session Extension)**: 마지막 갱신일(`loggedAt`) 기준 24시간이 경과한 방문인 경우,
 * User-Agent를 파싱하여 `loginHistory`에 'AUTO' 로그인 기록을 남기고 쿠키 만료일을 연장합니다.
 * 3. **약관 동의 및 온보딩 상태 확인**: DB의 `consentLogs`와 현재 약관 버전(`TERMS_VERSION`),
 * 그리고 대표 캐릭터(`mainCharacterId`) 설정 유무를 확인합니다.
 * 4. **상태 분기(Routing Status)**: 조건에 따라 사용자가 이동해야 할 다음 단계를 상태 값으로 반환합니다.
 * * @param {NextRequest} request - Next.js 요청 객체 (쿠키 및 User-Agent 헤더 포함)
 * @returns {Promise<NextResponse>}
 * - **200 OK (상태별 JSON 반환)**:
 * - `{ status: "UNAUTHORIZED" }`: 쿠키 없음, 복호화 실패, 또는 DB에 없는 사용자
 * - `{ status: "NEEDS_SETUP" }`: 최초 접속 (약관 동의 내역 없음 & 대표 캐릭터 없음)
 * - `{ status: "NEEDS_CONSENT" }`: 기존 유저이나 서비스/개인정보처리방침 약관이 업데이트됨
 * - `{ status: "NEEDS_CHARACTER" }`: 최신 약관에 동의했으나 대표 캐릭터를 설정하지 않음
 * - `{ status: "ACTIVE", mainCharacterId: string }`: 모든 온보딩이 완료된 정상 활성 유저
 * - **500 Internal Server Error**: 서버 내부 오류 발생 시 (로깅 포함)
 * * @throws {Error} 환경 변수(`COOKIE_SECRET`)가 누락된 경우 예외를 발생시킵니다.
 */
export async function meHandler(request: NextRequest) {
  try {
    // 환경 변수 로드
    const { env } = await getCloudflareContext();
    if (!env.COOKIE_SECRET) {
      throw new Error("Missing required environment variable: COOKIE_SECRET");
    }

    // 쿠키에서 OUID 추출
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    // 쿠키가 아예 없는 경우
    if (!authToken) {
      return NextResponse.json({ status: "UNAUTHORIZED" }, { status: 200 });
    }

    // authToken 복호화
    const decryptAuthToken = await decrypt(authToken, env.COOKIE_SECRET);
    if (!decryptAuthToken) {
      return NextResponse.json({ status: "UNAUTHORIZED" }, { status: 200 });
    }

    let payload;
    try {
      const rawJson = JSON.parse(decryptAuthToken);
      payload = cookiePayloadSchema.parse(rawJson);
    } catch (error) {
      logger.warn("MeAPI", "쿠키 페이로드 검증 실패", error);
      return NextResponse.json({ status: "UNAUTHORIZED" }, { status: 200 });
    }
    const { ouid, rememberMe, loggedAt } = payload;
    const db = await getDb();

    // 사용자 메인 캐릭터 조회
    const [user] = await db
      .select({
        id: users.id,
        mainCharacterId: users.mainCharacterId,
        mainCharacterImage: characters.characterImage,
        mainCharacterName: characters.characterName,
      })
      .from(users)
      .leftJoin(characters, eq(characters.id, users.mainCharacterId))
      .where(eq(users.ouid, ouid));

    if (!user) {
      return NextResponse.json({ status: "UNAUTHORIZED" }, { status: 200 });
    }

    // 자동 로그인 및 쿠키 연장
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const isStale = Date.now() - (loggedAt || 0) > ONE_DAY;

    if (isStale) {
      // IP 파싱
      const ipAddress = request.headers.get("x-forwarded-for") || "unknown";

      // UserAgent 파싱
      const rawUserAgent = request.headers.get("user-agent") || "";
      const readableUserAgent = parseUserAgent(rawUserAgent);

      // 24시간 만의 방문이므로 '자동 로그인' 로그를 남김
      await db.insert(loginHistory).values({
        userId: user.id,
        loginType: "AUTO",
        ipAddress: ipAddress,
        userAgent: readableUserAgent,
        isSuccess: true,
      });

      // 쿠키 연장
      const newPayload = JSON.stringify({ ...payload, loggedAt: Date.now() });
      const newEncrypted = await encrypt(newPayload, env.COOKIE_SECRET);
      cookieStore.set("auth_token", newEncrypted, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        ...(rememberMe && { maxAge: 60 * 60 * 24 * 30 }),
      });

      logger.info("MeAPI", "자동 로그인 성공", { ipAddress, readableUserAgent });
    }

    // consent_logs에서 현재 버전 동의 확인
    const { SERVICE, PRIVACY } = TERMS_VERSION;
    const [lastConsent] = await db
      .select({
        termVersion: consentLogs.termsVersion,
        privacyVersion: consentLogs.privacyVersion,
      })
      .from(consentLogs)
      .where(eq(consentLogs.userId, user.id))
      .orderBy(desc(consentLogs.id))
      .limit(1);

    // 상태 변수 정의
    const hasConsentRecord = !!lastConsent;
    const isConsentUpToDate =
      hasConsentRecord &&
      lastConsent.termVersion === SERVICE &&
      lastConsent.privacyVersion === PRIVACY;
    const hasCharacter = !!user.mainCharacterId;

    // 분기 A : 처음 접속 -> needSetup
    if (!hasConsentRecord && !hasCharacter) {
      return NextResponse.json({ status: "NEEDS_SETUP" }, { status: 200 });
    }

    // 분기 B : 기존 유저인데 약관이 바뀜 -> needConsent
    if (!isConsentUpToDate) {
      return NextResponse.json(
        { status: "NEEDS_CONSENT", mainCharacterId: user.mainCharacterId },
        { status: 200 },
      );
    }

    // 분기 C : 약관은 최신인데 대표 캐릭터 스킵했음 -> needCharacter
    if (!hasCharacter) {
      return NextResponse.json({ status: "NEEDS_CHARACTER" }, { status: 200 });
    }

    // 응답
    return NextResponse.json(
      {
        status: "ACTIVE",
        mainCharacterId: user.mainCharacterId,
        mainCharacterImage: user.mainCharacterImage ?? null,
        mainCharacterName: user.mainCharacterName ?? null,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("MeAPI", "사용자 정보 확인 중 내부 서버 에러 발생", error);
    return NextResponse.json(
      { errorCode: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function characterListHandler(request: NextRequest) {
  try {
    // 환경 변수 로드
    const { env } = await getCloudflareContext();
    if (!env.COOKIE_SECRET) {
      throw new Error("Missing required environment variable: COOKIE_SECRET");
    }

    // 쿠키에서 토큰 추출 및 복호화
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json({ errorCode: "UNAUTHORIZED_ACCESS" }, { status: 401 });
    }

    const decryptAuthToken = await decrypt(authToken, env.COOKIE_SECRET);
    if (!decryptAuthToken) {
      return NextResponse.json({ errorCode: "UNAUTHORIZED_ACCESS" }, { status: 401 });
    }

    const { apiKey, ouid } = JSON.parse(decryptAuthToken);
    if (!apiKey) {
      return NextResponse.json({ errorCode: "UNAUTHORIZED_ACCESS" }, { status: 401 });
    }

    // 사용자 ID 조회
    const db = await getDb();
    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.ouid, ouid));
    if (!user) {
      return NextResponse.json({ errorCode: "UNAUTHORIZED_ACCESS" }, { status: 401 });
    }

    // NEXON API에서 캐릭터 목록 조회
    const characterListData = await getCharacterList(apiKey);
    const allCharacters = characterListData.account_list.flatMap(
      (account) => account.character_list,
    );

    // 15개씩 배치로 나눠 기본 정보 조회 및 DB upsert
    const BATCH_SIZE = 15;
    const batches = chunk(allCharacters, BATCH_SIZE);
    const enrichedCharacters: Array<(typeof allCharacters)[number] & { character_image?: string }> =
      [];

    for (const batch of batches) {
      // 배치 내 캐릭터 기본 정보 병렬 조회 (실패해도 null로 처리)
      const basicInfoList = await Promise.all(
        batch.map((c) => getCharacterBasic(c.ocid).catch(() => null)),
      );

      // D1 바인딩 파라미터 한도(100개) 때문에 배치 INSERT 불가 → 개별 upsert
      for (let i = 0; i < batch.length; i++) {
        const c = batch[i];
        const basic = basicInfoList[i];
        if (!basic) {
          continue;
        }

        const values = {
          ocid: c.ocid,
          userId: user.id,
          characterName: basic.character_name,
          worldName: basic.world_name,
          characterClass: basic.character_class,
          characterClassLevel: parseFloat(basic.character_class_level) || 0,
          characterLevel: basic.character_level,
          characterExp: basic.character_exp,
          characterExpRate: parseFloat(basic.character_exp_rate) || 0,
          characterImage: basic.character_image,
          characterDateCreate: basic.character_date_create,
          accessFlag: basic.access_flag,
        };

        await db
          .insert(characters)
          .values(values)
          .onConflictDoUpdate({
            target: characters.ocid,
            set: {
              userId: values.userId,
              characterName: values.characterName,
              worldName: values.worldName,
              characterClass: values.characterClass,
              characterClassLevel: values.characterClassLevel,
              characterLevel: values.characterLevel,
              characterExp: values.characterExp,
              characterExpRate: values.characterExpRate,
              characterImage: values.characterImage,
              characterDateCreate: values.characterDateCreate,
              accessFlag: values.accessFlag,
              syncedAt: sql`CURRENT_TIMESTAMP`,
            },
          });
      }

      // enriched 목록 구성 (기본 정보 조회 실패한 캐릭터도 포함, 이미지만 없음)
      batch.forEach((c, i) => {
        enrichedCharacters.push({
          ...c,
          character_image: basicInfoList[i]?.character_image,
        });
      });
    }

    return NextResponse.json({ data: enrichedCharacters }, { status: 200 });
  } catch (error) {
    logger.error("characterListHandler", "캐릭터 목록 조회 실패", error);
    return NextResponse.json({ errorCode: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}

export async function setupHandler(request: NextRequest) {
  try {
    // 환경 변수 로드
    const { env } = await getCloudflareContext();
    if (!env.COOKIE_SECRET) {
      throw new Error("Missing required environment variable: COOKIE_SECRET");
    }

    // 쿠키에서 OUID 추출
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    // 쿠키가 아예 없는 경우
    if (!authToken) {
      return NextResponse.json({ errorCode: "UNAUTHORIZED_ACCESS" }, { status: 401 });
    }

    // authToken 복호화
    const decryptAuthToken = await decrypt(authToken, env.COOKIE_SECRET);
    if (!decryptAuthToken) {
      return NextResponse.json({ errorCode: "UNAUTHORIZED_ACCESS" }, { status: 401 });
    }

    const { ouid } = JSON.parse(decryptAuthToken);
    const db = await getDb();

    // Body 데이터 파싱 및 Zod 검증
    const body = await request.json();
    const parsedBody = setupBodySchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json({ errorCode: "INVALID_REQUEST_DATA" }, { status: 400 });
    }

    const { termsVersion, privacyVersion, mainCharacterId } = parsedBody.data;

    // 사용자 확인
    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.ouid, ouid));

    if (!user) {
      return NextResponse.json({ errorCode: "USER_NOT_FOUND" }, { status: 401 });
    }

    const rawUserAgent = request.headers.get("user-agent") || "unknown";
    const ipAddress = request.headers.get("x-forwarded-for") || "unknown";

    await db.insert(consentLogs).values({
      userId: user.id,
      termsVersion: termsVersion,
      privacyVersion: privacyVersion,
      userAgent: rawUserAgent,
      ipAddress: ipAddress,
    });

    if (mainCharacterId) {
      const [character] = await db
        .select({ id: characters.id })
        .from(characters)
        .where(eq(characters.ocid, mainCharacterId));

      if (character) {
        await db.update(users).set({ mainCharacterId: character.id }).where(eq(users.id, user.id));
      }
    }

    // 응답
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    logger.error("MeAPI", "초기 설정 처리 중 오류 발생", error);
    return NextResponse.json({ errorCode: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
