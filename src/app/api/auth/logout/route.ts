/**
 * @file src/app/api/auth/logout/route.ts - 로그아웃 API 라우트 핸들러
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * Next.js App Router의 로그아웃 API 엔드포인트를 정의하는 파일입니다.
 * `/src/features/auth/api`에서 정의된 로그아웃 비즈니스 로직(logoutHandler)을
 * POST 메서드로 노출하여 클라이언트의 인증 세션 종료 요청을 처리합니다.
 * 사용자 세션 파기 및 쿠키 무효화 등의 실제 처리를 외부 핸들러에 위임하는 구조를 가집니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

export { logoutHandler as POST } from "@/features/auth/api";
