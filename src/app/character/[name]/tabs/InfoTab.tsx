"use client";

import { useState } from "react";

import {
  Activity,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

import BeautyTab from "./subtabs/BeautyTab";
import EquipmentTab from "./subtabs/EquipmentTab";
import SkillTab from "./subtabs/SkillTab";
import StatTab from "./subtabs/StatTab";
import type {
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

type InfoSubTab = "stat" | "equipment" | "beauty" | "skill";

const INFO_SUB_TABS: {
  id: InfoSubTab;
  label: string;
  icon: React.ComponentType<{ width?: number; height?: number; className?: string }>;
}[] = [
  { id: "stat", label: "스탯", icon: Activity },
  { id: "equipment", label: "장비", icon: Shield },
  { id: "beauty", label: "치장", icon: Sparkles },
  { id: "skill", label: "스킬", icon: Zap },
];

export default function InfoTab({
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
  potentialGradeMap,
}: {
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
  potentialGradeMap: Record<string, string>;
}) {
  const [activeSubTab, setActiveSubTab] = useState<InfoSubTab>("stat");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {INFO_SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              activeSubTab === tab.id
                ? "bg-base-content text-base-100"
                : "bg-base-200 text-base-content/60 hover:bg-base-300 hover:text-base-content/80"
            }`}
          >
            <tab.icon width={12} height={12} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === "stat" && (
        <StatTab
          combatPower={combatPower}
          statJson={statJson}
          hyperStatJson={hyperStatJson}
          abilityJson={abilityJson}
        />
      )}

      {activeSubTab === "equipment" && (
        <EquipmentTab
          equipmentJson={equipmentJson}
          setEffectJson={setEffectJson}
          petJson={petJson}
          symbolJson={symbolJson}
          skillJson={skillJson}
          potentialGradeMap={potentialGradeMap}
        />
      )}

      {activeSubTab === "beauty" && (
        <BeautyTab
          cashEquipmentJson={cashEquipmentJson}
          beautyEquipmentJson={beautyEquipmentJson}
          androidEquipmentJson={androidEquipmentJson}
        />
      )}

      {activeSubTab === "skill" && (
        <SkillTab
          skillJson={skillJson}
          linkSkillJson={linkSkillJson}
          vmatrixJson={vmatrixJson}
          hexamatrixJson={hexamatrixJson}
          hexaStatJson={hexaStatJson}
        />
      )}
    </div>
  );
}
