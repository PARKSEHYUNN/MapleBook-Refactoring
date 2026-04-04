/**
 * @file src/types/union.ts - 메이플스토리 유니온 JSON 데이터 타입 정의
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * NEXON Open API에서 반환되는 메이플스토리 유니온에 대한
 * TypeScript 인터페이스 및 타입들을 모아둔 파일입니다.
 * 이곳의 정의된 타입들은 주로 DB 스키마(schema.ts)의 JSON 컬럼 타입 단언($type<T>) 및
 * 프론트엔드 UI 렌더링, API 응답 타입 등에 재사용됩니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

/**
 * 유니온 정보 타입
 * @see NEXON Open API - /maplestory/v1/user/union
 */
export interface UnionJsonType {
  date:                 string | null;
  union_level:          number | null;
  union_grade:          string | null;
  union_artifact_level: number | null;
  union_artifact_exp:   number | null;
  union_artifact_point: number | null;
}

/**
 * 유니온 공격대 정보 타입
 * @see NEXON Open API - /maplestory/v1/user/union-raider
 */
export interface UnionRaiderJsonType {
  date:                  string | null;
  
  union_raider_stat:     string[];
  union_occupied_stat:   string[];
  union_inner_stat:      UnionInnerStat[];
  union_block:           UnionBlock[];
  
  use_preset_no:         number;
  
  union_raider_preset_1: UnionRaiderPreset | null;
  union_raider_preset_2: UnionRaiderPreset | null;
  union_raider_preset_3: UnionRaiderPreset | null;
  union_raider_preset_4: UnionRaiderPreset | null;
  union_raider_preset_5: UnionRaiderPreset | null;
}

export interface UnionRaiderPreset {
  union_raider_stat:   string[];
  union_occupied_stat: string[];
  union_inner_stat:    UnionInnerStat[];
  union_block:         UnionBlock[];
}

export interface UnionInnerStat {
  stat_field_id:     string;
  stat_field_effect: string;
}

export interface UnionBlock {
  block_type:          string;
  block_class:         string;
  block_level:         string;
  block_control_point: BlockPosition; 
  block_position:      BlockPosition[] | null; 
}

export interface BlockPosition {
  x: number;
  y: number;
}

/**
 * 유니온 아티팩트 정보 타입
 * @see NEXON Open API - /maplestory/v1/user/union-artifact
 */
export interface UnionArtifactJsonType {
  date:                     string | null;
  union_artifact_effect:    ArtifactEffect[];
  union_artifact_crystal:   ArtifactCrystal[];
  union_artifact_remain_ap: number;
}

export interface ArtifactEffect {
  name:  string;
  level: number;
}

export interface ArtifactCrystal {
  name:                  string;
  validity_flag:         string;
  date_expire:           string | null; 
  level:                 number;
  crystal_option_name_1: string;
  crystal_option_name_2: string;
  crystal_option_name_3: string;
}

/**
 * 유니온 챔피언 정보 타입
 * @see NEXON Open API - /maplestory/v1/user/union-champion
 */
export interface UnionChampionJsonType {
  date:                      string | null;
  union_champion:            UnionChampionInfo[];
  champion_badge_total_info: ChampionBadgeStat[];
}

export interface UnionChampionInfo {
  champion_name:       string;
  champion_slot:       number;
  champion_grade:      string;
  champion_class:      string;
  champion_badge_info: ChampionBadgeStat[];
}

export interface ChampionBadgeStat {
  stat: string;
}