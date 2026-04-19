"use client";

import { useState } from "react";
import Image from "next/image";

import { PawPrint, Shield, Star, Sword } from "lucide-react";

import CashItemTooltipContent from "@/components/ui/CashItemTooltipContent";
import ItemTooltipContent from "@/components/ui/ItemTooltipContent";
import Tooltip from "@/components/ui/Tooltip";
import type {
  ItemEquipmentJsonType,
  PetJsonType,
  SetEffectJsonType,
  SkillInfo,
  SkillJsonType,
  SymbolEquipment,
  SymbolJsonType,
} from "@/types/character";

function SymbolTooltipContent({ symbol: s }: { symbol: SymbolEquipment }) {
  const statRows = [
    { label: "STR", value: s.symbol_str },
    { label: "DEX", value: s.symbol_dex },
    { label: "INT", value: s.symbol_int },
    { label: "LUK", value: s.symbol_luk },
    { label: "최대HP", value: s.symbol_hp },
  ].filter(({ value }) => parseInt(value ?? "0", 10) > 0);

  const rateRows = [
    { label: "아이템 드롭률", value: s.symbol_drop_rate, suffix: "%" },
    { label: "메소 획득량", value: s.symbol_meso_rate, suffix: "%" },
    { label: "경험치 획득", value: s.symbol_exp_rate, suffix: "%" },
  ].filter(({ value }) => parseInt(value ?? "0", 10) > 0);

  const symbolBadge = s.symbol_name.includes("그랜드")
    ? "그랜드 어센틱심볼"
    : s.symbol_name.includes("어센틱심볼")
      ? "어센틱심볼"
      : "아케인심볼";

  const requiredLevel = s.symbol_name.includes("그랜드")
    ? 270
    : s.symbol_name.includes("어센틱심볼")
      ? 260
      : 200;

  const maxLevel = symbolBadge === "아케인심볼" ? 20 : 11;
  const isMax = s.symbol_level >= maxLevel;

  return (
    <div
      className="w-72 rounded-xl px-4 py-3 font-galmuri font-thin"
      style={{ background: "rgba(37, 44, 52, 0.85)" }}
    >
      <p className="text-center text-[14px] font-normal text-white">{s.symbol_name}</p>
      <p className="text-center text-[10px] font-normal" style={{ color: "rgb(255, 138, 24)" }}>
        교환 불가
      </p>
      <hr className="my-2 border-white/20" />
      <div className="flex items-start justify-between">
        <div
          className="relative w-16 h-16 rounded flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(to bottom, #3d5c70, #c8d4dc)" }}
        >
          <Image
            src={s.symbol_icon}
            alt={s.symbol_name}
            width={48}
            height={48}
            className="w-12 h-12 object-contain pixelated"
            unoptimized
          />
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <p className="text-[10px] font-galmuri text-white/70">전투력 증가량</p>
          <p className="text-xl font-sans text-white/50 font-bold">현재 장착 중인 장비</p>
          <div className="flex gap-1 mt-1">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-galmuri text-white/60"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              {symbolBadge}
            </span>
          </div>
        </div>
      </div>
      <p className="text-[10px] font-galmuri text-white/50 mt-2 whitespace-nowrap">
        착용 직업
        <span className="inline-block w-8" />
        <span className="text-white">공용</span>
      </p>
      <p className="text-[10px] font-galmuri text-white/50 mt-1 whitespace-nowrap">
        요구 레벨
        <span className="inline-block w-8" />
        <span className="text-white">Lv. {requiredLevel}</span>
      </p>
      <hr className="my-2 border-white/20" />
      <p className="text-[10px] font-galmuri text-white/50 whitespace-nowrap">
        성장 레벨
        <span className="inline-block w-8" />
        Lv : {s.symbol_level}
        <span className="inline-block w-3" />
        {isMax ? (
          <>EXP : MAX</>
        ) : (
          <>
            EXP : {s.symbol_growth_count} / {s.symbol_require_growth_count} ({" "}
            {s.symbol_require_growth_count > 0
              ? Math.floor((s.symbol_growth_count / s.symbol_require_growth_count) * 100)
              : 0}
            % )
          </>
        )}
      </p>
      <p className="text-[10px] font-galmuri text-white mt-2 whitespace-nowrap">
        {symbolBadge === "아케인심볼" ? "ARC" : "AUT"}
        <span className="inline-block w-3" />+{s.symbol_force}
      </p>
      {statRows.map(({ label, value }) => (
        <p key={label} className="text-[10px] font-galmuri text-white mt-1 whitespace-nowrap">
          {label}
          <span className="inline-block w-3" />+{value}
        </p>
      ))}
      {rateRows.map(({ label, value }) => (
        <p key={label} className="text-[10px] font-galmuri text-white mt-1 whitespace-nowrap">
          {label}
          <span className="inline-block w-3" />+{value}
        </p>
      ))}
      {s.symbol_other_effect_description &&
        (() => {
          const colonIdx = s.symbol_other_effect_description!.indexOf(":");
          const before =
            colonIdx >= 0
              ? s.symbol_other_effect_description!.slice(0, colonIdx + 1)
              : s.symbol_other_effect_description!;
          const after = colonIdx >= 0 ? s.symbol_other_effect_description!.slice(colonIdx + 1) : "";
          return (
            <p className="text-[10px] font-galmuri mt-1 whitespace-normal wrap-break-word">
              <span className="text-white/50">{before}</span>
              {after && <span className="text-white">{after}</span>}
            </p>
          );
        })()}
      {s.symbol_description && (
        <p className="text-[10px] font-galmuri text-white mt-1 whitespace-pre-wrap leading-relaxed">
          {s.symbol_description}
        </p>
      )}
    </div>
  );
}

