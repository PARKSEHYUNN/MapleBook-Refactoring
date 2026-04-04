/**
 * @file src/types/guild.ts - 메이플스토리 길드 JSON 데이터 타입 정의
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * NEXON Open API에서 반환되는 메이플스토리 길드에 대한
 * TypeScript 인터페이스 및 타입들을 모아둔 파일입니다.
 * 이곳의 정의된 타입들은 주로 DB 스키마(schema.ts)의 JSON 컬럼 타입 단언($type<T>) 및
 * 프론트엔드 UI 렌더링, API 응답 타입 등에 재사용됩니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

/**
 * 길드 기본 정보 타입
 * @see NEXON Open API - /maplestory/v1/guild/basic
 */
export interface GuildJsonType {
  date:                 string | null;
  world_name:           string;
  guild_name:           string;
  guild_level:          number;
  guild_fame:           number;
  guild_point:          number;
  guild_master_name:    string;
  guild_member_count:   number;
  guild_member:         string[];
  guild_skill:          GuildSkill[]; 
  guild_noblesse_skill: GuildSkill[];
}

export interface GuildSkill {
  skill_name:        string;
  skill_description: string;
  skill_level:       number;
  skill_effect:      string;
  skill_icon:        string;
}