/**
 * @file src/app/character/[name]/page.tsx - 캐릭터 정보 페이지
 * @description
 * 캐릭터 이름을 기반으로 D1에서 캐릭터 정보를 조회해 렌더링합니다.
 * DB-first 원칙에 따라 UI는 항상 D1에서 데이터를 읽습니다.
 */

import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, sql } from "drizzle-orm";

import { getDb } from "@/db";
import { characters, users } from "@/db/schema";
import { decrypt } from "@/lib/crypto";
import {
  getCharacterAbility,
  getCharacterAndroidEquipment,
  getCharacterBasic,
  getCharacterBeautyEquipment,
  getCharacterCashItemEquipment,
  getCharacterDojang,
  getCharacterHexaMatrix,
  getCharacterHexaMatrixStat,
  getCharacterHyperStat,
  getCharacterItemEquipment,
  getCharacterLinkSkill,
  getCharacterOcid,
  getCharacterOtherStat,
  getCharacterPetEquipment,
  getCharacterPopularity,
  getCharacterPropensity,
  getCharacterRingReserveSkillEquipment,
  getCharacterSetEffect,
  getCharacterSkill,
  getCharacterStat,
  getCharacterSymbolEquipment,
  getCharacterUnion,
  getCharacterVMatrix,
} from "@/lib/nexon";

