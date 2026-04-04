/**
 * @file drizzle.config.ts - Drizzle ORM 설정
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * Drizzle Kit의 마이그레이션 및 스키마 생성에 필요한 설정 파일입니다.
 * Cloudflare D1(d1-http 드라이버)을 대상으로 하며, 마이그레이션 SQL 파일은
 * /migrations 디렉토리에 생성됩니다. 로컬 및 프로덕션 적용은 wrangler CLI를 사용합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./migrations",
})