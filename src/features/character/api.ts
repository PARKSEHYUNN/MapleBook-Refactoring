/**
 * @file src/features/character/api.ts - 캐릭터 조회 및 갱신 API
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 캐릭터 이름 기반 조회 및 명시적 갱신 요청을 처리하는 API 핸들러 모듈입니다.
 * DB-first 원칙에 따라 D1에 캐시된 데이터를 우선 반환하며,
 * 신규 캐릭터는 NEXON API를 통해 기본 정보를 가져와 저장합니다.
 * 갱신은 유저의 명시적 요청(갱신 버튼)으로만 수행됩니다. (Hard Rule 6)
 * NEXON API 실패 시 캐시된 데이터를 반환합니다. (Hard Rule 7)
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { NextRequest, NextResponse } from "next/server";

import { eq, sql } from "drizzle-orm";

import { getDb } from "@/db";
import { characters } from "@/db/schema";
import { logger } from "@/lib/logger";
import {
  getCharacterBasic,
  getCharacterDojang,
  getCharacterItemEquipment,
  getCharacterOcid,
  getCharacterPopularity,
  getCharacterStat,
  getCharacterUnion,
} from "@/lib/nexon";

/**
 * GET /api/character/[name]
 * DB-first 캐릭터 조회. DB에 없으면 NEXON API로 기본 정보만 가져와 저장.
 */
export async function characterHandler(_request: NextRequest, name: string) {
  try {
    const db = await getDb();

    // 1. DB 조회
    const [character] = await db
      .select()
      .from(characters)
      .where(eq(characters.characterName, name));

    if (character) {
      return NextResponse.json({ data: character }, { status: 200 });
    }

    // 2. DB에 없으면 NEXON API로 신규 조회
    const ocid = await getCharacterOcid(name).catch(() => null);
    if (!ocid) {
      return NextResponse.json({ errorCode: "CHARACTER_NOT_FOUND" }, { status: 404 });
    }

    const basic = await getCharacterBasic(ocid).catch(() => null);
    if (!basic) {
      // Hard Rule 7: NEXON API 실패 시 에러 반환 (캐시도 없는 상황)
      return NextResponse.json({ errorCode: "NEXON_API_UNAVAILABLE" }, { status: 503 });
    }

    // 3. DB 저장 (isIncomplete: true — 기본 정보만)
    const [newCharacter] = await db
      .insert(characters)
      .values({
        ocid,
        characterName: basic.character_name,
        worldName: basic.world_name,
        characterClass: basic.character_class,
        characterClassLevel: parseFloat(basic.character_class_level) || 0,
        characterLevel: basic.character_level,
        characterExp: basic.character_exp,
        characterExpRate: parseFloat(basic.character_exp_rate) || 0,
        characterImage: basic.character_image,
        characterGuildName: basic.character_guild_name ?? null,
        characterDateCreate: basic.character_date_create,
        accessFlag: basic.access_flag === "true",
        isIncomplete: true,
      })
      .onConflictDoUpdate({
        target: characters.ocid,
        set: {
          characterName: basic.character_name,
          characterLevel: basic.character_level,
          characterExp: basic.character_exp,
          characterExpRate: parseFloat(basic.character_exp_rate) || 0,
          characterImage: basic.character_image,
          characterGuildName: basic.character_guild_name ?? null,
          accessFlag: basic.access_flag === "true",
          syncedAt: sql`CURRENT_TIMESTAMP`,
        },
      })
      .returning();

    return NextResponse.json({ data: newCharacter }, { status: 200 });
  } catch (error) {
    logger.error("CharacterAPI", "캐릭터 조회 중 오류 발생", error);
    return NextResponse.json({ errorCode: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}

/**
 * POST /api/character/[name]/refresh
 * 유저의 명시적 갱신 요청. NEXON API 병렬 호출 후 DB 업데이트.
 * Hard Rule 6: 갱신 버튼 클릭 시에만 호출됨.
 * Hard Rule 7: NEXON API 실패 시 캐시된 D1 데이터 반환.
 */
export async function characterRefreshHandler(_request: NextRequest, name: string) {
  try {
    const db = await getDb();

    const [character] = await db
      .select({ id: characters.id, ocid: characters.ocid })
      .from(characters)
      .where(eq(characters.characterName, name));

    if (!character) {
      return NextResponse.json({ errorCode: "CHARACTER_NOT_FOUND" }, { status: 404 });
    }

    // NEXON API 병렬 호출
    const [basic, popularity, stat, union, dojang, equipment] = await Promise.all([
      getCharacterBasic(character.ocid).catch(() => null),
      getCharacterPopularity(character.ocid).catch(() => null),
      getCharacterStat(character.ocid).catch(() => null),
      getCharacterUnion(character.ocid).catch(() => null),
      getCharacterDojang(character.ocid).catch(() => null),
      getCharacterItemEquipment(character.ocid).catch(() => null),
    ]);

    // Hard Rule 7: basic 실패 시 캐시 데이터 반환
    if (!basic) {
      logger.warn("CharacterAPI", "NEXON API 실패 — 캐시 데이터 반환", { name });
      const [cached] = await db
        .select()
        .from(characters)
        .where(eq(characters.id, character.id));
      return NextResponse.json({ data: cached }, { status: 200 });
    }

    const [updated] = await db
      .update(characters)
      .set({
        characterName: basic.character_name,
        characterLevel: basic.character_level,
        characterExp: basic.character_exp,
        characterExpRate: parseFloat(basic.character_exp_rate) || 0,
        characterImage: basic.character_image,
        characterGuildName: basic.character_guild_name ?? null,
        accessFlag: basic.access_flag === "true",
        popularity: popularity?.popularity ?? undefined,
        unionLevel: union?.union_level ?? undefined,
        unionGrade: union?.union_grade ?? undefined,
        statJson: stat ?? undefined,
        dojangJson: dojang ?? undefined,
        equipmentJson: equipment ?? undefined,
        syncedAt: sql`CURRENT_TIMESTAMP`,
        isIncomplete: false,
      })
      .where(eq(characters.id, character.id))
      .returning();

    logger.info("CharacterAPI", "캐릭터 갱신 완료", { name });
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    logger.error("CharacterAPI", "캐릭터 갱신 중 오류 발생", error);
    return NextResponse.json({ errorCode: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
