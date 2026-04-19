/**
 * @file src/lib/nexon.ts - NEXON Open API 요청 및 관리
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * NEXON Open API와의 통신을 전담하는 라이브러리 모듈입니다.
 * 게임 데이터(메이플스토리) 조회를 위한 API Key 인증,
 * 엔드포인트 관리 및 Fetch 기반의 공통 요청 로직을 포함합니다.
 * 응답 데이터의 타입 정의와 에러 핸들링을 통해 서비스 내에서 안정적인
 * 외부 데이터 연동을 지원합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";

import {
  AbilityJsonType,
  AccountAchievementType,
  AccountOUIDType,
  AndroidEquipmentJsonType,
  BattlePracticeReplayIdType,
  BattlePracticeResultType,
  BattlePracticeSkillTimelineType,
  BeautyEquipmentJsonType,
  CashEquipmentJsonType,
  CharacterBasic,
  CharacterListType,
  CharacterPopularity,
  CharacterUnion,
  CubeHistoryType,
  DojangJsonType,
  GuildBasicType,
  HexaMatrixJsonType,
  HexaStatJsonType,
  HyperStatJsonType,
  ItemEquipmentJsonType,
  LinkSkillJsonType,
  NoticeDetailType,
  NoticeListType,
  OtherJsonType,
  PetJsonType,
  PotentialHistoryType,
  PropensityJsonType,
  RankingAchievementType,
  RankingDojangType,
  RankingGuildType,
  RankingOverallType,
  RankingTheSeedType,
  RankingUnionType,
  RingReserveSkillEquipmentJsonType,
  SetEffectJsonType,
  SkillGradeData,
  StarforceHistoryType,
  StatJsonType,
  SymbolJsonType,
  UnionArtifactType,
  UnionChampionType,
  UnionRaiderType,
  VMatrixJsonType,
  CashShopNoticeDetailType,
  CashShopNoticeListType,
  EventNoticeDetailType,
  EventNoticeListType,
  UpdateNoticeListType,
} from "@/types/character";
import { NEXONOpenAPIError } from "@/types/common";

const NEXON_OPEN_API_BASE_URL = "https://open.api.nexon.com";

/**
 * NEXON Open API의 공통 Fetch Wrapper
 * API Key를 헤더를 자동으로 주입하고, 에러 처리를 일관되게 수행합니다.
 * @param endpoint - NEXON Open API의 Endpoint
 * @param option - 추가 옵션 (선택)
 * @param apiKey - 사용자 API 키 (선택, 생략 시 서버 환경변수 사용)
 * @throws {Error} - NEXON Open API 응답이 ok가 아닐 경우 (4xx, 5xx)
 */
