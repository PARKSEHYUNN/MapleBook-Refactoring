/**
 * @file src/app/api/me/route.ts - 현재 로그인 사용자 정보 조회 API 라우트 핸들러
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 세션에 등록된 현재 사용자의 프로필 및 계정 상태를 조회하는 API 엔드포인트입니다.
 * `/src/features/me/api`에서 정의된 `meHandler`를 GET 메서드로 노출하여
 * 클라이언트에게 인증된 사용자의 식별 정보 및 관련 데이터를 반환합니다.
 * 미들웨어를 통해 검증된 세션 정보를 기반으로 개인화된 정보를 제공하는 창구 역할을 합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

export { meHandler as GET } from "@/features/me/api";
