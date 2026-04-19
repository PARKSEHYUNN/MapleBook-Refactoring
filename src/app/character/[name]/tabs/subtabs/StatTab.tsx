"use client";

import { useState } from "react";

import { Bookmark } from "lucide-react";

import Tooltip from "@/components/ui/Tooltip";
import { formatCombatPower } from "@/lib/formatters";
import type { AbilityJsonType, HyperStatJsonType, StatJsonType } from "@/types/character";

const STAT_ROWS: { label: string; key: string }[][] = [
  [
    { label: "HP", key: "HP" },
    { label: "MP", key: "MP" },
  ],
  [
    { label: "STR", key: "STR" },
    { label: "DEX", key: "DEX" },
  ],
  [
    { label: "INT", key: "INT" },
    { label: "LUK", key: "LUK" },
  ],
];

type FormatType = "number" | "korean_number" | "percent_int" | "percent_decimal" | "cooldown";

interface CombatStatDef {
  label: string;
  key: string;
  format: FormatType;
  key2?: string;
}

const COMBAT_ROWS: CombatStatDef[][] = [
  [
    { label: "스탯 공격력", key: "최대 스탯공격력", format: "korean_number" },
    { label: "데미지", key: "데미지", format: "percent_decimal" },
  ],
  [
    { label: "최종 데미지", key: "최종 데미지", format: "percent_decimal" },
    { label: "보스 몬스터 데미지", key: "보스 몬스터 데미지", format: "percent_decimal" },
  ],
  [
    { label: "방어율 무시", key: "방어율 무시", format: "percent_decimal" },
    { label: "일반 몬스터 데미지", key: "일반 몬스터 데미지", format: "percent_decimal" },
  ],
  [
    { label: "공격력", key: "공격력", format: "number" },
    { label: "크리티컬 확률", key: "크리티컬 확률", format: "percent_int" },
  ],
  [
    { label: "마력", key: "마력", format: "number" },
    { label: "크리티컬 데미지", key: "크리티컬 데미지", format: "percent_decimal" },
  ],
  [
    {
      label: "재사용 대기시간 감소",
      key: "재사용 대기시간 감소 (초)",
      format: "cooldown",
      key2: "재사용 대기시간 감소 (%)",
    },
    { label: "버프 지속시간", key: "버프 지속시간", format: "percent_int" },
  ],
  [
    { label: "재사용 대기시간 미적용", key: "재사용 대기시간 미적용", format: "percent_decimal" },
    { label: "속성 내성 무시", key: "속성 내성 무시", format: "percent_decimal" },
  ],
  [
    { label: "상태이상 추가 데미지", key: "상태이상 추가 데미지", format: "percent_decimal" },
    { label: "소환수 지속시간 증가", key: "소환수 지속시간 증가", format: "percent_int" },
  ],
];

const EXTRA_PAGES: CombatStatDef[][][] = [
  [
    [
      { label: "메소 획득량", key: "메소 획득량", format: "percent_int" },
      { label: "스타포스", key: "스타포스", format: "number" },
    ],
    [
      { label: "아이템 드롭률", key: "아이템 드롭률", format: "percent_int" },
      { label: "아케인포스", key: "아케인포스", format: "number" },
    ],
    [
      { label: "추가 경험치 획득", key: "추가 경험치 획득", format: "percent_decimal" },
      { label: "어센틱포스", key: "어센틱포스", format: "number" },
    ],
  ],
  [
    [
      { label: "방어력", key: "방어력", format: "number" },
      { label: "상태이상 내성", key: "상태이상 내성", format: "number" },
    ],
    [
      { label: "이동속도", key: "이동속도", format: "percent_int" },
      { label: "점프력", key: "점프력", format: "percent_int" },
    ],
    [
      { label: "스탠스", key: "스탠스", format: "percent_int" },
      { label: "공격속도", key: "공격 속도", format: "number" },
    ],
  ],
];

interface StatTabProps {
  combatPower: number | null;
  statJson: StatJsonType | null;
  hyperStatJson: HyperStatJsonType | null;
  abilityJson: AbilityJsonType | null;
}

