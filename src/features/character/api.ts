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

import { and, eq, inArray, sql } from "drizzle-orm";

import { getDb } from "@/db";
import { characterSnapshots, characters, potentialOptionGrades } from "@/db/schema";
import { SnapshotJsonType } from "@/types/user";
import { logger } from "@/lib/logger";
import {
  getCharacterBasic,
  getCharacterDojang,
  getCharacterItemEquipment,
  getCharacterOcid,
  getCharacterPopularity,
  getCharacterStat,
  getCharacterUnion,
  getUnionArtifact,
  getUnionChampion,
  getUnionRaider,
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
    const [basic, popularity, stat, union, dojang, equipment, unionRaider, unionArtifact, unionChampion] = await Promise.all([
      getCharacterBasic(character.ocid).catch(() => null),
      getCharacterPopularity(character.ocid).catch(() => null),
      getCharacterStat(character.ocid).catch(() => null),
      getCharacterUnion(character.ocid).catch(() => null),
      getCharacterDojang(character.ocid).catch(() => null),
      getCharacterItemEquipment(character.ocid).catch(() => null),
      getUnionRaider(character.ocid).catch(() => null),
      getUnionArtifact(character.ocid).catch(() => null),
      getUnionChampion(character.ocid).catch(() => null),
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

    // 챔피언 이름으로 DB 조회 → 없으면 NEXON API로 보완 → champion_image 첨부
    let enrichedUnionChampion = unionChampion;
    if (unionChampion?.union_champion?.length) {
      const names = unionChampion.union_champion.map((c) => c.champion_name);
      const rows = await db
        .select({ characterName: characters.characterName, characterImage: characters.characterImage, characterLevel: characters.characterLevel })
        .from(characters)
        .where(inArray(characters.characterName, names))
        .catch(() => []);
      const imageMap = new Map(rows.map((r) => [r.characterName, r.characterImage]));
      const levelMap = new Map(rows.map((r) => [r.characterName, r.characterLevel]));

      const missing = names.filter((n) => !imageMap.has(n));
      if (missing.length > 0) {
        await Promise.allSettled(
          missing.map(async (champName) => {
            const ocid = await getCharacterOcid(champName).catch(() => null);
            if (!ocid) { return; }
            const champBasic = await getCharacterBasic(ocid).catch(() => null);
            if (!champBasic) { return; }
            imageMap.set(champName, champBasic.character_image);
            levelMap.set(champName, champBasic.character_level);
          }),
        );
      }

      enrichedUnionChampion = {
        ...unionChampion,
        union_champion: unionChampion.union_champion.map((c) => ({
          ...c,
          champion_image: imageMap.get(c.champion_name) ?? null,
          champion_level: levelMap.get(c.champion_name) ?? null,
        })),
      };
    }

    // 잠재능력 1번 라인 → 등급 누적 (best-effort)
    if (equipment?.item_equipment) {
      for (const eq of equipment.item_equipment) {
        if (eq.potential_option_1 && eq.potential_option_grade) {
          await db
            .insert(potentialOptionGrades)
            .values({ optionText: eq.potential_option_1, grade: eq.potential_option_grade })
            .onConflictDoUpdate({
              target: potentialOptionGrades.optionText,
              set: { seenCount: sql`${potentialOptionGrades.seenCount} + 1` },
            })
            .catch(() => null);
        }
        if (eq.additional_potential_option_1 && eq.additional_potential_option_grade) {
          await db
            .insert(potentialOptionGrades)
            .values({ optionText: eq.additional_potential_option_1, grade: eq.additional_potential_option_grade })
            .onConflictDoUpdate({
              target: potentialOptionGrades.optionText,
              set: { seenCount: sql`${potentialOptionGrades.seenCount} + 1` },
            })
            .catch(() => null);
        }
      }
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
        unionJson: union ?? undefined,
        combatPower: stat
          ? parseInt(
              stat.final_stat.find((s) => s.stat_name === "전투력")?.stat_value ?? "0",
              10,
            ) || 0
          : undefined,
        statJson: stat ?? undefined,
        dojangJson: dojang ?? undefined,
        equipmentJson: equipment ?? undefined,
        unionRaiderJson: unionRaider ?? undefined,
        unionArtifactJson: unionArtifact ?? undefined,
        unionChampionJson: enrichedUnionChampion ?? undefined,
        syncedAt: sql`CURRENT_TIMESTAMP`,
        isIncomplete: false,
      })
      .where(eq(characters.id, character.id))
      .returning();

    // 오늘(KST) 스냅샷 upsert
    const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const today = kstNow.toISOString().slice(0, 10);

    // 30일 미만이면 누락된 날짜만 백필
    const existingDates = await db
      .select({ snapshotDate: characterSnapshots.snapshotDate })
      .from(characterSnapshots)
      .where(eq(characterSnapshots.characterId, character.id))
      .catch(() => [] as { snapshotDate: string }[]);
    const existingDateSet = new Set(existingDates.map((r) => r.snapshotDate));
    const allPastDates = Array.from({ length: 29 }, (_, i) => {
      const d = new Date(kstNow.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
      return d.toISOString().slice(0, 10);
    });
    const missingDates = allPastDates.filter((d) => !existingDateSet.has(d));
    if (missingDates.length > 0) {
      await Promise.allSettled(
        missingDates.map(async (date) => {
          const [bBasic, bStat, bUnion, bPop] = await Promise.all([
            getCharacterBasic(character.ocid, date).catch(() => null),
            getCharacterStat(character.ocid, date).catch(() => null),
            getCharacterUnion(character.ocid, date).catch(() => null),
            getCharacterPopularity(character.ocid, date).catch(() => null),
          ]);
          if (!bBasic) { return; }
          const data: SnapshotJsonType = {
            character_level: bBasic.character_level,
            character_exp_rate: parseFloat(bBasic.character_exp_rate) || 0,
            character_guild_name: bBasic.character_guild_name ?? null,
            character_image: bBasic.character_image,
            combat_power: bStat
              ? parseInt(bStat.final_stat.find((s) => s.stat_name === "전투력")?.stat_value ?? "0", 10) || 0
              : 0,
            union_level: bUnion?.union_level ?? 0,
            union_grade: bUnion?.union_grade ?? "없음",
            popularity: bPop?.popularity ?? 0,
          };
          await db
            .insert(characterSnapshots)
            .values({ characterId: character.id, ocid: character.ocid, snapshotData: data, snapshotDate: date })
            .catch(() => null);
        }),
      );
    }
    const snapshotData: SnapshotJsonType = {
      character_level: basic.character_level,
      character_exp_rate: parseFloat(basic.character_exp_rate) || 0,
      character_guild_name: basic.character_guild_name ?? null,
      character_image: basic.character_image,
      combat_power: stat
        ? parseInt(stat.final_stat.find((s) => s.stat_name === "전투력")?.stat_value ?? "0", 10) || 0
        : 0,
      union_level: union?.union_level ?? 0,
      union_grade: union?.union_grade ?? "없음",
      popularity: popularity?.popularity ?? 0,
    };
    const [existingSnap] = await db
      .select({ id: characterSnapshots.id })
      .from(characterSnapshots)
      .where(
        and(
          eq(characterSnapshots.characterId, character.id),
          eq(characterSnapshots.snapshotDate, today),
        ),
      )
      .catch(() => []);
    if (existingSnap) {
      await db
        .update(characterSnapshots)
        .set({ snapshotData })
        .where(eq(characterSnapshots.id, existingSnap.id))
        .catch(() => null);
    } else {
      await db
        .insert(characterSnapshots)
        .values({ characterId: character.id, ocid: character.ocid, snapshotData, snapshotDate: today })
        .catch(() => null);
    }

    logger.info("CharacterAPI", "캐릭터 갱신 완료", { name });
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    logger.error("CharacterAPI", "캐릭터 갱신 중 오류 발생", error);
    return NextResponse.json({ errorCode: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}
