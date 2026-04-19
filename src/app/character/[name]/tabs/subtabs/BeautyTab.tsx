"use client";

import { useState } from "react";
import Image from "next/image";

import { Bot, Shirt } from "lucide-react";

import CashItemTooltipContent from "@/components/ui/CashItemTooltipContent";
import Tooltip from "@/components/ui/Tooltip";
import type {
  AndroidEquipmentJsonType,
  BeautyEquipmentJsonType,
  CashEquipmentJsonType,
  CashItemEquipment,
} from "@/types/character";

function beautyLabel(
  name: string,
  baseColor?: string | null,
  mixColor?: string | null,
  mixRate?: string | null,
): string {
  if (!baseColor) return name;
  if (mixColor && mixRate) {
    const mixPct = Number(mixRate);
    const basePct = 100 - mixPct;
    return `믹스 ${name} ( ${mixColor} ${mixPct} : ${baseColor} ${basePct} )`;
  }
  return `${baseColor} ${name}`;
}

const COORD_SLOTS: { slot: string; row: number; col: number }[] = [
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
  { slot: "무기", row: 4, col: 6 },
  { slot: "보조무기", row: 4, col: 7 },
];

const ANDROID_SLOTS: { slot: string; row: number; col: number }[] = [
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
  { slot: "무기", row: 4, col: 6 },
];

interface BeautyTabProps {
  cashEquipmentJson: CashEquipmentJsonType | null;
  beautyEquipmentJson: BeautyEquipmentJsonType | null;
  androidEquipmentJson: AndroidEquipmentJsonType | null;
}

