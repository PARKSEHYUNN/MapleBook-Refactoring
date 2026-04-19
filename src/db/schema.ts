/**
 * @file src/db/schema.ts - Drizzle SQL 스키마 파일
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 이 파일은 Drizzle의 SQL 스키마, Typescript 타입, 마이그레이션 가이드 의 역활을 합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { sql } from "drizzle-orm";
import {
  AnySQLiteColumn,
  check,
  index,
  int,
  primaryKey,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

import { GuildSkill } from "@/types/guild";

import {
  AbilityJsonType,
  PotentialOptionGrade,
  AndroidEquipmentJsonType,
  BeautyEquipmentJsonType,
  CashEquipmentJsonType,
  CharacterUnion,
  DojangJsonType,
  HexaMatrixJsonType,
  HexaStatJsonType,
  HyperStatJsonType,
  ItemEquipmentJsonType,
  LinkSkillJsonType,
  OtherJsonType,
  PetJsonType,
  PropensityJsonType,
  RingReserveSkillEquipmentJsonType,
  SetEffectJsonType,
  SkillJsonType,
  StatJsonType,
  SymbolJsonType,
  UnionArtifactType,
  UnionChampionType,
  UnionRaiderType,
  VMatrixJsonType,
} from "../types/character";
import {
  ClassName,
  NotificationsType,
  ReviewReportReason,
  ReviewReportStatus,
  StarRating,
  UnionGrade,
  UserRole,
  ViewCountPeriodType,
  VoteRating,
  WorldName,
} from "../types/common";
import { DefaultSettings, DefaultSettingsJsonType, SnapshotJsonType } from "../types/user";

/**
 * 사용자 정보를 저장하는 테이블 입니다.
 * @description
 * NEXON Open API의 OUID를 기반으로 유저를 식별하며, 서비스 내 권한(role)과 제재 상태(isBanned)를 관리합니다.
 * @see {@link characters} - mainCharacterId는 characters 테이블을 참조합니다.
 */
