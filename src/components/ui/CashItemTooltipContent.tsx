import Image from "next/image";

import { CashItemEquipment } from "@/types/character";

interface Props {
  item: CashItemEquipment;
  isPreset?: boolean;
}

const ITEM_TAG: Record<string, string[]> = {
  장신구: ["반지1", "반지2", "반지3", "반지4", "벨트", "얼굴장식", "눈장식", "귀고리", "펜던트", "펜던트2"],
  무기: ["무기"],
  보조무기: ["보조무기"],
  방어구: ["모자", "상의", "하의", "망토", "신발", "장갑"],
  어깨장식: ["어깨장식"],
};
const SLOT_TAG: Record<string, string> = {};
for (const [tag, slots] of Object.entries(ITEM_TAG)) {
  for (const slot of slots) {
    SLOT_TAG[slot] = tag;
  }
}

const OPTION_ORDER = [
  "STR",
  "DEX",
  "INT",
  "LUK",
  "올스탯",
  "최대HP",
  "최대MP",
  "공격력",
  "마력",
  "방어력",
  "보스 몬스터 데미지",
  "몬스터 방어율 무시",
];

function getCashSlotBadges(item: CashItemEquipment): string[] {
  const slot = item.cash_item_equipment_slot;
  if (slot === "무기") return ["무기"];
  const tag = SLOT_TAG[slot] ?? slot;
  const badges: string[] = [tag];
  if (SLOT_TAG[slot] && SLOT_TAG[slot] !== slot) {
    badges.push(item.cash_item_equipment_part);
  }
  return badges;
}

export default function CashItemTooltipContent({ item, isPreset = false }: Props) {
  const badges = getCashSlotBadges(item);
  const hasOptions = item.cash_item_option.length > 0 || !!item.date_option_expire;
  const hasBottom = hasOptions || !!item.cash_item_description;

  return (
    <div
      className="w-80 rounded-xl px-4 py-3 font-galmuri font-thin"
      style={{ background: "rgba(37, 44, 52, 0.85)" }}
    >
      <p className="text-center text-[14px] font-normal text-white">{item.cash_item_name}</p>
      <p className="text-center text-[10px] font-normal" style={{ color: "rgb(255, 138, 24)" }}>
        교환 불가 (캐시 보관함 이동 가능)
      </p>
      <hr className="my-2 border-white/20" />
      <div className="flex items-start justify-between">
        <div
          className="relative w-16 h-16 rounded flex items-center justify-center"
          style={{ background: "linear-gradient(to bottom, #3d5c70, #c8d4dc)" }}
        >
          <Image
            src={item.cash_item_icon}
            alt={item.cash_item_name}
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
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full px-2.5 py-0.5 text-[10px] font-galmuri text-white/60"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[10px] font-galmuri text-white/50 mt-2 whitespace-nowrap">
        착용 직업
        <span className="inline-block w-8" />
        <span className="text-white">공용</span>
      </p>
      {hasBottom && <hr className="mt-2 border-white/20" />}
      {hasOptions && (
        <div className="mt-2 flex flex-col gap-0.5">
          {item.date_option_expire && (() => {
            const d = new Date(item.date_option_expire);
            return (
              <p className="text-[10px] font-galmuri whitespace-nowrap" style={{ color: "#ffcc00" }}>
                {`능력치 유효 기간 : ${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${d.getHours()}시 ${d.getMinutes()}분 (연장 불가)`}
              </p>
            );
          })()}
          {[...item.cash_item_option]
            .sort((a, b) => {
              const ai = OPTION_ORDER.indexOf(a.option_type);
              const bi = OPTION_ORDER.indexOf(b.option_type);
              return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
            })
            .map((opt) => (
              <p key={opt.option_type} className="text-[10px] font-galmuri text-white whitespace-nowrap">
                {opt.option_type}
                <span className="inline-block w-3" />
                <span className="text-white">+{opt.option_value}</span>
                <span className="text-white">
                  {" (0 "}
                  <span style={{ color: "#ffcc00" }}>+ {opt.option_value}</span>
                  {")"}
                </span>
              </p>
            ))}
        </div>
      )}
      {item.cash_item_description && (
        <p className="text-[10px] font-galmuri text-white whitespace-pre-wrap leading-relaxed mt-2">
          {item.cash_item_description}
        </p>
      )}
      {isPreset && (
        <>
          {!hasBottom && <hr className="mt-2 border-white/20" />}
          <p className="text-[10px] font-galmuri text-white leading-relaxed mt-2">
            코디 프리셋에 장착한 아이템은 외형에만 적용되며, 옵션 적용을 원할 경우 치장창에 착용해주세요.
          </p>
        </>
      )}
    </div>
  );
}
