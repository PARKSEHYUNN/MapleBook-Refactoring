/**
 * @file src/types/user.ts - 서버 설정 타입 정의
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 서버 설정의 관한 타입에 대한
 * TypeScript 인터페이스 및 타입들을 모아둔 파일입니다.
 * 이곳의 정의된 타입들은 주로 DB 스키마(schema.ts)의 JSON 컬럼 타입 단언($type<T>) 및
 * 프론트엔드 UI 렌더링, API 응답 타입 등에 재사용됩니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { UnionGrade } from "../types/common";

export const BACKGROUND_OPTIONS = ["mapleIsland", "roadOfVanishing", "cernium"]
export const THEME_OPTIONS = ["dark", "light", "sky", "pink"];

export type CharacterBackground = typeof BACKGROUND_OPTIONS[number];
export type CharacterTheme = typeof THEME_OPTIONS[number];

export const BACKGROUND_IMAGE_MAP: Record<CharacterBackground, string> = {
  mapleIsland: "maple-island.png",
  roadOfVanishing: "road-of-vanishing.png",
  cernium: "cernium.png"
};

/**
 * 캐릭터 기본 설정 타입
 */
export interface DefaultSettingsJsonType {
  action: string;
  actionFrame: number;
  emotion: string;
  emotionFrame: number;
  wmotion: string;
  background: CharacterBackground;
  theme: CharacterTheme;
  flip: boolean;
}

/**
 * 캐릭터 기본 설정 기본값
 */
export const DefaultSettings: DefaultSettingsJsonType = {
  action: "A00",
  actionFrame: 0,
  emotion: "E00",
  emotionFrame: 0,
  wmotion: "W00",
  background: "mapleIsland",
  theme: "dark",
  flip: false
}

/**
 * 캐릭터 스냅샷 타입
 */
export interface SnapshotJsonType {
  character_level: number;
  character_exp_rate: number;
  character_guild_name: string | null;
  character_image: string;
  combat_power: number;
  union_level: number;
  union_grade: UnionGrade,
  popularity: number;
};