/**
 * @file src/app/api/auth/login/route.ts - 로그인 API 라우트 핸들러
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * Next.js App Router의 로그인 API 엔드포인트를 정의하는 파일입니다.
 * 실제 인증 비즈니스 로직은 `/src/feature/auth/api.ts`의 핸들러에서 수행하며,
 * 이 파일은 해당 로직을 받아 외부 엔드포인트로 노출(export)하는 브릿지 역할을 담당합니다.
 * 계층화된 구조를 통해 라우팅 설정과 세부 인증 로직을 분리하여 관리합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

export { loginHandler as POST } from "@/features/auth/api";
