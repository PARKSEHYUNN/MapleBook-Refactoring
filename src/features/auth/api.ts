/**
 * @file /src/feature/auth/api.ts - NEXON Open API Key 기반 인증 API
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * NEXON Open API Key를 활용한 사용자 인증 및 세션 관리를 수행하는 API 모듈입니다.
 * API Key를 통한 본인 인증 기반의 로그인 및 로그아웃 기능을 제공하며,
 * 개발 및 디버깅 환경을 위한 테스트 계정 로그인 로직을 포함하고 있습니다.
 * 보안을 고려한 API Key 검증과 사용자 권한 부여 프로세스를 처리합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import { getDb } from "@/db";
import { loginHistory, users } from "@/db/schema";
import { encrypt } from "@/lib/crypto";
import { logger } from "@/lib/logger";
import { getAccountOUID } from "@/lib/nexon";
import { parseUserAgent } from "@/lib/ua";
import { loginSchema, testLoginSchema } from "@/types/common";

/**
 * @function loginHandler
 * @async
 * @description
 * 사용자의 API Key를 검증하고 세션을 생성하는 로그인 핸들러입니다.
 * 1. Zod를 사용한 요청 본문(rawBody) 유효성 검사
 * 2. 외부 API를 통한 OUID 조회 및 사용자 유효성 확인
 * 3. DB(Drizzle ORM)를 이용한 사용자 정보 Upsert 처리
 * 4. 세션 데이터 암호화 및 HTTP-Only 쿠키 발급 (자동 로그인 대응)
 * * @param {NextRequest} request - Next.js 요청 객체 (apiKey, rememberMe 포함)
 * @returns {Promise<NextResponse>}
 * - 성공 시: 200 OK (성공 메시지 및 쿠키 설정)
 * - 유효성 실패: 400 Bad Request
 * - 인증 실패: 401 Unauthorized
 * - 서버 오류: 500 Internal Server Error
 * * @throws {Error} 환경 변수(COOKIE_SECRET) 누락 시 에러를 던지고 500 응답을 반환합니다.
 */
