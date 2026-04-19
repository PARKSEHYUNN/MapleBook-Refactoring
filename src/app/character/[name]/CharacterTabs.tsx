"use client";

import { useState } from "react";

import MainCharacterModal from "@/components/auth/MainCharacterModal";
import { CharacterList, CharacterUnion, UnionArtifactType, UnionChampionType, UnionRaiderType } from "@/types/character";
import { UnionChip } from "@/components/ui/UnionChip";
import {
  AbilityJsonType,
  AndroidEquipmentJsonType,
  BeautyEquipmentJsonType,
  CashEquipmentJsonType,
  HexaMatrixJsonType,
  HexaStatJsonType,
  HyperStatJsonType,
  ItemEquipmentJsonType,
  LinkSkillJsonType,
  PetJsonType,
  SetEffectJsonType,
  SkillJsonType,
  StatJsonType,
  SymbolJsonType,
  VMatrixJsonType,
} from "@/types/character";

import { HistoryChip } from "@/components/ui/HistoryChip";

import InfoTab from "./tabs/InfoTab";
import ReviewsTab, { ReviewItem } from "./tabs/ReviewsTab";

type Tab = "reviews" | "info" | "union" | "history";

const TABS: { id: Tab; label: string }[] = [
  { id: "reviews", label: "평가" },
  { id: "info", label: "캐릭터 정보" },
  { id: "union", label: "유니온" },
  { id: "history", label: "성장 기록" },
];

interface Props {
  isOwner: boolean;
  isLoggedIn: boolean;
  hasMainCharacter: boolean;
  currentUserId: number | null;
  characterName: string;
  initialReviews: ReviewItem[];
  combatPower: number | null;
  statJson: StatJsonType | null;
  hyperStatJson: HyperStatJsonType | null;
  abilityJson: AbilityJsonType | null;
  equipmentJson: ItemEquipmentJsonType | null;
  setEffectJson: SetEffectJsonType | null;
  petJson: PetJsonType | null;
  symbolJson: SymbolJsonType | null;
  cashEquipmentJson: CashEquipmentJsonType | null;
  beautyEquipmentJson: BeautyEquipmentJsonType | null;
  androidEquipmentJson: AndroidEquipmentJsonType | null;
  skillJson: SkillJsonType | null;
  linkSkillJson: LinkSkillJsonType | null;
  vmatrixJson: VMatrixJsonType | null;
  hexamatrixJson: HexaMatrixJsonType | null;
  hexaStatJson: HexaStatJsonType | null;
  unionJson: CharacterUnion | null;
  unionLevel: number | null;
  unionGrade: string | null;
  unionRaiderJson: UnionRaiderType | null;
  unionArtifactJson: UnionArtifactType | null;
  unionChampionJson: UnionChampionType | null;
  potentialGradeMap: Record<string, string>;
}

export default function CharacterTabs({
  isOwner,
  isLoggedIn,
  hasMainCharacter,
  currentUserId,
  characterName,
  initialReviews,
  combatPower,
  statJson,
  hyperStatJson,
  abilityJson,
  equipmentJson,
  setEffectJson,
  petJson,
  symbolJson,
  cashEquipmentJson,
  beautyEquipmentJson,
  androidEquipmentJson,
  skillJson,
  linkSkillJson,
  vmatrixJson,
  hexamatrixJson,
  hexaStatJson,
  unionJson,
  unionLevel,
  unionGrade,
  unionRaiderJson,
  unionArtifactJson,
  unionChampionJson,
  potentialGradeMap,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("reviews");
  const [localHasMainCharacter, setLocalHasMainCharacter] = useState(hasMainCharacter);
  const [showMainCharacterModal, setShowMainCharacterModal] = useState(false);
  const [characterList, setCharacterList] = useState<CharacterList[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(false);

  async function openMainCharacterModal() {
    setIsLoadingCharacters(true);
    setShowMainCharacterModal(true);
    const res = await fetch("/api/me/characterList");
    const json = (await res.json()) as { data: CharacterList[] };
    setCharacterList((json.data ?? []).sort((a, b) => b.character_level - a.character_level));
    setIsLoadingCharacters(false);
  }

  async function handleMainCharacterSelect(ocid: string) {
    setIsLoadingCharacters(true);
    const res = await fetch("/api/me/main-character", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ocid }),
    });
    setIsLoadingCharacters(false);
    if (res.ok) {
      setLocalHasMainCharacter(true);
      setShowMainCharacterModal(false);
    }
  }

  async function handleMainCharacterRefresh() {
    setIsLoadingCharacters(true);
    const res = await fetch("/api/me/characterList");
    const json = (await res.json()) as { data: CharacterList[] };
    setCharacterList((json.data ?? []).sort((a, b) => b.character_level - a.character_level));
    setIsLoadingCharacters(false);
  }

  return (
    <div className="mt-2 rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
      <div className="flex border-b border-base-300 px-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-base-content/50 hover:text-base-content/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 flex flex-col gap-3">
        {activeTab === "reviews" && (
          <ReviewsTab
            isOwner={isOwner}
            isLoggedIn={isLoggedIn}
            hasMainCharacter={localHasMainCharacter}
            currentUserId={currentUserId}
            characterName={characterName}
            initialReviews={initialReviews}
            onOpenMainCharacterModal={openMainCharacterModal}
          />
        )}
        {activeTab === "info" && (
          <InfoTab
            combatPower={combatPower}
            statJson={statJson}
            hyperStatJson={hyperStatJson}
            abilityJson={abilityJson}
            equipmentJson={equipmentJson}
            setEffectJson={setEffectJson}
            petJson={petJson}
            symbolJson={symbolJson}
            cashEquipmentJson={cashEquipmentJson}
            beautyEquipmentJson={beautyEquipmentJson}
            androidEquipmentJson={androidEquipmentJson}
            skillJson={skillJson}
            linkSkillJson={linkSkillJson}
            vmatrixJson={vmatrixJson}
            hexamatrixJson={hexamatrixJson}
            hexaStatJson={hexaStatJson}
            potentialGradeMap={potentialGradeMap}
          />
        )}
        {activeTab === "union" && (
          <UnionChip character={{ union_level: unionLevel, union_grade: unionGrade, union_json: unionJson, union_raider: unionRaiderJson, union_artifact: unionArtifactJson, union_champion: unionChampionJson }} />
        )}
        {activeTab === "history" && (
          <HistoryChip characterName={characterName} />
        )}
      </div>

      {showMainCharacterModal && (
        <MainCharacterModal
          characters={characterList}
          onSelect={handleMainCharacterSelect}
          onSkip={() => setShowMainCharacterModal(false)}
          onRefresh={handleMainCharacterRefresh}
          isLoading={isLoadingCharacters}
        />
      )}
    </div>
  );
}