export default function StatTab({ combatPower, statJson, hyperStatJson, abilityJson }: StatTabProps) {
  const [extraPage, setExtraPage] = useState(0);
  const [hyperPreset, setHyperPreset] = useState<1 | 2 | 3>(
    (Number(hyperStatJson?.use_preset_no) as 1 | 2 | 3) || 1,
  );
  const [abilityPreset, setAbilityPreset] = useState<1 | 2 | 3>(
    (Number(abilityJson?.preset_no) as 1 | 2 | 3) || 1,
  );

  function getRaw(key: string): string | undefined {
    return statJson?.final_stat.find((s) => s.stat_name === key)?.stat_value;
  }

  function getStat(key: string): string {
    const raw = getRaw(key);
    if (!raw) return "-";
    const num = Number(raw.replace(/,/g, ""));
    return isNaN(num) ? raw : num.toLocaleString();
  }

  function formatCombatStat(def: CombatStatDef): string {
    const raw = getRaw(def.key);
    if (def.format === "cooldown") {
      const sec = raw !== undefined ? `${raw}초` : null;
      const pct = def.key2 ? getRaw(def.key2) : undefined;
      const pctStr = pct !== undefined ? `${parseInt(pct)}%` : null;
      const parts = [sec, pctStr].filter(Boolean);
      return parts.length > 0 ? parts.join(" / ") : "-";
    }
    if (!raw) return "-";
    if (def.format === "korean_number") {
      const n = Number(raw.replace(/,/g, ""));
      return isNaN(n) ? raw : formatCombatPower(n);
    }
    if (def.format === "number") {
      const n = Number(raw.replace(/,/g, ""));
      return isNaN(n) ? raw : n.toLocaleString();
    }
    if (def.format === "percent_int") return `${parseInt(raw)}%`;
    if (def.format === "percent_decimal") return `${parseFloat(raw).toFixed(2)}%`;
    return raw;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center rounded-xl border border-base-300 bg-base-200/30 px-4 py-3">
        <span className="text-xs font-bold text-base-content/50 shrink-0">전투력</span>
        <span className="flex-1 text-center font-sans text-lg text-base-content">
          {combatPower ? formatCombatPower(combatPower) : "-"}
        </span>
      </div>
      <div className="rounded-xl border border-base-300 bg-base-200/30">
        {STAT_ROWS.map((row, i) => (
          <div key={i} className="grid grid-cols-2">
            {row.map(({ label, key }) => (
              <div key={key} className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-bold text-base-content/50">{label}</span>
                <span className="font-sans text-[11px] text-base-content">{getStat(key)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-base-300 bg-base-200/30">
        {COMBAT_ROWS.map((row, i) => (
          <div key={i} className="grid grid-cols-2">
            {row.map((def) => (
              <div key={def.key} className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-bold text-base-content/50">{def.label}</span>
                <span className="font-sans text-[11px] text-base-content">
                  {formatCombatStat(def)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        className="rounded-xl border border-base-300 bg-base-200/30 select-none"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          (e.currentTarget as HTMLDivElement).dataset.touchX = String(touch.clientX);
        }}
        onTouchEnd={(e) => {
          const startX = Number((e.currentTarget as HTMLDivElement).dataset.touchX);
          const endX = e.changedTouches[0].clientX;
          const delta = endX - startX;
          if (Math.abs(delta) < 30) return;
          setExtraPage((p) =>
            delta < 0
              ? (p + 1) % EXTRA_PAGES.length
              : (p - 1 + EXTRA_PAGES.length) % EXTRA_PAGES.length,
          );
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLDivElement).dataset.mouseX = String(e.clientX);
        }}
        onMouseUp={(e) => {
          const startX = Number((e.currentTarget as HTMLDivElement).dataset.mouseX);
          const delta = e.clientX - startX;
          if (Math.abs(delta) < 30) return;
          setExtraPage((p) =>
            delta < 0
              ? (p + 1) % EXTRA_PAGES.length
              : (p - 1 + EXTRA_PAGES.length) % EXTRA_PAGES.length,
          );
        }}
        onWheel={(e) => {
          e.preventDefault();
          setExtraPage((p) =>
            e.deltaY > 0
              ? (p + 1) % EXTRA_PAGES.length
              : (p - 1 + EXTRA_PAGES.length) % EXTRA_PAGES.length,
          );
        }}
      >
        {EXTRA_PAGES[extraPage].map((row, i) => (
          <div key={i} className="grid grid-cols-2">
            {row.map((def) => (
              <div key={def.key} className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-bold text-base-content/50">{def.label}</span>
                <span className="font-sans text-[11px] text-base-content">
                  {formatCombatStat(def)}
                </span>
              </div>
            ))}
          </div>
        ))}
        <div className="flex justify-center py-2">
          {EXTRA_PAGES.map((_, i) => (
            <button key={i} type="button" onClick={() => setExtraPage(i)} className="px-1 py-1.5">
              <span
                className={`block w-1.5 h-1.5 rounded-full transition-colors ${
                  extraPage === i ? "bg-base-content/60" : "bg-base-content/20"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex flex-col rounded-xl border border-base-300 bg-base-200/30">
          <p className="px-3 pt-3 pb-1 text-sm font-bold text-base-content/40">HYPER STAT</p>
          <div className="flex-grow">
            {(() => {
              const presetKey = `hyper_stat_preset_${hyperPreset}` as
                | "hyper_stat_preset_1"
                | "hyper_stat_preset_2"
                | "hyper_stat_preset_3";
              const preset = hyperStatJson?.[presetKey]?.filter((s) => s.stat_level > 0) ?? [];
              if (preset.length === 0) {
                return (
                  <p className="py-4 text-center text-xs text-base-content/30">
                    하이퍼 스탯 없음
                  </p>
                );
              }
              return preset.map((s) => (
                <Tooltip
                  key={s.stat_type}
                  wrapperClassName="flex w-full"
                  content={
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-base-content">{s.stat_type}</span>
                      {s.stat_increase ? (
                        <span className="text-base-content/70">{s.stat_increase}</span>
                      ) : (
                        <span className="text-base-content/30">증가량 없음</span>
                      )}
                    </div>
                  }
                >
                  <div className="flex w-full items-center justify-between px-3 py-2 cursor-default">
                    <span className="text-xs text-base-content/60 font-bold">{s.stat_type}</span>
                    <span className="flex items-center text-xs text-base-content">
                      <span>Lv.</span>
                      <span className="w-5 text-right tabular-nums">{s.stat_level}</span>
                    </span>
                  </div>
                </Tooltip>
              ));
            })()}
          </div>
          <div className="mx-3 mb-3 mt-1 flex items-center justify-between rounded-full border border-base-300 bg-base-200/50 px-3 h-8">
            <span className="text-[10px] font-bold tracking-widest text-base-content/40">
              PRESETS
            </span>
            <div className="flex gap-1">
              {([1, 2, 3] as const).map((n) => {
                const isDefault = n === Number(hyperStatJson?.use_preset_no);
                const isViewing = n === hyperPreset;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setHyperPreset(n)}
                    className={[
                      "w-5 h-5 rounded-md text-[10px] font-bold transition-colors",
                      isDefault
                        ? "bg-base-content/70 text-base-100"
                        : "text-base-content/40 hover:text-base-content/60",
                      isViewing ? "ring-2 ring-base-content/50 ring-offset-1 ring-offset-base-200" : "",
                    ].join(" ")}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col rounded-xl border border-base-300 bg-base-200/30">
          <p className="px-3 pt-3 pb-1 text-sm font-bold text-base-content/40">ABILITY</p>
          <div className="flex-grow mx-3 mt-1 flex flex-col gap-1">
            {(() => {
              const gradeColorMap: Record<string, string> = {
                레전드리: "bg-green-500",
                유니크: "bg-yellow-500",
                에픽: "bg-purple-500",
                레어: "bg-blue-400",
              };
              const presetKey = `ability_preset_${abilityPreset}` as
                | "ability_preset_1"
                | "ability_preset_2"
                | "ability_preset_3";
              const preset = abilityJson?.[presetKey];
              const grade = preset?.ability_preset_grade ?? null;
              const bgColor = grade ? (gradeColorMap[grade] ?? "bg-base-200/50") : "bg-base-200/50";
              const options = preset?.ability_info ?? [];
              return (
                <>
                  <div className={`flex items-center gap-2 rounded-md px-3 h-9 ${bgColor}`}>
                    <Bookmark className="w-3 h-3 shrink-0 text-white/70" fill="currentColor" />
                    <span className="text-sm text-white/90">{grade ?? "-"} 어빌리티</span>
                  </div>
                  {options.map((opt) => {
                    const optBg = gradeColorMap[opt.ability_grade] ?? "bg-base-200/50";
                    return (
                      <div
                        key={opt.ability_no}
                        className={`flex items-center gap-2 rounded-md px-3 h-6 justify-center ${optBg}`}
                      >
                        <span className="text-xs text-white/90">{opt.ability_value}</span>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
          <div className="mx-3 mb-3 mt-1 flex items-center justify-between rounded-full border border-base-300 bg-base-200/50 px-3 h-8">
            <span className="text-[10px] font-bold tracking-widest text-base-content/40">
              PRESETS
            </span>
            <div className="flex gap-1">
              {([1, 2, 3] as const).map((n) => {
                const isDefault = n === Number(abilityJson?.preset_no);
                const isViewing = n === abilityPreset;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAbilityPreset(n)}
                    className={[
                      "w-5 h-5 rounded-md text-[10px] font-bold transition-colors",
                      isDefault
                        ? "bg-base-content/70 text-base-100"
                        : "text-base-content/40 hover:text-base-content/60",
                      isViewing ? "ring-2 ring-base-content/50 ring-offset-1 ring-offset-base-200" : "",
                    ].join(" ")}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