function renderSkillTooltipContent(s: SkillInfo) {
  const masterMatch = s.skill_description.match(/\[마스터 레벨 : (\d+)\]/);
  const masterLevel = masterMatch
    ? `[마스터 레벨 : ${masterMatch[1]}]`
    : `[마스터 레벨 : ${s.skill_level}]`;
  const desc = s.skill_description.replace(/\[마스터 레벨 : \d+\]\n?/, "").trim();
  return (
    <div
      className="rounded-xl px-4 py-3 font-galmuri font-thin w-72"
      style={{ background: "rgba(37, 44, 52, 0.85)" }}
    >
      <p className="text-center text-[14px] font-normal text-white px-2">{s.skill_name}</p>
      <div className="flex items-start gap-2 mt-1.5">
        <Image
          src={s.skill_icon}
          alt=""
          width={36}
          height={36}
          className="w-9 h-9 object-contain pixelated shrink-0"
          unoptimized
        />
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] text-white/50">{masterLevel}</p>
          {desc && (
            <p className="text-[10px] text-white/60 whitespace-pre-wrap leading-relaxed">{desc}</p>
          )}
        </div>
      </div>
      <hr className="mt-2 border-white/20" />
      {s.skill_effect && (
        <div className="mt-2 flex flex-col gap-0.5">
          <p className="text-[10px] text-white/50">[현재레벨 {s.skill_level}]</p>
          <p className="text-[10px] text-white/60 whitespace-pre-wrap leading-relaxed">
            {s.skill_effect}
          </p>
          {s.skill_effect_next && (
            <>
              <p className="text-[10px] text-white/50 mt-1">[다음레벨 {s.skill_level + 1}]</p>
              <p className="text-[10px] text-white/60 whitespace-pre-wrap leading-relaxed">
                {s.skill_effect_next}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const POSITIONED_SLOTS: { slot: string; row: number; col: number }[] = [
  { slot: "반지4", row: 1, col: 1 },
  { slot: "얼굴장식", row: 1, col: 2 },
  { slot: "모자", row: 1, col: 6 },
  { slot: "망토", row: 1, col: 7 },
  { slot: "반지3", row: 2, col: 1 },
  { slot: "눈장식", row: 2, col: 2 },
  { slot: "상의", row: 2, col: 6 },
  { slot: "장갑", row: 2, col: 7 },
  { slot: "반지2", row: 3, col: 1 },
  { slot: "귀고리", row: 3, col: 2 },
  { slot: "하의", row: 3, col: 6 },
  { slot: "신발", row: 3, col: 7 },
  { slot: "반지1", row: 4, col: 1 },
  { slot: "펜던트2", row: 4, col: 2 },
  { slot: "어깨장식", row: 4, col: 6 },
  { slot: "훈장", row: 4, col: 7 },
  { slot: "벨트", row: 5, col: 1 },
  { slot: "펜던트", row: 5, col: 2 },
  { slot: "무기", row: 5, col: 3 },
  { slot: "보조무기", row: 5, col: 4 },
  { slot: "엠블렘", row: 5, col: 5 },
  { slot: "안드로이드", row: 5, col: 6 },
  { slot: "기계 심장", row: 5, col: 7 },
  { slot: "포켓 아이템", row: 6, col: 1 },
  { slot: "뱃지", row: 6, col: 7 },
];

interface EquipmentTabProps {
  equipmentJson: ItemEquipmentJsonType | null;
  setEffectJson: SetEffectJsonType | null;
  petJson: PetJsonType | null;
  symbolJson: SymbolJsonType | null;
  skillJson: SkillJsonType | null;
  potentialGradeMap: Record<string, string>;
}

export default function EquipmentTab({
  equipmentJson,
  setEffectJson,
  petJson,
  symbolJson,
  skillJson,
  potentialGradeMap,
}: EquipmentTabProps) {
  const [equipmentTab, setEquipmentTab] = useState<"equipped" | "pet">("equipped");
  const [equipmentPreset, setEquipmentPreset] = useState<1 | 2 | 3>(
    (Number(equipmentJson?.preset_no) as 1 | 2 | 3) || 1,
  );

  const allSkillMap = new Map<string, SkillInfo>(
    (skillJson ?? []).flatMap((g) => g.character_skill).map((s) => [s.skill_name, s]),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {(
          [
            { id: "equipped", label: "장착 장비", icon: Sword },
            { id: "pet", label: "펫 장비", icon: PawPrint },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setEquipmentTab(id)}
            className={[
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
              equipmentTab === id
                ? "border-base-content/30 bg-base-content/10 text-base-content"
                : "border-base-300 bg-base-200/30 text-base-content/50 hover:bg-base-200/60",
            ].join(" ")}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex flex-col rounded-xl border border-base-300 bg-base-200/30 sm:flex-2 sm:min-w-0">
          {equipmentTab === "equipped" && (
            <>
              <div className="px-3 pt-3 pb-1 flex items-center justify-between">
                <p className="text-sm font-bold text-base-content/40">EQUIPMENT</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold tracking-widest text-base-content/40">
                    PRESETS
                  </span>
                  <div className="flex gap-1">
                    {([1, 2, 3] as const).map((n) => {
                      const isDefault = n === Number(equipmentJson?.preset_no);
                      const isViewing = n === equipmentPreset;
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setEquipmentPreset(n)}
                          className={[
                            "w-5 h-5 rounded-md text-[10px] font-bold transition-colors",
                            isDefault
                              ? "bg-base-content/70 text-base-100"
                              : "text-base-content/40 hover:text-base-content/60",
                            isViewing
                              ? "ring-2 ring-base-content/50 ring-offset-1 ring-offset-base-200"
                              : "",
                          ].join(" ")}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {(() => {
                const presetKey = `item_equipment_preset_${equipmentPreset}` as
                  | "item_equipment_preset_1"
                  | "item_equipment_preset_2"
                  | "item_equipment_preset_3";
                const slotMap = new Map(
                  (equipmentJson?.[presetKey] ?? []).map((item) => [
                    item.item_equipment_slot,
                    item,
                  ]),
                );
                const GAP = "4px";
                const activeSets = (setEffectJson?.set_effect ?? []).filter(
                  (s) => s.total_set_count > 0,
                );
                return (
                  <div
                    className="p-2"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: GAP,
                    }}
                  >
                    <div
                      className="rounded-lg border border-base-content/10 bg-base-200/40 flex flex-col overflow-hidden"
                      style={{ gridColumn: "3 / 6", gridRow: "1 / 5" }}
                    >
                      <p className="px-2 pt-1.5 pb-1 text-[9px] font-bold text-base-content/30 shrink-0">
                        SET
                      </p>
                      <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-1.5 pb-1.5">
                        {activeSets.length === 0 ? (
                          <p className="text-[9px] text-base-content/20 text-center pt-2">없음</p>
                        ) : (
                          activeSets.map((s) => {
                            const maxSetCount =
                              s.set_option_full.length > 0
                                ? Math.max(...s.set_option_full.map((e) => e.set_count))
                                : s.total_set_count;
                            return (
                              <Tooltip
                                key={s.set_name}
                                wrapperClassName="block"
                                className="border-none! shadow-xl! w-70! bg-[rgba(37,44,52,0.85)]!"
                                content={
                                  <div
                                    className="flex flex-col gap-1"
                                    style={{ background: "transparent" }}
                                  >
                                    <span className="font-bold text-white text-xs">
                                      {s.set_name}
                                    </span>
                                    {s.set_option_full.map((e) => {
                                      const isActive = e.set_count <= s.total_set_count;
                                      return (
                                        <p
                                          key={e.set_count}
                                          className="font-galmuri text-[10px] leading-snug"
                                          style={{
                                            color: isActive
                                              ? "rgba(255,255,255,0.7)"
                                              : "rgba(255,255,255,0.25)",
                                          }}
                                        >
                                          <span
                                            style={{
                                              color: isActive
                                                ? "rgb(255, 200, 80)"
                                                : "rgba(255,200,80,0.3)",
                                            }}
                                          >
                                            [{e.set_count}세트]
                                          </span>{" "}
                                          {e.set_option}
                                        </p>
                                      );
                                    })}
                                  </div>
                                }
                              >
                                <div className="flex items-center justify-between gap-1 cursor-default px-0.5 py-0.5 rounded hover:bg-base-content/5">
                                  <span className="font-galmuri text-[8px] text-base-content/70 truncate leading-none">
                                    {s.set_name}
                                  </span>
                                  <span className="font-galmuri text-[8px] text-base-content shrink-0 leading-none">
                                    {s.total_set_count}/{maxSetCount}
                                  </span>
                                </div>
                              </Tooltip>
                            );
                          })
                        )}
                      </div>
                    </div>
                    {POSITIONED_SLOTS.map(({ slot, row, col }) => {
                      const item = slotMap.get(slot);
                      const gradeBorder =
                        item?.potential_option_grade === "레전드리"
                          ? "border-[#ccff00]"
                          : item?.potential_option_grade === "유니크"
                            ? "border-[#ffcc00]"
                            : item?.potential_option_grade === "에픽"
                              ? "border-[#bb77ff]"
                              : item?.potential_option_grade === "레어"
                                ? "border-[#66ffff]"
                                : "border-base-content/10";
                      const starforce = item ? parseInt(item.starforce, 10) : 0;
                      const slotCell = (
                        <div
                          className={`relative aspect-square rounded-lg border bg-base-100/60 flex items-center justify-center shadow-inner ${gradeBorder}`}
                        >
                          {item && (
                            <>
                              <Image
                                src={item.item_icon}
                                alt={item.item_name}
                                width={30}
                                height={30}
                                className="w-7.5 h-7.5 object-contain pixelated"
                                unoptimized
                              />
                              {starforce > 0 && (
                                <div className="absolute bottom-0.5 left-0.5 flex items-center gap-0.5 text-[#ffcc00] leading-none">
                                  <Star className="w-2 h-2 fill-[#ffcc00]" />
                                  <span className="text-[8px] font-bold">{starforce}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                      return (
                        <div key={slot} style={{ gridColumn: col, gridRow: row }}>
                          {item ? (
                            <Tooltip
                              content={
                                <ItemTooltipContent
                                  item={item}
                                  potentialGradeMap={potentialGradeMap}
                                />
                              }
                              className="bg-transparent! border-none! shadow-none! p-0!"
                              wrapperClassName="block"
                            >
                              {slotCell}
                            </Tooltip>
                          ) : (
                            slotCell
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </>
          )}
          {equipmentTab === "pet" && (
            <>
              <p className="px-3 pt-3 pb-1 text-sm font-bold text-base-content/40">PET</p>
              {!petJson?.pet_1_icon &&
              !petJson?.pet_1_appearance_icon &&
              !petJson?.pet_2_icon &&
              !petJson?.pet_2_appearance_icon &&
              !petJson?.pet_3_icon &&
              !petJson?.pet_3_appearance_icon ? (
                <p className="px-3 pb-3 text-xs text-base-content/30">장착된 펫이 없습니다</p>
              ) : (
                <div className="p-3 grid grid-cols-3 gap-2 sm:max-w-xs sm:mx-auto">
                  {(
                    [
                      {
                        icon: petJson?.pet_1_appearance_icon ?? petJson?.pet_1_icon,
                        equipment: petJson?.pet_1_equipment,
                        nickname: petJson?.pet_1_nickname,
                        autoSkill: petJson?.pet_1_auto_skill,
                      },
                      {
                        icon: petJson?.pet_2_appearance_icon ?? petJson?.pet_2_icon,
                        equipment: petJson?.pet_2_equipment,
                        nickname: petJson?.pet_2_nickname,
                        autoSkill: petJson?.pet_2_auto_skill,
                      },
                      {
                        icon: petJson?.pet_3_appearance_icon ?? petJson?.pet_3_icon,
                        equipment: petJson?.pet_3_equipment,
                        nickname: petJson?.pet_3_nickname,
                        autoSkill: petJson?.pet_3_auto_skill,
                      },
                    ] as const
                  ).map((pet, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <p className="text-[10px] font-bold text-base-content/30">PET 0{i + 1}</p>
                      <div className="rounded-xl border border-base-content/10 flex flex-col p-2 gap-1">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex gap-1">
                            <div
                              className="flex-1 aspect-square rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: "rgb(179, 185, 191)" }}
                            >
                              {pet.icon ? (
                                <Image
                                  src={pet.icon}
                                  alt=""
                                  width={36}
                                  height={36}
                                  className="w-9 h-9 object-contain pixelated"
                                  unoptimized
                                />
                              ) : (
                                <PawPrint className="w-3 h-3 text-base-content/20" />
                              )}
                            </div>
                            <div
                              className="flex-1 aspect-square rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: "rgb(179, 185, 191)" }}
                            >
                              {pet.equipment?.item_icon ? (
                                <Image
                                  src={pet.equipment.item_icon}
                                  alt=""
                                  width={36}
                                  height={36}
                                  className="w-9 h-9 object-contain pixelated"
                                  unoptimized
                                />
                              ) : (
                                <Shield className="w-3 h-3 text-base-content/20" />
                              )}
                            </div>
                          </div>
                          <div
                            className="w-full rounded-full h-6 flex items-center justify-center px-1 overflow-hidden"
                            style={{ backgroundColor: "rgb(160, 168, 175)" }}
                          >
                            <span className="font-galmuri text-[10px] text-white truncate">
                              {pet.nickname ?? ""}
                            </span>
                          </div>
                          <hr className="border-base-content/10 w-full" />
                          <div className="flex gap-1">
                            {(
                              [
                                {
                                  icon: pet.autoSkill?.skill_1_icon,
                                  name: pet.autoSkill?.skill_1,
                                },
                                {
                                  icon: pet.autoSkill?.skill_2_icon,
                                  name: pet.autoSkill?.skill_2,
                                },
                              ] as {
                                icon: string | null | undefined;
                                name: string | null | undefined;
                              }[]
                            ).map((s, i) => {
                              const skillInfo = s.name ? allSkillMap.get(s.name) : undefined;
                              return (
                                <Tooltip
                                  key={i}
                                  wrapperClassName="flex-1"
                                  content={
                                    skillInfo
                                      ? renderSkillTooltipContent(skillInfo)
                                      : undefined
                                  }
                                  className="!bg-transparent !border-none !shadow-none !p-0"
                                >
                                  <div
                                    className="aspect-square rounded-lg flex items-center justify-center w-full"
                                    style={{ backgroundColor: "rgb(179, 185, 191)" }}
                                  >
                                    {s.icon && (
                                      <Image
                                        src={s.icon}
                                        alt={s.name ?? ""}
                                        width={36}
                                        height={36}
                                        className="w-9 h-9 object-contain pixelated"
                                        unoptimized
                                      />
                                    )}
                                  </div>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        {equipmentTab === "equipped" && (
          <div className="flex-1 rounded-xl border border-base-300 bg-base-200/30 min-h-40">
            <p className="px-3 pt-3 pb-1 text-sm font-bold text-base-content/40">SYMBOL</p>
            <div className="px-3 pb-3 flex flex-col gap-1.5">
              <div className="rounded-lg border border-base-300 bg-base-200/50 px-2.5 py-1.5 flex flex-col gap-1.5">
                <p className="text-[10px] font-bold text-base-content/30">ARCANE SYMBOL</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(symbolJson?.symbol ?? [])
                    .filter(
                      (s) =>
                        s.symbol_name.includes("아케인심볼") ||
                        s.symbol_name.toLowerCase().includes("arcane"),
                    )
                    .slice(0, 6)
                    .map((s) => (
                      <Tooltip
                        key={s.symbol_name}
                        wrapperClassName="block"
                        className="bg-transparent! border-none! shadow-none! p-0!"
                        content={<SymbolTooltipContent symbol={s} />}
                      >
                        <div className="relative aspect-square rounded-lg border border-base-content/10 bg-base-100/60 flex items-center justify-center shadow-inner">
                          <Image
                            src={s.symbol_icon}
                            alt={s.symbol_name}
                            width={34}
                            height={34}
                            className="w-8 h-8 object-contain pixelated"
                            unoptimized
                          />
                          <span className="absolute bottom-0.5 right-1 text-[8px] font-bold text-base-content/60 leading-none">
                            {s.symbol_level >= 20 ? "MAX" : s.symbol_level}
                          </span>
                        </div>
                      </Tooltip>
                    ))}
                </div>
              </div>
              {(() => {
                const authenticSymbols = (symbolJson?.symbol ?? []).filter(
                  (s) =>
                    (s.symbol_name.includes("어센틱심볼") ||
                      s.symbol_name.toLowerCase().includes("authentic")) &&
                    !s.symbol_name.includes("그랜드"),
                );
                return (
                  <div className="rounded-lg border border-base-300 bg-base-200/50 px-2.5 py-1.5 flex flex-col gap-1.5">
                    <p className="text-[10px] font-bold text-base-content/30">AUTHENTIC SYMBOL</p>
                    {authenticSymbols.length === 0 ? (
                      <p className="text-[9px] text-base-content/20 text-center py-1">없음</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-1.5">
                        {authenticSymbols.map((s) => (
                          <Tooltip
                            key={s.symbol_name}
                            wrapperClassName="block"
                            className="bg-transparent! border-none! shadow-none! p-0!"
                            content={<SymbolTooltipContent symbol={s} />}
                          >
                            <div className="relative aspect-square rounded-lg border border-base-content/10 bg-base-100/60 flex items-center justify-center shadow-inner">
                              <Image
                                src={s.symbol_icon}
                                alt={s.symbol_name}
                                width={34}
                                height={34}
                                className="w-8 h-8 object-contain pixelated"
                                unoptimized
                              />
                              <span className="absolute bottom-0.5 right-1 text-[8px] font-bold text-base-content/60 leading-none">
                                {s.symbol_level >= 11 ? "MAX" : s.symbol_level}
                              </span>
                            </div>
                          </Tooltip>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
              {(() => {
                const grandSymbols = (symbolJson?.symbol ?? []).filter((s) =>
                  s.symbol_name.includes("그랜드"),
                );
                return (
                  <div className="rounded-lg border border-base-300 bg-base-200/50 px-2.5 py-1.5 flex flex-col gap-1.5">
                    <p className="text-[10px] font-bold text-base-content/30">
                      GRAND AUTHENTIC SYMBOL
                    </p>
                    {grandSymbols.length === 0 ? (
                      <p className="text-[9px] text-base-content/20 text-center py-1">없음</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-1.5">
                        {grandSymbols.map((s) => (
                          <Tooltip
                            key={s.symbol_name}
                            wrapperClassName="block"
                            className="bg-transparent! border-none! shadow-none! p-0!"
                            content={<SymbolTooltipContent symbol={s} />}
                          >
                            <div className="relative aspect-square rounded-lg border border-base-content/10 bg-base-100/60 flex items-center justify-center shadow-inner">
                              <Image
                                src={s.symbol_icon}
                                alt={s.symbol_name}
                                width={34}
                                height={34}
                                className="w-8 h-8 object-contain pixelated"
                                unoptimized
                              />
                              <span className="absolute bottom-0.5 right-1 text-[8px] font-bold text-base-content/60 leading-none">
                                {s.symbol_level >= 11 ? "MAX" : s.symbol_level}
                              </span>
                            </div>
                          </Tooltip>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