export default function BeautyTab({
  cashEquipmentJson,
  beautyEquipmentJson,
  androidEquipmentJson,
}: BeautyTabProps) {
  const [beautyTab, setBeautyTab] = useState<"coordination" | "android">("coordination");
  const [cashPreset, setCashPreset] = useState<1 | 2 | 3>(
    (Number(cashEquipmentJson?.preset_no) as 1 | 2 | 3) || 1,
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {(
          [
            { id: "coordination", label: "코디", icon: Shirt },
            { id: "android", label: "안드로이드", icon: Bot },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setBeautyTab(id)}
            className={[
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
              beautyTab === id
                ? "border-base-content/30 bg-base-content/10 text-base-content"
                : "border-base-300 bg-base-200/30 text-base-content/50 hover:bg-base-200/60",
            ].join(" ")}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {beautyTab === "coordination" && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
          <div className="flex-1 rounded-xl border border-base-300 bg-base-200/30">
            <p className="px-3 pt-3 pb-1 text-sm font-bold text-base-content/40">COORDINATION</p>
            {(() => {
              const baseItems = cashEquipmentJson?.cash_item_equipment_base ?? [];
              const slotMap = new Map(
                baseItems.map((item) => [item.cash_item_equipment_slot, item]),
              );
              const GAP = "4px";
              const BEAUTY_CELLS: {
                src: string;
                alt: string;
                label: string | null;
                col: number;
                row: number;
              }[] = [
                {
                  src: "/Hair.png",
                  alt: beautyEquipmentJson?.character_hair?.hair_name ?? "헤어",
                  label: beautyEquipmentJson?.character_hair
                    ? beautyLabel(
                        beautyEquipmentJson.character_hair.hair_name ?? "헤어",
                        beautyEquipmentJson.character_hair.base_color,
                        beautyEquipmentJson.character_hair.mix_color,
                        beautyEquipmentJson.character_hair.mix_rate,
                      )
                    : null,
                  col: 3,
                  row: 5,
                },
                {
                  src: "/Face.png",
                  alt: beautyEquipmentJson?.character_face?.face_name ?? "성형",
                  label: beautyEquipmentJson?.character_face
                    ? beautyLabel(
                        beautyEquipmentJson.character_face.face_name ?? "성형",
                        beautyEquipmentJson.character_face.base_color,
                        beautyEquipmentJson.character_face.mix_color,
                        beautyEquipmentJson.character_face.mix_rate,
                      )
                    : null,
                  col: 4,
                  row: 5,
                },
                {
                  src: "/Skin.png",
                  alt: beautyEquipmentJson?.character_skin?.skin_name ?? "피부",
                  label: beautyEquipmentJson?.character_skin?.skin_name ?? null,
                  col: 5,
                  row: 5,
                },
              ];
              return (
                <div
                  className="p-2"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: GAP,
                  }}
                >
                  <div style={{ gridColumn: "3 / 6", gridRow: "1 / 5" }} />
                  {COORD_SLOTS.map(({ slot, row, col }) => {
                    const item = slotMap.get(slot);
                    const cell = (
                      <div className="relative aspect-square rounded-lg border border-base-content/10 bg-base-100/60 flex items-center justify-center shadow-inner">
                        {item && (
                          <Image
                            src={item.cash_item_icon}
                            alt={item.cash_item_name}
                            width={30}
                            height={30}
                            className="w-7.5 h-7.5 object-contain pixelated"
                            unoptimized
                          />
                        )}
                      </div>
                    );
                    return (
                      <div key={slot} style={{ gridColumn: col, gridRow: row }}>
                        {item ? (
                          <Tooltip
                            content={<CashItemTooltipContent item={item} />}
                            className="bg-transparent! border-none! shadow-none! p-0!"
                            wrapperClassName="block"
                          >
                            {cell}
                          </Tooltip>
                        ) : (
                          cell
                        )}
                      </div>
                    );
                  })}
                  {BEAUTY_CELLS.map(({ src, alt, label, col, row }) => {
                    const cell = (
                      <div className="relative aspect-square rounded-lg border border-base-content/10 bg-base-100/60 flex items-center justify-center shadow-inner">
                        <Image
                          src={src}
                          alt={alt}
                          width={30}
                          height={30}
                          className="w-7.5 h-7.5 object-contain pixelated"
                        />
                      </div>
                    );
                    return (
                      <div key={`beauty-${col}`} style={{ gridColumn: col, gridRow: row }}>
                        {label ? (
                          <Tooltip
                            content={
                              <span className="text-[10px] font-galmuri text-white">{label}</span>
                            }
                            className="!bg-[rgba(37,44,52,0.85)] !border-none !shadow-none !rounded-lg !px-2.5 !py-1"
                            wrapperClassName="block"
                            offsetX={20}
                            offsetY={-30}
                          >
                            {cell}
                          </Tooltip>
                        ) : (
                          cell
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
          <div className="flex-1 rounded-xl border border-base-300 bg-base-200/30">
            <div className="px-3 pt-3 pb-1 flex items-center justify-between">
              <p className="text-sm font-bold text-base-content/40">COORDINATION PRESET</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-widest text-base-content/40">
                  PRESETS
                </span>
                <div className="flex gap-1">
                  {([1, 2, 3] as const).map((n) => {
                    const isDefault = n === Number(cashEquipmentJson?.preset_no);
                    const isViewing = n === cashPreset;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCashPreset(n)}
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
              const presetKey = `cash_item_equipment_preset_${cashPreset}` as
                | "cash_item_equipment_preset_1"
                | "cash_item_equipment_preset_2"
                | "cash_item_equipment_preset_3";
              const presetItems = cashEquipmentJson?.[presetKey] ?? [];
              const slotMap = new Map(
                presetItems.map((item) => [item.cash_item_equipment_slot, item]),
              );
              const GAP = "4px";
              return (
                <div
                  className="p-2"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: GAP,
                  }}
                >
                  <div style={{ gridColumn: "3 / 6", gridRow: "1 / 4" }} />
                  {COORD_SLOTS.map(({ slot, row, col }) => {
                    const item = slotMap.get(slot);
                    const cell = (
                      <div className="relative aspect-square rounded-lg border border-base-content/10 bg-base-100/60 flex items-center justify-center shadow-inner">
                        {item && (
                          <Image
                            src={item.cash_item_icon}
                            alt={item.cash_item_name}
                            width={30}
                            height={30}
                            className="w-7.5 h-7.5 object-contain pixelated"
                            unoptimized
                          />
                        )}
                      </div>
                    );
                    return (
                      <div key={slot} style={{ gridColumn: col, gridRow: row }}>
                        {item ? (
                          <Tooltip
                            content={<CashItemTooltipContent item={item} isPreset />}
                            className="bg-transparent! border-none! shadow-none! p-0!"
                            wrapperClassName="block"
                          >
                            {cell}
                          </Tooltip>
                        ) : (
                          cell
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {beautyTab === "android" && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
          <div className="flex flex-col rounded-xl border border-base-300 bg-base-200/30 sm:flex-2 sm:min-w-0">
            <p className="px-3 pt-3 pb-1 text-sm font-bold text-base-content/40">ANDROID</p>
            {(() => {
              const baseItems = androidEquipmentJson?.android_cash_item_equipment ?? [];
              const slotMap = new Map(
                baseItems.map((item) => [item.cash_item_equipment_slot, item]),
              );
              const GAP = "4px";
              const BEAUTY_CELLS: {
                src: string;
                alt: string;
                label: string | null;
                col: number;
                row: number;
              }[] = [
                {
                  src: "/Hair.png",
                  alt: androidEquipmentJson?.android_hair?.hair_name ?? "헤어",
                  label: androidEquipmentJson?.android_hair
                    ? beautyLabel(
                        androidEquipmentJson.android_hair.hair_name ?? "헤어",
                        androidEquipmentJson.android_hair.base_color,
                        androidEquipmentJson.android_hair.mix_color,
                        androidEquipmentJson.android_hair.mix_rate,
                      )
                    : null,
                  col: 3,
                  row: 5,
                },
                {
                  src: "/Face.png",
                  alt: androidEquipmentJson?.android_face?.face_name ?? "성형",
                  label: androidEquipmentJson?.android_face
                    ? beautyLabel(
                        androidEquipmentJson.android_face.face_name ?? "성형",
                        androidEquipmentJson.android_face.base_color,
                        androidEquipmentJson.android_face.mix_color,
                        androidEquipmentJson.android_face.mix_rate,
                      )
                    : null,
                  col: 4,
                  row: 5,
                },
                {
                  src: "/Skin.png",
                  alt: androidEquipmentJson?.android_skin?.skin_name ?? "피부",
                  label: androidEquipmentJson?.android_skin?.skin_name ?? null,
                  col: 5,
                  row: 5,
                },
              ];
              return (
                <div
                  className="p-2"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: GAP,
                  }}
                >
                  <div style={{ gridColumn: "3 / 6", gridRow: "1 / 5" }} />
                  {ANDROID_SLOTS.map(({ slot, row, col }) => {
                    const item = slotMap.get(slot);
                    const cell = (
                      <div className="relative aspect-square rounded-lg border border-base-content/10 bg-base-100/60 flex items-center justify-center shadow-inner">
                        {item && (
                          <Image
                            src={item.cash_item_icon}
                            alt={item.cash_item_name}
                            width={30}
                            height={30}
                            className="w-7.5 h-7.5 object-contain pixelated"
                            unoptimized
                          />
                        )}
                      </div>
                    );
                    return (
                      <div key={slot} style={{ gridColumn: col, gridRow: row }}>
                        {item ? (
                          <Tooltip
                            content={
                              <CashItemTooltipContent
                                item={item as unknown as CashItemEquipment}
                              />
                            }
                            className="bg-transparent! border-none! shadow-none! p-0!"
                            wrapperClassName="block"
                          >
                            {cell}
                          </Tooltip>
                        ) : (
                          cell
                        )}
                      </div>
                    );
                  })}
                  {BEAUTY_CELLS.map(({ src, alt, label, col, row }) => {
                    const cell = (
                      <div className="relative aspect-square rounded-lg border border-base-content/10 bg-base-100/60 flex items-center justify-center shadow-inner">
                        <Image
                          src={src}
                          alt={alt}
                          width={30}
                          height={30}
                          className="w-7.5 h-7.5 object-contain pixelated"
                        />
                      </div>
                    );
                    return (
                      <div key={`beauty-${col}`} style={{ gridColumn: col, gridRow: row }}>
                        {label ? (
                          <Tooltip
                            content={
                              <span className="text-[10px] font-galmuri text-white">{label}</span>
                            }
                            className="!bg-[rgba(37,44,52,0.85)] !border-none !shadow-none !rounded-lg !px-2.5 !py-1"
                            wrapperClassName="block"
                            offsetX={20}
                            offsetY={-30}
                          >
                            {cell}
                          </Tooltip>
                        ) : (
                          cell
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
          <div
            className="flex-1 rounded-xl px-4 py-3 font-galmuri font-thin flex flex-col"
            style={{ background: "rgba(37, 44, 52, 0.85)" }}
          >
            {androidEquipmentJson ? (
              <>
                <p className="text-center text-[14px] font-normal text-white">
                  {androidEquipmentJson.android_name ?? "안드로이드"}
                </p>
                <hr className="my-2 border-white/20" />
                <div className="flex items-start justify-between">
                  <div
                    className="relative w-16 h-16 rounded flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(to bottom, #3d5c70, #c8d4dc)" }}
                  >
                    {androidEquipmentJson.android_icon && (
                      <Image
                        src={androidEquipmentJson.android_icon}
                        alt={androidEquipmentJson.android_name ?? "안드로이드"}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain pixelated"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    {androidEquipmentJson.android_nickname && (
                      <p className="text-[10px] font-galmuri text-white/70">
                        {androidEquipmentJson.android_nickname}
                      </p>
                    )}
                    <p className="text-xl font-sans text-white/50 font-bold">현재 장착 중인 장비</p>
                    <div className="flex gap-1 mt-1">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-galmuri text-white/60"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        안드로이드
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
                  <span className="text-white">Lv. 10</span>
                </p>
                {(() => {
                  const NON_HUMANOID_TEXT =
                    "헤어 변경 및 성형이 불가능하며, 캐시 아이템을 장착하여도 외형이 변경되지 않는 비인간형 안드로이드이다.";
                  const isNonHumanoid =
                    androidEquipmentJson.android_description?.includes(NON_HUMANOID_TEXT) ?? false;
                  const hairLabel = androidEquipmentJson.android_hair
                    ? beautyLabel(
                        androidEquipmentJson.android_hair.hair_name ?? "헤어",
                        androidEquipmentJson.android_hair.base_color,
                        androidEquipmentJson.android_hair.mix_color,
                        androidEquipmentJson.android_hair.mix_rate,
                      )
                    : null;
                  const faceLabel = androidEquipmentJson.android_face
                    ? beautyLabel(
                        androidEquipmentJson.android_face.face_name ?? "성형",
                        androidEquipmentJson.android_face.base_color,
                        androidEquipmentJson.android_face.mix_color,
                        androidEquipmentJson.android_face.mix_rate,
                      )
                    : null;
                  const skinLabel = androidEquipmentJson.android_skin?.skin_name ?? null;
                  return (
                    <>
                      <hr className="my-2 border-white/20" />
                      {skinLabel && (
                        <p className="text-[10px] font-galmuri text-white whitespace-nowrap">
                          피부
                          <span className="inline-block w-3" />
                          <span className="text-white">{skinLabel}</span>
                        </p>
                      )}
                      {androidEquipmentJson.android_grade && (
                        <p className="text-[10px] font-galmuri text-white whitespace-nowrap mt-2">
                          {`등급 : ${androidEquipmentJson.android_grade}`}
                        </p>
                      )}
                      {androidEquipmentJson.android_description && (
                        <p className="text-[10px] font-galmuri text-white whitespace-pre-wrap leading-relaxed mt-2">
                          {androidEquipmentJson.android_description}
                        </p>
                      )}
                      {!isNonHumanoid && (hairLabel || faceLabel) && (
                        <>
                          <hr className="my-2 border-white/20" />
                          {hairLabel && (
                            <p className="text-[10px] font-galmuri text-white whitespace-nowrap">
                              헤어
                              <span className="inline-block w-3" />
                              <span className="text-white">{hairLabel}</span>
                            </p>
                          )}
                          {faceLabel && (
                            <p className="text-[10px] font-galmuri text-white whitespace-nowrap">
                              성형
                              <span className="inline-block w-3" />
                              <span className="text-white">{faceLabel}</span>
                            </p>
                          )}
                        </>
                      )}
                    </>
                  );
                })()}
              </>
            ) : (
              <p className="text-xs text-white/30 font-galmuri m-auto">안드로이드 없음</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
