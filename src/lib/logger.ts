/**
 * @file src/lib/logger.ts - 애플리케이션 공통 로깅 유틸리티
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 애플리케이션 전역에서 발생하는 로그를 관리하기 위한 커스텀 로거 모듈입니다.
 * 실행 환경(Development/Production)에 따라 로그 출력 형식을 최적화합니다.
 * 개발 환경에서는 가독성이 높은 문자열 포맷을 사용하고, 운영 환경에서는
 * 로그 수집 및 분석이 용이하도록 JSON 구조화된(Structured Logging) 데이터를 출력합니다.
 * 정보(INFO), 경고(WARN), 에러(ERROR) 단계별 로깅 및 에러 스택 트레이스 처리를 지원합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

const isProd = process.env.NODE_ENV === "production";
const getTiem = () => new Date().toISOString();

export const logger = {
  info: (context: string, message: string, data?: unknown) => {
    if (isProd) {
      console.log(
        JSON.stringify({
          level: "INFO",
          timestamp: getTiem(),
          context,
          message,
          ...(data !== undefined && { data }),
        }),
      );
    } else {
      console.log(`[INFO] [${getTiem()}] [${context}] ${message}`, data ? data : "");
    }
  },
  warn: (context: string, message: string, data?: unknown) => {
    if (isProd) {
      console.warn(
        JSON.stringify({
          level: "WARN",
          timestamp: getTiem(),
          context,
          message,
          ...(data !== undefined && { data }),
        }),
      );
    } else {
      console.warn(`[WARN] [${getTiem()}] [${context}] ${message}`, data ? data : "");
    }
  },
  error: (context: string, message: string, error?: unknown) => {
    if (isProd) {
      console.error(
        JSON.stringify({
          level: "INFO",
          timestamp: getTiem(),
          context,
          message,
          error:
            error instanceof Error
              ? { name: error.name, message: error.message, stack: error.stack }
              : error,
        }),
      );
    } else {
      console.error(`[ERROR] [${getTiem()}] [${context}] ${message}`, error ? error : "");
    }
  },
};