export const users = sqliteTable("users", {
  id: int("id").primaryKey({ autoIncrement: true }),
  ouid: text("ouid").notNull().unique(),

  /** "user" | "admin" 값을 가지며, 기본값은 "user" 입니다. */
  role: text("role").notNull().$type<UserRole>().default("user"),

  /** true일 경우 서비스 이용이 제한됩니다. */
  isBanned: int("is_banned", { mode: "boolean" }).notNull().default(false),
  banReason: text("ban_reason"),
  mainCharacterId: int("main_character_id").references((): AnySQLiteColumn => characters.id),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

/**
 * 캐릭터 정보를 저장하는 테이블 입니다.
 * @description
 * NEXON Open API의 OCID를 기반으로 유저를 식별하며, 사용자의 정보를 콜드 데이터(Cold Data)와 핫 데이터(Hot Data)를 저장합니다.
 * @see {@link user} - userId는 user 테이블을 참조합니다.
 * @see {@link guild} - characterGuildId는 guild 테이블을 참조합니다.
 */
export const characters = sqliteTable("characters", {
  id: int("id").primaryKey({ autoIncrement: true }),
  ocid: text("ocid").notNull().unique(),
  userId: int("user_id").references((): AnySQLiteColumn => users.id),
  characterName: text("character_name").notNull(),
  worldName: text("world_name").notNull().$type<WorldName>(),
  characterClass: text("character_class").notNull().$type<ClassName>(),
  characterClassLevel: real("character_class_level"),
  characterLevel: int("character_level").notNull(),
  characterExp: int("character_exp").notNull().default(0),
  characterExpRate: real("character_exp_rate").notNull().default(0),
  characterDateCreate: text("character_date_create"),
  characterGuildName: text("character_guild_name"),
  characterGuildId: int("character_guild_id").references((): AnySQLiteColumn => guilds.id),
  characterImage: text("character_image"),
  accessFlag: int("accessFlag", { mode: "boolean" }).notNull().default(false),
  popularity: int("popularity").default(0),
  combatPower: int("combat_power").default(0),
  unionLevel: int("unionLevel").default(0),
  unionGrade: text("unionGrade").$type<UnionGrade>().default("없음"),
  unionJson: text("union_json", { mode: "json" }).$type<CharacterUnion>(),
  statJson: text("stat_json", { mode: "json" }).$type<StatJsonType>(),
  hyperStatJson: text("hyper_stat_json", { mode: "json" }).$type<HyperStatJsonType>(),
  propensityJson: text("propensity_json", { mode: "json" }).$type<PropensityJsonType>(),
  abilityJson: text("ability_json", { mode: "json" }).$type<AbilityJsonType>(),
  equipmentJson: text("equipment_json", { mode: "json" }).$type<ItemEquipmentJsonType>(),
  symbolJson: text("symbol_json", { mode: "json" }).$type<SymbolJsonType>(),
  cashEquipmentJson: text("cash_equipment_json", { mode: "json" }).$type<CashEquipmentJsonType>(),
  setEffectJson: text("set_effect_json", { mode: "json" }).$type<SetEffectJsonType>(),
  beautyEquipmentJson: text("beauty_equipment_json", {
    mode: "json",
  }).$type<BeautyEquipmentJsonType>(),
  androidJson: text("android_json", { mode: "json" }).$type<AndroidEquipmentJsonType>(),
  petJson: text("pet_json", { mode: "json" }).$type<PetJsonType>(),
  skillJson: text("skill_json", { mode: "json" }).$type<SkillJsonType>(),
  linkSkillJson: text("link_skill_json", { mode: "json" }).$type<LinkSkillJsonType>(),
  vmatrixJson: text("vmatrix_json", { mode: "json" }).$type<VMatrixJsonType>(),
  hexamatrixJson: text("hexamatrix_json", { mode: "json" }).$type<HexaMatrixJsonType>(),
  hexaStatJson: text("hexa_stat_json", { mode: "json" }).$type<HexaStatJsonType>(),
  dojangJson: text("dojang_json", { mode: "json" }).$type<DojangJsonType>(),
  otherJson: text("other_json", { mode: "json" }).$type<OtherJsonType>(),
  ringReserveSkillJson: text("ring_reserve_skill_json", {
    mode: "json",
  }).$type<RingReserveSkillEquipmentJsonType>(),
  unionRaiderJson: text("union_raider_json", { mode: "json" }).$type<UnionRaiderType>(),
  unionArtifactJson: text("union_artifact_json", { mode: "json" }).$type<UnionArtifactType>(),
  unionChampionJson: text("union_champion_json", { mode: "json" }).$type<UnionChampionType>(),
  defaultSettings: text("default_settings", { mode: "json" })
    .$type<DefaultSettingsJsonType>()
    .$defaultFn(() => DefaultSettings),
  bio: text("bio"),
  syncedAt: text("synced_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  isIncomplete: int("is_incomplete", { mode: "boolean" }).notNull().default(true),
});

/**
 * 캐릭터 스냅샷을 저장하는 테이블 입니다.
 * @description
 * NEXON Open API의 OCID와 characters.id를 기반으로 유저를 식별하며, 캐릭터의 기본 정보를 날짜별로 저장합니다.
 * @see {@link characters} - guildMasterId는 characters 테이블을 참조합니다.
 */
export const characterSnapshots = sqliteTable("character_snapshots", {
  id: int("id").primaryKey({ autoIncrement: true }),
  characterId: int("character_id")
    .notNull()
    .references(() => characters.id),
  ocid: text("ocid").notNull(),
  snapshotData: text("snapshot_data", { mode: "json" }).notNull().$type<SnapshotJsonType>(),
  snapshotDate: text("snapshot_date").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 길드를 저장하는 테이블 입니다.
 * @description
 * NEXON Open API의 OGUILD_ID와 worldName을 기반으로 길드를 식별하며, 길드 기본 정보를 저장합니다.
 * @see {@link characters} - characterId는 characters 테이블을 참조합니다.
 */
export const guilds = sqliteTable("guilds", {
  id: int("id").primaryKey({ autoIncrement: true }),
  oguildId: text("oguild_id").notNull(),
  worldName: text("world_name").notNull().$type<WorldName>(),
  guildName: text("guild_name").notNull(),
  guildLevel: int("guild_level").notNull().default(0),
  guildFame: int("guild_fame").notNull().default(0),
  guildMasterId: int("guild_master_id")
    .notNull()
    .references(() => characters.id),
  guildMemberCount: int("guild_member_count").notNull(),
  guildSkillJson: text("guild_skill_json", { mode: "json" }).$type<GuildSkill[]>(),
  noblesseSkillJson: text("noblesse_skill_json", { mode: "json" }).$type<GuildSkill[]>(),
  syncedAt: text("synced_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/**
 * 캐릭터의 리뷰를 저장하는 테이블 입니다.
 * @description
 * characters.id를 기반으로 캐릭터를 식별하며, 캐릭터별 리뷰를 저장합니다.
 * @see {@link users} - reviewerId는 users 테이블을 참조합니다.
 * @see {@link characters} - targetId는 characters 테이블을 참조합니다.
 */
export const reviews = sqliteTable(
  "reviews",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    reviewerId: int("reviewer_id")
      .notNull()
      .references(() => users.id),
    targetId: int("target_id")
      .notNull()
      .references(() => characters.id),
    mannerScore: int("manner_score").notNull().$type<StarRating>(),
    content: text("content"),
    images: text("images", { mode: "json" }).$type<string[]>(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    deletedAt: text("deleted_at"),
  },
  (table) => ({
    scoreCheck: check("manner_score_check", sql`${table.mannerScore} BETWEEN 1 AND 5`),
  }),
);

/**
 * 캐릭터의 리뷰가 받은 투표를 저장하는 테이블 입니다.
 * @description
 * reviews.id와 users.id를 기반으로 리뷰별 투표를 식별하며, 리뷰별 투표를 저장합니다.
 * @see {@link reviews} - reviewId는 reviews 테이블을 참조합니다.
 * @see {@link users} - voterId는 users 테이블을 참조합니다.
 */
export const reviewVotes = sqliteTable(
  "review_votes",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    reviewId: int("review_id")
      .notNull()
      .references(() => reviews.id),
    voterId: int("voter_id")
      .notNull()
      .references(() => users.id),
    vote: int("vote").notNull().$type<VoteRating>(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    voteCheck: check("vote_check", sql`${table.vote} IN (-1, 1)`),
    uniqueCheck: unique("unique_vote").on(table.reviewId, table.voterId),
  }),
);

/**
 * 캐릭터의 리뷰가 받은 신고를 저장하는 테이블 입니다.
 * @description
 * users.id와 reviews.id를 기반으로 리뷰 신고를 식별하며, 리뷰 신고 기록을 저장합니다.
 * @see {@link users} - reporterId는 users 테이블을 참조합니다.
 * @see {@link reviews} - reviewId는 reviews 테이블을 참조합니다.
 */
export const reviewReports = sqliteTable(
  "review_reports",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    reporterId: int("reporter_id")
      .notNull()
      .references(() => users.id),
    reviewId: int("review_id")
      .notNull()
      .references(() => reviews.id),
    reason: text("reason").notNull().$type<ReviewReportReason>(),
    comment: text("comment"),
    status: text("status").notNull().$type<ReviewReportStatus>().default("pending"),
    resolvedAt: text("resolved_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    uniqueReport: unique("unique_report").on(table.reporterId, table.reviewId),
  }),
);

/**
 * 캐릭터 페이지에 접속한 기록을 저장하는 테이블 입니다.
 * @description
 * users.id 또는 사용자의 IP를 기반으로 캐릭터 페이지의 접속 기륵을 식별하며, 캐릭터 페이지 접속기록을 저장합니다.
 * @see {@link characters} - characterId는 characters 테이블을 참조합니다.
 * @see {@link users} - identifier는 users 테이블을 참조합니다.
 */
export const visitorLogs = sqliteTable(
  "visitor_logs",
  {
    characterId: int("character_id")
      .notNull()
      .references(() => characters.id),
    day: text("day").notNull(),
    identifier: text("identifier").notNull(),
  },
  (table) => ({
    pk: primaryKey({
      name: "visitor_logs_pk",
      columns: [table.characterId, table.day, table.identifier],
    }),
  }),
);

/**
 * 캐릭터 페이지의 접속 카운트를 저장하는 테이블 입니다.
 * @description
 * characters.id를 기반으로 캐릭터 페이지의 접속 카운트를 식별하며, 캐릭터 페이지의 접속 카운트를 저장합니다.
 * @see {@link characters} - characterId는 characters 테이블을 참조합니다.
 */
export const viewCounts = sqliteTable(
  "view_counts",
  {
    characterId: int("character_id")
      .notNull()
      .references(() => characters.id),
    periodType: text("period_type").notNull().$type<ViewCountPeriodType>(),
    periodKey: text("period_key").notNull(),
    count: int("count").notNull().default(0),
  },
  (table) => ({
    pk: primaryKey({
      name: "view_counts_pk",
      columns: [table.characterId, table.periodType, table.periodKey],
    }),
  }),
);

/**
 * 사용자에게 전해줄 알람을 저장하는 테이블 입니다.
 * @description
 * users.id를 기반으로 사용자별 알람을 저장합니다.
 * @see {@link users} - userId는 users 테이블을 참조합니다.
 */
export const notifications = sqliteTable(
  "notifications",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    userId: int("user_id")
      .notNull()
      .references(() => users.id),
    type: text("type").notNull().$type<NotificationsType>().default("review"),
    title: text("title").notNull(),
    body: text("body"),
    link: text("link"),
    isRead: int("is_read", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    unreadIdx: index("unread_idx").on(table.userId, table.isRead),
  }),
);

/**
 * 사용자의 이용약관 동의 및 버전 관리를 저장하는 테이블 입니다.
 * @description
 * useris.id를 기반으로 사용자별 이용약관 동의 및 이용약관 버전을 저장합니다.
 * @see {@link users} - userId는 users 테이블을 참조합니다.
 */
export const consentLogs = sqliteTable(
  "consent_logs",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    userId: int("user_id")
      .notNull()
      .references(() => users.id),
    termsVersion: text("terms_version").notNull(),
    privacyVersion: text("privacy_version").notNull(),
    marketingAgreed: int("marketing_agreed", { mode: "boolean" }).notNull().default(false),
    consentedAt: text("consented_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
  },
  (table) => ({
    userIdIdx: index("consent_logs_user_id_idx").on(table.userId),
  }),
);

/**
 * 잠재능력 옵션 텍스트 → 등급 매핑을 저장하는 테이블입니다.
 * @description
 * 캐릭터 검색 시 잠재능력 1번 라인(항상 해당 등급)을 기준으로 누적합니다.
 * 2, 3번 라인 등급 판별에 활용됩니다.
 */
export const potentialOptionGrades = sqliteTable("potential_option_grades", {
  optionText: text("option_text").primaryKey(),
  grade: text("grade").notNull().$type<PotentialOptionGrade>(),
  seenCount: int("seen_count").notNull().default(1),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const loginHistory = sqliteTable("login_history", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: int("user_id").references(() => users.id),
  loginType: text("login_type", { enum: ["MANUAL", "AUTO"] }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  isSuccess: int("is_success", { mode: "boolean" }).notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
