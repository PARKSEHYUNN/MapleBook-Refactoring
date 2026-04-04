/**
 * @file src/db/index.ts - Drizzle ORM 및 데이터베이스 연결 설정
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * Cloudflare D1 데이터베이스와 Drizzle ORM을 연결하기 위한 진입점입니다.
 * OpenNext 컨텍스트를 통해 Cloudflare 환경 변수에 접근하여 DB 바인딩을 수행하며,
 * 애플리케이션 전역에서 사용할 수 있는 비동기 데이터베이스 인스턴스 생성 함수(getDb)를 제공합니다.
 * 서버리스 환경의 효율적인 커넥션 관리와 타입 안정성을 보장합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getDb() {
  const { env } = await getCloudflareContext();
  return drizzle(env.DB);
}
