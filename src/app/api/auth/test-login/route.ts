/**
 * @file src/app/api/auth/test-login/route.ts - 테스트 계정 로그인 API 라우트 핸들러
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 개발 및 테스트 목적의 로그인 엔드포인트를 정의하는 파일입니다.
 * `/src/features/auth/api`에서 정의된 테스트 로그인 로직(testLoginHandler)을
 * POST 메서드로 노출하여, 별도의 복잡한 인증 절차 없이 개발 환경에서의
 * 빠른 세션 진입을 지원합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

export { testLoginHandler as POST } from "@/features/auth/api";