export async function loginHandler(request: NextRequest) {
  try {
    const rawBody = await request.json();

    // Zod로 요청 데이터 파싱
    const validationResult = loginSchema.safeParse(rawBody);
    if (!validationResult.success) {
      logger.warn(
        "AuthAPI",
        "로그인 요청 데이터 유효성 검사 실패",
        validationResult.error.flatten(),
      );
      return NextResponse.json(
        { errorCode: "INVALID_REQUEST_DATA", message: "Invalid request data." },
        { status: 400 },
      );
    }
    const { apiKey, rememberMe } = validationResult.data;

    // 환경 변수 로드
    const { env } = await getCloudflareContext();
    if (!env.COOKIE_SECRET) {
      throw new Error("Missing required environment variable: COOKIE_SECRET");
    }

    // 사용자의 apiKey 유효성 검증
    const ouid = await getAccountOUID(apiKey).catch(() => null);
    if (!ouid) {
      logger.warn("AuthAPI", "NEXON Open API Key 인증 실패");
      return NextResponse.json(
        { errorCode: "INVALID_API_KEY", message: "Invalid API key." },
        { status: 401 },
      );
    }

    // DB Upsert
    const db = await getDb();
    const [user] = await db
      .insert(users)
      .values({ ouid })
      .onConflictDoUpdate({
        target: users.ouid,
        set: { updatedAt: new Date().toISOString() },
      })
      .returning();

    // UserAgent 파싱
    const rawUserAgent = request.headers.get("user-agent") || "";
    const readableUserAgent = parseUserAgent(rawUserAgent);

    // 로그인 기록 추가
    await db.insert(loginHistory).values({
      userId: user.id,
      loginType: "MANUAL",
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: readableUserAgent,
      isSuccess: true,
    });

    // 데이터 직렬화 및 암호화
    const sessionPayload = JSON.stringify({ apiKey, ouid, rememberMe, loggedAt: Date.now() });
    const encrypted = await encrypt(sessionPayload, env.COOKIE_SECRET);

    // 쿠키 저장
    const cookieStore = await cookies();
    cookieStore.set("auth_token", encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(rememberMe && { maxAge: 60 * 60 * 24 * 30 }),
    });

    // 응답
    logger.info("AuthAPI", "로그인 성공", { ouid });
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    logger.error("AuthAPI", "로그인 처리 중 내부 서버 에러 발생", error);
    return NextResponse.json(
      { errorCode: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * @function logoutHandler
 * @async
 * @description
 * 활성화된 사용자 세션을 종료하고 로그아웃을 처리하는 핸들러입니다.
 * 클라이언트 브라우저에 저장된 'auth_token' 쿠키를 삭제하여
 * 서버측 인증 상태를 무효화합니다.
 * * @param {NextRequest} request - Next.js 요청 객체
 * @returns {Promise<NextResponse>}
 * - 성공 시: 200 OK (성공 메시지 및 쿠키 삭제 헤더 포함)
 */
export async function logoutHandler(request: NextRequest) {
  // 쿠키 삭제
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");

  // 응답
  logger.info("AuthAPI", "로그아웃 처리됨");
  return NextResponse.json({}, { status: 200 });
}

/**
 * @function testLoginHandler
 * @async
 * @description
 * 개발 및 테스트 환경을 위한 테스트 계정 전용 로그인 핸들러입니다.
 * 1. Zod를 사용해 요청 본문에서 `secret` 값을 파싱 및 검증합니다.
 * 2. 전달받은 시크릿 키가 환경 변수(`TEST_ACCOUNT_SECRET`)와 일치하는지 확인합니다.
 * 3. 일치할 경우, 사전 정의된 테스트용 더미 데이터(apiKey, ouid)로 세션 페이로드를 생성합니다.
 * 4. 세션 데이터를 암호화하여 HTTP-Only 쿠키(`auth_token`)로 발급합니다.
 * * *보안 및 감사(Audit)*: 비정상적인 접근 시도(Zod 파싱 실패, 시크릿 키 불일치)나 내부 에러 발생 시,
 * 그리고 로그인 성공 시점에 `logger`를 통해 상세한 내역을 기록합니다.
 * *보안 처리*: 외부 악의적 탐색을 방지하기 위해 모든 예외/실패 상황에서 상세 사유를 노출하지 않고
 * 일괄적으로 `404 Not Found`를 반환합니다.
 * * @param {NextRequest} request - Next.js 요청 객체 (secret 값 포함)
 * @returns {Promise<NextResponse>}
 * - 성공 시: 200 OK (성공 메시지 및 테스트 계정 인증 쿠키 설정)
 * - 실패/오류 시: 404 Not Found (빈 본문 반환)
 */

export async function testLoginHandler(request: NextRequest) {
  try {
    const rawBody = await request.json();

    // Zod로 요청 데이터 파싱
    const validationResult = testLoginSchema.safeParse(rawBody);
    if (!validationResult.success) {
      logger.warn("TestAuth", "테스트 로그인 비정상 접근 시도 (Zod 실패)");
      return NextResponse.json(
        { errorCode: "NOT_FOUND", message: "404 NOT FOUND." },
        { status: 404 },
      );
    }
    const { secret } = validationResult.data;

    // 환경 변수 로드
    const { env } = await getCloudflareContext();

    if (!env.TEST_ACCOUNT_SECRET || secret !== env.TEST_ACCOUNT_SECRET) {
      logger.warn("TestAuth", "테스트 시크릿 키 불일치 (인가되지 않은 접근)");
      return NextResponse.json(
        { errorCode: "NOT_FOUND", message: "404 NOT FOUND." },
        { status: 404 },
      );
    }

    // 데이터 직렬화 및 암호화
    const sessionPayload = JSON.stringify({
      apiKey: "__test_account__",
      ouid: "test__tester__ouid",
      rememberMe: false,
    });
    const encrypted = await encrypt(sessionPayload, env.COOKIE_SECRET);

    // 쿠키 발급
    const cookieStore = await cookies();
    cookieStore.set("auth_token", encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // 응답
    logger.info("TestAuth", "테스트 계정 로그인 성공");
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    logger.error("TestAuth", "테스트 로그인 처리 중 내부 에러 발생", error);
    return NextResponse.json(
      { errorCode: "NOT_FOUND", message: "404 NOT FOUND." },
      { status: 404 },
    );
  }
}
