/**
 * @file src/app/api/[...slug]/route.ts - 정의되지 않은 API 경로 처리 (Catch-all)
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * /api 하위의 정의되지 않은 모든 경로에 대한 요청을 낚아채어 404 응답을 반환하는 핸들러입니다.
 * Next.js의 Catch-all segments 기능을 활용하여 존재하지 않는 API 엔드포인트 접근 시
 * 표준화된 JSON 형식의 에러 메시지(NOT_FOUND)와 HTTP 404 상태 코드를 일관되게 제공합니다.
 * 불필요한 요청 확산을 방지하고 API 보안 및 예외 처리를 강화하는 역할을 합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { NextResponse } from "next/server";

const notFoundResponse = () => {
  return NextResponse.json({ errorCode: "NOT_FOUND", message: "404 NOT FOUND." }, { status: 404 });
};

export const GET = notFoundResponse;
export const POST = notFoundResponse;
export const PATCH = notFoundResponse;
export const PUT = notFoundResponse;
export const DELETE = notFoundResponse;
