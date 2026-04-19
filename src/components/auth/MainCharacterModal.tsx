/**
 * @file src/components/auth/MainCharacterModal.tsx - 대표 캐릭터 설정 모달
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 사용자의 NEXON 계정에 연결된 캐릭터 목록을 보여주고
 * 대표 캐릭터를 선택하거나 건너뛸 수 있는 모달입니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

"use client";

import { useState } from "react";
import Image from "next/image";

import { CheckCircle, RotateCw, SkipForward, UserRound } from "lucide-react";

import { BaseModal } from "@/components/ui/BaseModal";
import type { CharacterList } from "@/types/character";

interface MainCharacterModalProps {
  characters: CharacterList[];
  onSelect: (ocid: string) => void;
  onSkip: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const PLACEHOLDER_CHARACTERS: CharacterList[] = [
  {
    ocid: "1",
    character_name: "메이플전사",
    world_name: "스카니아",
    character_class: "히어로",
    character_level: 285,
  },
  {
    ocid: "2",
    character_name: "힐러봇",
    world_name: "스카니아",
    character_class: "비숍",
    character_level: 260,
  },
  {
    ocid: "3",
    character_name: "원거리딜러",
    world_name: "스카니아",
    character_class: "보우마스터",
    character_level: 230,
  },
];

export default function MainCharacterModal({
  characters = PLACEHOLDER_CHARACTERS,
  onSelect,
  onSkip,
  onRefresh,
  isLoading = false,
}: MainCharacterModalProps) {
  const [selectedOcid, setSelectedOcid] = useState<string | null>(null);

  return (
    <BaseModal boxClassName="max-w-md p-6 flex flex-col gap-5">
        {/* 헤더 */}
        <div className="flex justify-between me-3">
          <div>
            <h2 className="text-lg font-bold">대표 캐릭터 설정</h2>
            <p className="text-sm text-base-content/60 mt-0.5">
              프로필에 표시될 대표 캐릭터를 선택해주세요.
            </p>
          </div>
          <div>
            <button className="btn btn-primary w-9 h-9 p-1 rounded-xl" onClick={() => onRefresh()}>
              <RotateCw className="text-xs" />
            </button>
          </div>
        </div>

        {/* 캐릭터 목록 */}
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
          {characters.map((character) => {
            const isSelected = selectedOcid === character.ocid;
            return (
              <button
                key={character.ocid}
                type="button"
                onClick={() => setSelectedOcid(character.ocid)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-base-300 bg-base-200/40 hover:bg-base-200 hover:border-base-400"
                }`}
              >
                {/* 캐릭터 아이콘 */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden ${isSelected ? "bg-primary/20" : "bg-base-300"}`}
                >
                  {character.character_image ? (
                    <Image
                      src={character.character_image}
                      alt={character.character_name}
                      width={300}
                      height={300}
                      className="w-full scale-[4.5] translate-y-[0%]"
                    />
                  ) : (
                    <UserRound
                      className={`h-5 w-5 ${isSelected ? "text-primary" : "text-base-content/40"}`}
                    />
                  )}
                </div>

                {/* 캐릭터 정보 */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : "text-base-content"}`}
                  >
                    {character.character_name}
                  </p>
                  <p className="text-xs text-base-content/50 mt-0.5">
                    {character.world_name} · {character.character_class} · Lv.
                    {character.character_level}
                  </p>
                </div>

                {/* 선택 체크 */}
                {isSelected && <CheckCircle className="h-5 w-5 shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSkip}
            disabled={isLoading}
            className="btn btn-ghost flex-1 rounded-xl gap-1.5 text-base-content/60"
          >
            <SkipForward className="h-4 w-4" />
            건너뛰기
          </button>
          <button
            type="button"
            onClick={() => selectedOcid && onSelect(selectedOcid)}
            disabled={!selectedOcid || isLoading}
            className="btn btn-primary flex-1 rounded-xl"
          >
            {isLoading ? <span className="loading loading-spinner loading-sm" /> : null}
            설정하기
          </button>
        </div>
    </BaseModal>
  );
}
