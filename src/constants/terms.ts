/**
 * @file src/constants/terms.ts - 서비스 약관 및 개인정보 처리방침 버전 상수
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 애플리케이션에서 사용되는 서비스 이용약관 및 개인정보 처리방침의 최신 버전 정보를 관리합니다.
 * `as const` 단언을 통해 각 버전 문자열을 읽기 전용 상수로 정의하며,
 * `meHandler` 등에서 사용자의 약관 동의 상태를 검증하거나 새로운 동의가 필요한지
 * 판단하는 기준 데이터로 활용됩니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

export const TERMS_VERSION = {
  SERVICE: "v1.0",
  PRIVACY: "v1.0",
} as const;