import CharacterMotion from "./CharacterMotion";
import { CharacterHeaderImage, CharacterMotionProvider } from "./CharacterMotionProvider";
import CharacterSettingsModal from "./CharacterSettingsModal";
import RefreshButton from "./RefreshButton";
import SyncedAt from "./SyncedAt";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function CharacterPage({ params }: Props) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);

  const db = await getDb();
  const result = await db.select().from(characters).where(eq(characters.characterName, name));
  let character = result[0];

  // 1. D1에 없으면 NEXON API로 신규 조회 및 저장
  if (!character) {
    const ocid = await getCharacterOcid(name).catch(() => null);
    if (!ocid) {
      notFound();
    }

    const basic = await getCharacterBasic(ocid).catch(() => null);
    if (!basic) {
      notFound();
    }

    const inserted = await db
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
    character = inserted[0];
  }

  if (!character) {
    notFound();
  }

  // 2. isIncomplete이면 나머지 데이터 병렬 호출로 채우기
  if (character.isIncomplete) {
    const ocid = character.ocid;
    const [
      basic,
      popularity,
      stat,
      union,
      dojang,
      equipment,
      hyperStat,
      propensity,
      ability,
      cashEquipment,
      symbol,
      setEffect,
      beauty,
      android,
      pet,
      linkSkill,
      vmatrix,
      hexamatrix,
      hexaStatData,
      otherStat,
      ringReserve,
      skill0,
      skill1,
      skill1h,
      skill2,
      skill2h,
      skill3,
      skill4,
      skillHyperPassive,
      skillHyperActive,
      skill5,
      skill6,
    ] = await Promise.all([
      getCharacterBasic(ocid).catch(() => null),
      getCharacterPopularity(ocid).catch(() => null),
      getCharacterStat(ocid).catch(() => null),
      getCharacterUnion(ocid).catch(() => null),
      getCharacterDojang(ocid).catch(() => null),
      getCharacterItemEquipment(ocid).catch(() => null),
      getCharacterHyperStat(ocid).catch(() => null),
      getCharacterPropensity(ocid).catch(() => null),
      getCharacterAbility(ocid).catch(() => null),
      getCharacterCashItemEquipment(ocid).catch(() => null),
      getCharacterSymbolEquipment(ocid).catch(() => null),
      getCharacterSetEffect(ocid).catch(() => null),
      getCharacterBeautyEquipment(ocid).catch(() => null),
      getCharacterAndroidEquipment(ocid).catch(() => null),
      getCharacterPetEquipment(ocid).catch(() => null),
      getCharacterLinkSkill(ocid).catch(() => null),
      getCharacterVMatrix(ocid).catch(() => null),
      getCharacterHexaMatrix(ocid).catch(() => null),
      getCharacterHexaMatrixStat(ocid).catch(() => null),
      getCharacterOtherStat(ocid).catch(() => null),
      getCharacterRingReserveSkillEquipment(ocid).catch(() => null),
      getCharacterSkill(ocid, "0").catch(() => null),
      getCharacterSkill(ocid, "1").catch(() => null),
      getCharacterSkill(ocid, "1.5").catch(() => null),
      getCharacterSkill(ocid, "2").catch(() => null),
      getCharacterSkill(ocid, "2.5").catch(() => null),
      getCharacterSkill(ocid, "3").catch(() => null),
      getCharacterSkill(ocid, "4").catch(() => null),
      getCharacterSkill(ocid, "hyperpassive").catch(() => null),
      getCharacterSkill(ocid, "hyperactive").catch(() => null),
      getCharacterSkill(ocid, "5").catch(() => null),
      getCharacterSkill(ocid, "6").catch(() => null),
    ]);

    const skillJson = [
      skill0,
      skill1,
      skill1h,
      skill2,
      skill2h,
      skill3,
      skill4,
      skillHyperPassive,
      skillHyperActive,
      skill5,
      skill6,
    ].filter((s) => s !== null);

    if (basic) {
      const updated = await db
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
          hyperStatJson: hyperStat ?? undefined,
          propensityJson: propensity ?? undefined,
          abilityJson: ability ?? undefined,
          cashEquipmentJson: cashEquipment ?? undefined,
          symbolJson: symbol ?? undefined,
          setEffectJson: setEffect ?? undefined,
          beautyEquipmentJson: beauty ?? undefined,
          androidJson: android ?? undefined,
          petJson: pet ?? undefined,
          linkSkillJson: linkSkill ?? undefined,
          vmatrixJson: vmatrix ?? undefined,
          hexamatrixJson: hexamatrix ?? undefined,
          hexaStatJson: hexaStatData ?? undefined,
          otherJson: otherStat ?? undefined,
          ringReserveSkillJson: ringReserve ?? undefined,
          skillJson: skillJson.length > 0 ? skillJson : undefined,
          syncedAt: sql`CURRENT_TIMESTAMP`,
          isIncomplete: false,
        })
        .where(eq(characters.id, character.id))
        .returning();
      character = updated[0] ?? character;
    }
  }

  // 3. 본인 소유 여부 확인
  let isOwner = false;
  try {
    const { env } = await getCloudflareContext();
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    if (authToken && env.COOKIE_SECRET) {
      const decrypted = await decrypt(authToken, env.COOKIE_SECRET);
      if (decrypted) {
        const { ouid } = JSON.parse(decrypted);
        const [owner] = await db.select({ id: users.id }).from(users).where(eq(users.ouid, ouid));
        isOwner = !!owner && character.userId === owner.id;
      }
    }
  } catch {
    // 세션 확인 실패 시 isOwner = false 유지
  }

  const dojangFloor = character.dojangJson?.dojang_best_floot
    ? `${character.dojangJson.dojang_best_floot}층`
    : "-";

  // 배경 설정
  const BG_MAPPING: Record<string, { configKey: string; imagePath: string }> = {
    cernium:        { configKey: "Cernium", imagePath: "/CharacterBackground/Cernium.png" },
    mapleIsland:    { configKey: "Cernium", imagePath: "/CharacterBackground/Cernium.png" },
    roadOfVanishing:{ configKey: "Cernium", imagePath: "/CharacterBackground/Cernium.png" },
  };
  const bgId = character.defaultSettings?.background ?? "cernium";
  const bgMap = BG_MAPPING[bgId] ?? BG_MAPPING.cernium;

  const bgConfigRaw = fs.readFileSync(
    path.join(process.cwd(), "public/CharacterBackground/config.jsonc"),
    "utf-8",
  );
  const bgConfig = JSON.parse(
    bgConfigRaw
      .replace(/\/\/[^\n]*/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/,(\s*[}\]])/g, "$1"),
  );
  const bg = bgConfig[bgMap.configKey] ?? {
    pc: { x: "50%", y: "50%", scale: 1 },
    mobile: { x: "50%", y: "50%", scale: 1 },
  };

  // 테마 뱃지 스타일
  const BADGE_THEME = {
    dark:  { bg: "bg-black/50",    hover: "hover:bg-black/70",    text: "text-white",       label: "text-white/50",    bubbleBg: "bg-base-200",   bubbleBorder: "border-base-300",  bubbleText: "text-base-content/70" },
    light: { bg: "bg-white/70",    hover: "hover:bg-white/90",    text: "text-neutral-700", label: "text-neutral-500", bubbleBg: "bg-white/80",   bubbleBorder: "border-white/60",  bubbleText: "text-neutral-700" },
    sky:   { bg: "bg-sky-200/70",  hover: "hover:bg-sky-300/70",  text: "text-sky-900",     label: "text-sky-700",     bubbleBg: "bg-sky-100",    bubbleBorder: "border-sky-200",   bubbleText: "text-sky-900" },
    pink:  { bg: "bg-pink-200/70", hover: "hover:bg-pink-300/70", text: "text-pink-900",    label: "text-pink-700",    bubbleBg: "bg-pink-100",   bubbleBorder: "border-pink-200",  bubbleText: "text-pink-900" },
  } as const;
  type BadgeThemeKey = keyof typeof BADGE_THEME;
  const themeKey = (character.defaultSettings?.theme ?? "dark") as BadgeThemeKey;
  const bs = BADGE_THEME[themeKey] ?? BADGE_THEME.dark;

  return (
    <CharacterMotionProvider
      defaultUrl={character.characterImage ?? ""}
      defaultFlipped={character.defaultSettings?.flip ?? false}
    >
      <main className="mx-auto w-full max-w-4xl px-4 py-6">
        <style>{`
        .character-header-bg {
          background-image: url('${bgMap.imagePath}');
          background-repeat: no-repeat;
          background-position: ${bg.mobile.x} ${bg.mobile.y};
          background-size: ${bg.mobile.scale * 100}%;
        }
        @media (min-width: 1024px) {
          .character-header-bg {
            background-position: ${bg.pc.x} ${bg.pc.y};
            background-size: ${bg.pc.scale * 100}%;
          }
        }
      `}</style>
        {/* 캐릭터 카드 */}
        <div className="character-header-bg relative h-72 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
          {/* 레벨 - 가운데 상단 */}
          <div className={`absolute left-1/2 top-0 w-28 lg:w-36 -translate-x-1/2 rounded-b-xl ${bs.bg} px-3 py-1 flex justify-center`}>
            <span className={`font-galmuri text-[10px] ${bs.text}`}>
              <span className={bs.label}>Lv.</span> {character.characterLevel}
            </span>
          </div>

          {/* 1. 직업 (+ 설정) — 왼쪽 상단 */}
          <div className="absolute left-2 lg:left-4 top-4 z-10 flex flex-col gap-2">
            <div className={`flex w-28 lg:w-36 items-center justify-center rounded-xl ${bs.bg} px-3 py-1`}>
              <span className={`font-galmuri text-[10px] ${bs.text} whitespace-nowrap overflow-hidden text-ellipsis`}>
                {character.characterClass}
              </span>
            </div>
            {isOwner && (
                <CharacterSettingsModal
                  characterName={character.characterName}
                  characterImage={character.characterImage ?? ""}
                  characterLevel={character.characterLevel}
                  initialBio={character.bio}
                  initialReviewNotification={character.defaultSettings?.reviewNotification ?? true}
                  initialBackground={(character.defaultSettings?.background ?? "cernium") as "cernium"}
                  initialTheme={(character.defaultSettings?.theme ?? "dark") as "dark" | "light" | "sky" | "pink"}
                  badgeBg={bs.bg}
                  badgeHover={bs.hover}
                  badgeText={bs.text}
                />
              )}
          </div>

          {/* 2~4. 왼쪽 하단 */}
          <div className="absolute bottom-4 left-2 lg:left-4 z-10 flex flex-col gap-2">
            {/* 2. 유니온 */}
            <div className={`flex w-28 lg:w-36 items-center justify-between rounded-xl ${bs.bg} px-3 py-1`}>
              <span className={`font-galmuri text-[10px] ${bs.label} whitespace-nowrap`}>
                유니온
              </span>
              <span className={`font-galmuri text-[10px] font-medium ${bs.text} whitespace-nowrap`}>
                {character.unionLevel?.toLocaleString() ?? "-"}
              </span>
            </div>
            {/* 3. 무릉도장 */}
            <div className={`flex w-28 lg:w-36 items-center justify-between rounded-xl ${bs.bg} px-3 py-1`}>
              <span className={`font-galmuri text-[10px] ${bs.label} whitespace-nowrap`}>
                무릉도장
              </span>
              <span className={`font-galmuri text-[10px] font-medium ${bs.text} whitespace-nowrap`}>
                {dojangFloor}
              </span>
            </div>
            {/* 4. 인기도 */}
            <div className={`flex w-28 lg:w-36 items-center justify-between rounded-xl ${bs.bg} px-3 py-1`}>
              <span className={`font-galmuri text-[10px] ${bs.label} whitespace-nowrap`}>
                인기도
              </span>
              <span className={`font-galmuri text-[10px] font-medium ${bs.text} whitespace-nowrap`}>
                {character.popularity?.toLocaleString() ?? "-"}
              </span>
            </div>
          </div>

          {/* 5~6. 오른쪽 상단 */}
          <div className="absolute right-2 lg:right-4 top-4 z-10 flex flex-col gap-2">
            {/* 5. 갱신 버튼 */}
            <RefreshButton
              name={character.characterName}
              badgeBg={bs.bg}
              badgeHover={bs.hover}
              badgeText={bs.text}
            />
            {/* 6. 갱신 시간 */}
            <div className={`flex w-28 lg:w-36 items-center justify-center rounded-xl ${bs.bg} ${bs.text} px-3 py-1`}>
              <SyncedAt syncedAt={character.syncedAt} />
            </div>
          </div>

          {/* 7~9. 오른쪽 하단 */}
          <div className="absolute bottom-4 right-2 lg:right-4 z-10 flex flex-col gap-2">
            {/* 7. 길드 버튼 */}
            <button className={`flex w-28 lg:w-36 cursor-pointer items-center justify-center rounded-xl ${bs.bg} px-3 py-1 transition-colors ${bs.hover}`}>
              <span className={`font-galmuri text-[10px] ${bs.text} whitespace-nowrap`}>길드</span>
            </button>
            {/* 8. 길드 이름 */}
            <div className={`flex w-28 lg:w-36 items-center justify-between rounded-xl ${bs.bg} px-3 py-1`}>
              <span className={`font-galmuri text-[10px] ${bs.label} whitespace-nowrap`}>길드</span>
              <span className={`font-galmuri text-[10px] font-medium ${bs.text} whitespace-nowrap overflow-hidden text-ellipsis`}>
                {character.characterGuildName ?? "-"}
              </span>
            </div>
            {/* 9. 경험치 */}
            <div className={`flex w-28 lg:w-36 items-center justify-between rounded-xl ${bs.bg} px-3 py-1`}>
              <span className={`font-galmuri text-[10px] ${bs.label} whitespace-nowrap`}>
                경험치
              </span>
              <span className={`font-galmuri text-[10px] font-medium ${bs.text} whitespace-nowrap`}>
                {character.characterExpRate}%
              </span>
            </div>
          </div>

          {/* 캐릭터 이미지 - 중앙 */}
          <CharacterHeaderImage alt={character.characterName} />

          {/* 캐릭터 이름 - 중앙 하단 뱃지 */}
          <div className={`absolute bottom-4 left-1/2 flex w-28 lg:w-36 -translate-x-1/2 items-center justify-center rounded-xl ${bs.bg} px-3 py-1`}>
            <span className={`font-galmuri text-[10px] font-medium ${bs.text}`}>
              {character.characterName}
            </span>
          </div>
        </div>

        {/* 캐릭터 설명 */}
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-4 py-1 shadow-sm">
          {/* 작은 원형 캐릭터 이미지 */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-base-300 bg-base-200">
            {character.characterImage && (
              <Image
                src={character.characterImage}
                alt={character.characterName}
                width={96}
                height={96}
                unoptimized
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[5] object-contain pixelated"
              />
            )}
          </div>

          {/* 한줄 설명 - 말풍선 */}
          <div className={`relative rounded-2xl rounded-tl-none border ${bs.bubbleBorder} ${bs.bubbleBg} px-3 py-2`}>
            <p className={`font-galmuri text-[12px] ${bs.bubbleText} truncate`}>
              {character.bio ?? `안녕하세요. ${character.characterName}입니다.`}
            </p>
          </div>
        </div>

        {/* 캐릭터 모션 */}
        <CharacterMotion
          characterImage={character.characterImage ?? ""}
          initialSettings={character.defaultSettings ?? undefined}
          key={JSON.stringify(character.defaultSettings)}
        />
      </main>
    </CharacterMotionProvider>
  );
}