async function nexonFetch<T>({
  endpoint,
  option = {},
  apiKey = "",
}: {
  endpoint: string;
  option?: RequestInit;
  apiKey?: string;
}): Promise<T> {
  // CloudFlare 로컬 시크릿 파일 접근
  const { env } = await getCloudflareContext();

  // 만약 입력받은 apiKey가 없다면 서버의 apiKey를 사용한다.
  const finalApiKey = apiKey || env.NEXON_API_SERVICE_KEY;

  // endpoint는 반드시 '/'로 시작해야 합니다. (예: '/maplestory/v1/id')
  const url = `${NEXON_OPEN_API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...option,
    headers: {
      "x-nxopen-api-key": finalApiKey,
      accept: "application/json",
      ...option.headers, // 호출자가 헤더를 직접 지정하면 기본값을 덮어씁니다.
    },
  });

  if (!response.ok) {
    // 넥슨 API가 반환하는 에러 메세지 파싱
    const errorData = (await response.json().catch(() => ({}))) as NEXONOpenAPIError;
    const errorMessage = errorData.error?.name || JSON.stringify(errorData) || "Unknown Error";
    throw new Error(`NEXON Open API Error: ${response.status} - ${errorMessage}`);
  }

  return response.json() as Promise<T>;
}

/**
 * 사용자의 NEXON Open API키를 받아서, 사용자의 계정 OUID를 출력하는 함수 입니다.
 * @param apiKey - 사용자의 NEXON Open API Key
 * @returns - 해당 NEXON Open API Key의 OUID
 */
export async function getAccountOUID(apiKey: string) {
  const { ouid } = await nexonFetch<AccountOUIDType>({
    endpoint: `/maplestory/v1/ouid`,
    apiKey: apiKey,
  });

  return ouid;
}

export async function getCharacterList(apiKey: string) {
  const data = await nexonFetch<CharacterListType>({
    endpoint: `/maplestory/v1/character/list`,
    apiKey: apiKey,
  });

  return data;
}

export async function getCharacterOcid(characterName: string) {
  const data = await nexonFetch<{ ocid: string }>({
    endpoint: `/maplestory/v1/id?character_name=${encodeURIComponent(characterName)}`,
  });
  return data.ocid;
}

export async function getCharacterBasic(ocid: string, date?: string) {
  const q = new URLSearchParams({ ocid });
  if (date) { q.set("date", date); }
  return nexonFetch<CharacterBasic>({ endpoint: `/maplestory/v1/character/basic?${q}` });
}

export async function getCharacterPopularity(ocid: string, date?: string) {
  const q = new URLSearchParams({ ocid });
  if (date) { q.set("date", date); }
  return nexonFetch<CharacterPopularity>({ endpoint: `/maplestory/v1/character/popularity?${q}` });
}

export async function getCharacterStat(ocid: string, date?: string) {
  const q = new URLSearchParams({ ocid });
  if (date) { q.set("date", date); }
  return nexonFetch<StatJsonType>({ endpoint: `/maplestory/v1/character/stat?${q}` });
}

export async function getCharacterUnion(ocid: string, date?: string) {
  const q = new URLSearchParams({ ocid });
  if (date) { q.set("date", date); }
  return nexonFetch<CharacterUnion>({ endpoint: `/maplestory/v1/user/union?${q}` });
}

export async function getCharacterDojang(ocid: string) {
  const data = await nexonFetch<DojangJsonType>({
    endpoint: `/maplestory/v1/character/dojang?ocid=${ocid}`,
  });
  return data;
}

export async function getCharacterItemEquipment(ocid: string) {
  const data = await nexonFetch<ItemEquipmentJsonType>({
    endpoint: `/maplestory/v1/character/item-equipment?ocid=${ocid}`,
  });
  return data;
}

// ─── 캐릭터 추가 정보 ───────────────────────────────────────────────────────

export async function getCharacterHyperStat(ocid: string) {
  return nexonFetch<HyperStatJsonType>({
    endpoint: `/maplestory/v1/character/hyper-stat?ocid=${ocid}`,
  });
}

export async function getCharacterPropensity(ocid: string) {
  return nexonFetch<PropensityJsonType>({
    endpoint: `/maplestory/v1/character/propensity?ocid=${ocid}`,
  });
}

export async function getCharacterAbility(ocid: string) {
  return nexonFetch<AbilityJsonType>({
    endpoint: `/maplestory/v1/character/ability?ocid=${ocid}`,
  });
}

export async function getCharacterCashItemEquipment(ocid: string) {
  return nexonFetch<CashEquipmentJsonType>({
    endpoint: `/maplestory/v1/character/cashitem-equipment?ocid=${ocid}`,
  });
}

export async function getCharacterSymbolEquipment(ocid: string) {
  return nexonFetch<SymbolJsonType>({
    endpoint: `/maplestory/v1/character/symbol-equipment?ocid=${ocid}`,
  });
}

export async function getCharacterSetEffect(ocid: string) {
  return nexonFetch<SetEffectJsonType>({
    endpoint: `/maplestory/v1/character/set-effect?ocid=${ocid}`,
  });
}

export async function getCharacterBeautyEquipment(ocid: string) {
  return nexonFetch<BeautyEquipmentJsonType>({
    endpoint: `/maplestory/v1/character/beauty-equipment?ocid=${ocid}`,
  });
}

export async function getCharacterAndroidEquipment(ocid: string) {
  return nexonFetch<AndroidEquipmentJsonType>({
    endpoint: `/maplestory/v1/character/android-equipment?ocid=${ocid}`,
  });
}

export async function getCharacterPetEquipment(ocid: string) {
  return nexonFetch<PetJsonType>({
    endpoint: `/maplestory/v1/character/pet-equipment?ocid=${ocid}`,
  });
}

export type CharacterSkillGrade =
  | "0"
  | "1"
  | "1.5"
  | "2"
  | "2.5"
  | "3"
  | "4"
  | "hyperpassive"
  | "hyperactive"
  | "5"
  | "6";

export async function getCharacterSkill(ocid: string, grade: CharacterSkillGrade) {
  return nexonFetch<SkillGradeData>({
    endpoint: `/maplestory/v1/character/skill?ocid=${ocid}&character_skill_grade=${grade}`,
  });
}

export async function getCharacterLinkSkill(ocid: string) {
  return nexonFetch<LinkSkillJsonType>({
    endpoint: `/maplestory/v1/character/link-skill?ocid=${ocid}`,
  });
}

export async function getCharacterVMatrix(ocid: string) {
  return nexonFetch<VMatrixJsonType>({
    endpoint: `/maplestory/v1/character/vmatrix?ocid=${ocid}`,
  });
}

export async function getCharacterHexaMatrix(ocid: string) {
  return nexonFetch<HexaMatrixJsonType>({
    endpoint: `/maplestory/v1/character/hexamatrix?ocid=${ocid}`,
  });
}

export async function getCharacterHexaMatrixStat(ocid: string) {
  return nexonFetch<HexaStatJsonType>({
    endpoint: `/maplestory/v1/character/hexamatrix-stat?ocid=${ocid}`,
  });
}

export async function getCharacterOtherStat(ocid: string) {
  return nexonFetch<OtherJsonType>({
    endpoint: `/maplestory/v1/character/other-stat?ocid=${ocid}`,
  });
}

export async function getCharacterRingReserveSkillEquipment(ocid: string) {
  return nexonFetch<RingReserveSkillEquipmentJsonType>({
    endpoint: `/maplestory/v1/character/ring-reserve-skill-equipment?ocid=${ocid}`,
  });
}

export async function getAccountAchievement() {
  return nexonFetch<AccountAchievementType>({
    endpoint: `/maplestory/v1/user/achievement`,
  });
}

// ─── 유니온 추가 정보 ───────────────────────────────────────────────────────

export async function getUnionRaider(ocid: string) {
  return nexonFetch<UnionRaiderType>({
    endpoint: `/maplestory/v1/user/union-raider?ocid=${ocid}`,
  });
}

export async function getUnionArtifact(ocid: string) {
  return nexonFetch<UnionArtifactType>({
    endpoint: `/maplestory/v1/user/union-artifact?ocid=${ocid}`,
  });
}

export async function getUnionChampion(ocid: string) {
  return nexonFetch<UnionChampionType>({
    endpoint: `/maplestory/v1/user/union-champion?ocid=${ocid}`,
  });
}

// ─── 길드 ───────────────────────────────────────────────────────────────────

export async function getGuildId(guildName: string, worldName: string) {
  const data = await nexonFetch<{ oguild_id: string }>({
    endpoint: `/maplestory/v1/guild/id?guild_name=${encodeURIComponent(guildName)}&world_name=${encodeURIComponent(worldName)}`,
  });
  return data.oguild_id;
}

export async function getGuildBasic(oguildId: string) {
  return nexonFetch<GuildBasicType>({
    endpoint: `/maplestory/v1/guild/basic?oguild_id=${oguildId}`,
  });
}

// ─── 연무장 ─────────────────────────────────────────────────────────────────

export async function getBattlePracticeReplayId(ocid: string) {
  return nexonFetch<BattlePracticeReplayIdType>({
    endpoint: `/maplestory/v1/battle-practice/replay-id?ocid=${ocid}`,
  });
}

export async function getBattlePracticeResult(replayId: string) {
  return nexonFetch<BattlePracticeResultType>({
    endpoint: `/maplestory/v1/battle-practice/result?replay_id=${replayId}`,
  });
}

export async function getBattlePracticeSkillTimeline(replayId: string, pageNo?: number) {
  const query = new URLSearchParams({ replay_id: replayId });
  if (pageNo !== undefined) { query.set("page_no", String(pageNo)); }
  return nexonFetch<BattlePracticeSkillTimelineType>({
    endpoint: `/maplestory/v1/battle-practice/skill-timeline?${query}`,
  });
}

// ─── 확률 이력 ───────────────────────────────────────────────────────────────

export async function getStarforceHistory(count: number, date?: string, cursor?: string) {
  const query = new URLSearchParams({ count: String(count) });
  if (date) { query.set("date", date); }
  if (cursor) { query.set("cursor", cursor); }
  return nexonFetch<StarforceHistoryType>({
    endpoint: `/maplestory/v1/history/starforce?${query}`,
  });
}

export async function getPotentialHistory(count: number, date?: string, cursor?: string) {
  const query = new URLSearchParams({ count: String(count) });
  if (date) { query.set("date", date); }
  if (cursor) { query.set("cursor", cursor); }
  return nexonFetch<PotentialHistoryType>({
    endpoint: `/maplestory/v1/history/potential?${query}`,
  });
}

export async function getCubeHistory(count: number, date?: string, cursor?: string) {
  const query = new URLSearchParams({ count: String(count) });
  if (date) { query.set("date", date); }
  if (cursor) { query.set("cursor", cursor); }
  return nexonFetch<CubeHistoryType>({
    endpoint: `/maplestory/v1/history/cube?${query}`,
  });
}

// ─── 랭킹 ───────────────────────────────────────────────────────────────────

export async function getRankingOverall(
  date: string,
  options: { worldName?: string; worldType?: number; characterClass?: string; ocid?: string; page?: number } = {},
) {
  const query = new URLSearchParams({ date });
  if (options.worldName) { query.set("world_name", options.worldName); }
  if (options.worldType !== undefined) { query.set("world_type", String(options.worldType)); }
  if (options.characterClass) { query.set("class", options.characterClass); }
  if (options.ocid) { query.set("ocid", options.ocid); }
  if (options.page !== undefined) { query.set("page", String(options.page)); }
  return nexonFetch<RankingOverallType>({
    endpoint: `/maplestory/v1/ranking/overall?${query}`,
  });
}

export async function getRankingUnion(
  date: string,
  options: { worldName?: string; ocid?: string; page?: number } = {},
) {
  const query = new URLSearchParams({ date });
  if (options.worldName) { query.set("world_name", options.worldName); }
  if (options.ocid) { query.set("ocid", options.ocid); }
  if (options.page !== undefined) { query.set("page", String(options.page)); }
  return nexonFetch<RankingUnionType>({
    endpoint: `/maplestory/v1/ranking/union?${query}`,
  });
}

export async function getRankingGuild(
  date: string,
  rankingType: 0 | 1 | 2,
  options: { worldName?: string; guildName?: string; page?: number } = {},
) {
  const query = new URLSearchParams({ date, ranking_type: String(rankingType) });
  if (options.worldName) { query.set("world_name", options.worldName); }
  if (options.guildName) { query.set("guild_name", options.guildName); }
  if (options.page !== undefined) { query.set("page", String(options.page)); }
  return nexonFetch<RankingGuildType>({
    endpoint: `/maplestory/v1/ranking/guild?${query}`,
  });
}

export async function getRankingDojang(
  date: string,
  difficulty: 0 | 1,
  options: { worldName?: string; characterClass?: string; ocid?: string; page?: number } = {},
) {
  const query = new URLSearchParams({ date, difficulty: String(difficulty) });
  if (options.worldName) { query.set("world_name", options.worldName); }
  if (options.characterClass) { query.set("class", options.characterClass); }
  if (options.ocid) { query.set("ocid", options.ocid); }
  if (options.page !== undefined) { query.set("page", String(options.page)); }
  return nexonFetch<RankingDojangType>({
    endpoint: `/maplestory/v1/ranking/dojang?${query}`,
  });
}

export async function getRankingTheSeed(
  date: string,
  options: { worldName?: string; ocid?: string; page?: number } = {},
) {
  const query = new URLSearchParams({ date });
  if (options.worldName) { query.set("world_name", options.worldName); }
  if (options.ocid) { query.set("ocid", options.ocid); }
  if (options.page !== undefined) { query.set("page", String(options.page)); }
  return nexonFetch<RankingTheSeedType>({
    endpoint: `/maplestory/v1/ranking/theseed?${query}`,
  });
}

export async function getRankingAchievement(
  date: string,
  options: { ocid?: string; page?: number } = {},
) {
  const query = new URLSearchParams({ date });
  if (options.ocid) { query.set("ocid", options.ocid); }
  if (options.page !== undefined) { query.set("page", String(options.page)); }
  return nexonFetch<RankingAchievementType>({
    endpoint: `/maplestory/v1/ranking/achievement?${query}`,
  });
}

// ─── 공지 ───────────────────────────────────────────────────────────────────

export async function getNotice() {
  return nexonFetch<NoticeListType>({ endpoint: `/maplestory/v1/notice` });
}

export async function getNoticeDetail(noticeId: number) {
  return nexonFetch<NoticeDetailType>({
    endpoint: `/maplestory/v1/notice/detail?notice_id=${noticeId}`,
  });
}

export async function getNoticeUpdate() {
  return nexonFetch<UpdateNoticeListType>({ endpoint: `/maplestory/v1/notice-update` });
}

export async function getNoticeUpdateDetail(noticeId: number) {
  return nexonFetch<NoticeDetailType>({
    endpoint: `/maplestory/v1/notice-update/detail?notice_id=${noticeId}`,
  });
}

export async function getNoticeEvent() {
  return nexonFetch<EventNoticeListType>({ endpoint: `/maplestory/v1/notice-event` });
}

export async function getNoticeEventDetail(noticeId: number) {
  return nexonFetch<EventNoticeDetailType>({
    endpoint: `/maplestory/v1/notice-event/detail?notice_id=${noticeId}`,
  });
}

export async function getNoticeCashShop() {
  return nexonFetch<CashShopNoticeListType>({ endpoint: `/maplestory/v1/notice-cashshop` });
}

export async function getNoticeCashShopDetail(noticeId: number) {
  return nexonFetch<CashShopNoticeDetailType>({
    endpoint: `/maplestory/v1/notice-cashshop/detail?notice_id=${noticeId}`,
  });
}
