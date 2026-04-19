// src/components/ui/union/UnionArtifact.tsx

import Image from "next/image";

import { Lock } from "lucide-react";

import { UnionArtifactType } from "@/types/character";

const CRYSTAL_MAX_LEVEL = 5;
const CRYSTAL_MAX_SLOTS = 9;

const CRYSTAL_IMAGE_MAP: Record<string, string> = {
  주황버섯: "1_OrangeMushroom",
  슬라임: "2_Slime",
  뿔버섯: "3_HornyMushroom",
  스텀프: "4_Stump",
  스톤골렘: "5_StoneGolem",
  발록: "6_Balrog",
  자쿰: "7_Zakum",
  핑크빈: "8_PinkBean",
  파풀라투스: "9_ Papulatus",
};

const CRYSTAL_IMAGE_ORDER = Object.values(CRYSTAL_IMAGE_MAP);

const CRYSTAL_NAMES = [
  "주황버섯",
  "슬라임",
  "뿔버섯",
  "스텀프",
  "골렘",
  "발록",
  "자쿰",
  "핑크빈",
  "파푸라투스",
];

function EmptyCrystalCard({ slotIndex }: { slotIndex: number }) {
  const imgKey = CRYSTAL_IMAGE_ORDER[slotIndex];
  const imgSrc = imgKey ? `/Union/Artifact/${imgKey}_1_4.png` : null;

  return (
    <div className="rounded-lg border border-base-300 bg-base-content/[0.07] p-3 flex flex-col gap-2 opacity-40 min-h-44">
      <div className="flex flex-col items-center gap-1.5">
        <div style={{ height: "23px" }} />
        <div className="w-12 h-12 flex items-center justify-center relative">
          {imgSrc && (
            <Image
              src={imgSrc}
              alt="잠금"
              width={167}
              height={139}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-5 h-5 text-base-content/70" />
          </div>
        </div>
        <span className="text-xs font-semibold text-base-content text-center leading-tight">
          {CRYSTAL_NAMES[slotIndex] ? `크리스탈 : ${CRYSTAL_NAMES[slotIndex]}` : "\u00a0"}
        </span>
      </div>
    </div>
  );
}

function getCrystalImage(crystalName: string, level: number): string {
  const shortName = crystalName.replace("크리스탈 : ", "").trim();
  const key = CRYSTAL_IMAGE_MAP[shortName];
  if (!key) {
    return "";
  }
  const suffix = level >= CRYSTAL_MAX_LEVEL ? "5" : "1_4";
  return `/Union/Artifact/${key}_${suffix}.png`;
}

function CrystalCard({ crystal }: { crystal: import("@/types/character").UnionArtifactCrystal }) {
  const isExpired = crystal.validity_flag === "1";
  const expire = crystal.date_expire
    ? new Date(crystal.date_expire).toLocaleDateString("ko-KR", {
        month: "numeric",
        day: "numeric",
      })
    : null;
  const imgSrc = getCrystalImage(crystal.name, crystal.level);
  const shortName = crystal.name;
  const options = [
    crystal.crystal_option_name_1,
    crystal.crystal_option_name_2,
    crystal.crystal_option_name_3,
  ].filter(Boolean);

  return (
    <div
      className={`rounded-lg border border-base-300 bg-base-content/[0.07] p-3 flex flex-col gap-2 ${
        isExpired ? "opacity-40" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-1.5">
        <Image
          src={`/Union/Artifact/Artifact_${isExpired ? "Disable" : "Enable"}_${crystal.level}.png`}
          alt={`Lv.${crystal.level}`}
          width={95}
          height={23}
          style={{ height: "23px", width: "auto" }}
        />
        {imgSrc && (
          <div className="w-12 h-12 flex items-center justify-center">
            <Image
              src={imgSrc}
              alt={shortName}
              width={167}
              height={139}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}
        <span className="text-xs font-semibold text-base-content text-center leading-tight">
          {shortName}
        </span>
        {expire && <span className="text-[10px] text-base-content/40">{expire} 만료</span>}
      </div>
      {options.length > 0 && (
        <ul className="flex flex-col gap-0.5 border-t border-base-300 pt-2 mt-0.5">
          {options.map((opt, i) => (
            <li key={i} className="text-[11px] text-base-content/60 leading-tight">
              · {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function UnionArtifact({ artifactJson }: { artifactJson: UnionArtifactType | null }) {
  if (
    !artifactJson ||
    (artifactJson.union_artifact_effect.length === 0 &&
      artifactJson.union_artifact_crystal.length === 0)
  ) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-200/30 p-6 text-center text-sm text-base-content/40">
        유니온 아티펙트 데이터가 없어요
      </div>
    );
  }

  const { union_artifact_effect, union_artifact_crystal, union_artifact_remain_ap } = artifactJson;

  return (
    <div className="flex flex-col gap-4">
      {union_artifact_crystal.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-base-content/70">크리스탈</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {union_artifact_crystal.map((crystal, i) => (
              <CrystalCard key={i} crystal={crystal} />
            ))}
            {Array.from({ length: CRYSTAL_MAX_SLOTS - union_artifact_crystal.length }, (_, i) => (
              <EmptyCrystalCard key={`empty-${i}`} slotIndex={union_artifact_crystal.length + i} />
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-base-content/70">효과</p>
          <span className="text-xs text-base-content/40">잔여 AP {union_artifact_remain_ap}</span>
        </div>
        <div className="rounded-xl border border-base-300 bg-base-200/30">
          {union_artifact_effect.length > 0 ? (
            union_artifact_effect.map((effect, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-1.5">
                <span className="text-xs font-bold text-base-content/50">{effect.name}</span>
                <span className="text-[11px] font-sans text-base-content">Lv.{effect.level}</span>
              </div>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-base-content/40 text-center">
              적용 받고 있는 효과가 없어요
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
