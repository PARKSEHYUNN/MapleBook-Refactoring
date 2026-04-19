"use client";

/**
 * @file src/components/ui/ItemTooltipContent.tsx - 장비 아이템 툴팁 콘텐츠
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 장비 슬롯 호버 시 표시되는 아이템 상세 툴팁입니다.
 * Tooltip 컴포넌트의 content prop에 전달하여 사용합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */
import Image from "next/image";

import { Star } from "lucide-react";

import { formatCombatPowerDiff } from "@/lib/formatters";
import { ItemEquipment } from "@/types/character";

interface Props {
  item: ItemEquipment;
  /** 전투력 증가량 (양수: 증가, 음수: 감소). 미전달 시 숫자 미표시 */
  combatPowerDiff?: number;
  /** optionText → 등급 맵 (DB 누적 데이터). 2/3번 라인 등급 판별에 사용 */
  potentialGradeMap?: Record<string, string>;
}

const WEAPON_HAND: Record<"한손" | "두손", Set<string>> = {
  한손: new Set([
    "한손검",
    "한손도끼",
    "한손둔기",
    "데스페라도",
    "튜너",
    "장검",
    "스태프",
    "완드",
    "샤이닝로드",
    "ESP리미터",
    "매직건틀렛",
    "메모리얼스태프",
    "브레스슈터",
    "단검",
    "케인",
    "체인",
    "부채",
    "소울슈터",
    "에너지소드",
  ]),
  두손: new Set([
    "두손검",
    "두손도끼",
    "두손둔기",
    "창",
    "폴암",
    "태도",
    "대검",
    "건틀렛리볼버",
    "카타나",
    "활",
    "석궁",
    "듀얼보우건",
    "에이션트보우",
    "아대",
    "차크람",
    "너클",
    "건",
    "핸드캐논",
    "무권",
  ]),
};

function getWeaponHand(part: string): "한손" | "두손" | null {
  if (WEAPON_HAND.한손.has(part)) {
    return "한손";
  }
  if (WEAPON_HAND.두손.has(part)) {
    return "두손";
  }
  return null;
}

const ITEM_TAG: Record<string, string[]> = {
  장신구: [
    "반지1",
    "반지2",
    "반지3",
    "반지4",
    "벨트",
    "얼굴장식",
    "눈장식",
    "귀고리",
    "펜던트",
    "펜던트2",
  ],
  무기: ["무기"],
  보조무기: ["보조무기"],
  "엠블렘/파워소스": ["엠블렘"],
  방어구: ["모자", "상의", "하의", "망토", "신발", "장갑"],
  "포켓 아이템": ["포켓 아이템"],
  안드로이드: ["안드로이드"],
  "기계 심장": ["기계 심장"],
  어깨장식: ["어깨장식"],
  훈장: ["훈장"],
  뱃지: ["뱃지"],
};
const SLOT_TAG: Record<string, string> = {};
for (const [tag, slots] of Object.entries(ITEM_TAG)) {
  for (const slot of slots) {
    SLOT_TAG[slot] = tag;
  }
}

const WEAPON_ATTACK_SPEED: Record<string, number> = {
  한손검: 5,
  한손도끼: 5,
  한손둔기: 5,
  데스페라도: 4,
  튜너: 6,
  장검: 6,
  스태프: 2,
  완드: 4,
  샤이닝로드: 4,
  ESP리미터: 4,
  매직건틀렛: 4,
  메모리얼스태프: 4,
  브레스슈터: 6,
  단검: 6,
  케인: 5,
  체인: 6,
  부채: 6,
  소울슈터: 5,
  에너지소드: 5,
  두손검: 4,
  두손도끼: 4,
  두손둔기: 4,
  창: 4,
  폴암: 5,
  태도: 4,
  대검: 2,
  건틀렛리볼버: 5,
  카타나: 5,
  활: 4,
  석궁: 4,
  듀얼보우건: 4,
  에이션트보우: 4,
  아대: 6,
  차크람: 6,
  너클: 5,
  건: 5,
  핸드캐논: 2,
  무권: 6,
  블레이드: 7,
};

const WEAPON_PART_JOB: Record<string, string> = {
  한손검: "전사",
  한손도끼: "전사",
  한손둔기: "전사",
  두손검: "전사",
  두손도끼: "전사",
  두손둔기: "전사",
  창: "전사",
  폴암: "전사",
  대검: "전사",
  건틀렛리볼버: "전사",
  장검: "전사",
  스태프: "마법사",
  완드: "마법사",
  샤이닝로드: "마법사",
  ESP리미터: "마법사",
  매직건틀렛: "마법사",
  메모리얼스태프: "마법사",
  브레스슈터: "마법사",
  활: "궁수",
  석궁: "궁수",
  듀얼보우건: "궁수",
  에이션트보우: "궁수",
  단검: "도적",
  케인: "도적",
  체인: "도적",
  부채: "도적",
  소울슈터: "도적",
  에너지소드: "도적",
  태도: "도적",
  건: "해적",
  핸드캐논: "해적",
  너클: "해적",
  아대: "해적",
  차크람: "해적",
  카타나: "해적",
  무권: "해적",
  데스페라도: "해적",
  튜너: "해적",
  // 보조무기
  메달: "히어로",
  로자리오: "팔라딘",
  쇠사슬: "다크나이트",
  화살깃: "보우마스터",
  활골무: "신궁",
  "단검용 검집": "섀도어",
  부적: "나이트로드",
  블레이드: "듀얼블레이드",
  리스트밴드: "바이퍼",
  조준기: "캡틴",
  화약통: "캐논 슈터",
  무게추: "아란",
  문서: "에반",
  마법화살: "메르세데스",
  카드: "팬텀",
  여우구슬: "은월",
  오브: "루미너스",
  포스실드: "데몬 직업군",
  장약: "블래스터",
  마법구슬: "배틀메이지",
  화살촉: "와일드헌터",
  컨트롤러: "제논",
  매그넘: "메카닉",
  소울실드: "미하일",
  보석: "시그너스 기사단",
  "용의 정수": "카이저",
  "무기 전송장치": "카데나",
  소울링: "엔젤릭버스터",
  체스피스: "키네시스",
  매직윙: "일리움",
  "패스 오브 어비스": "아크",
  렐릭: "패스파인더 직업군",
  선추: "호영",
  브레이슬릿: "아델",
  "웨폰 벨트": "카인",
  노리개: "라라",
  헥스시커: "칼리",
  여의보주: "렌",
};

const ARMOR_SLOTS = new Set(["모자", "상의", "하의", "망토", "신발", "장갑", "어깨장식"]);

const ARMOR_JOB_KEYWORDS: [string[], string][] = [
  [["워리어", "나이트"], "전사"],
  [["던위치", "메이지"], "마법사"],
  [["레인져", "아처"], "궁수"],
  [["어새신", "시프"], "도적"],
  [["원더러", "파이렛"], "해적"],
];

function getItemJob(item: ItemEquipment): string {
  const slot = item.item_equipment_slot;

  if (slot === "무기" || slot === "보조무기") {
    if (item.item_equipment_part === "마도서") {
      if (item.item_name.includes("적녹의 서")) {
        return "불,독 계열 마법사";
      }
      if (item.item_name.includes("청은의 서")) {
        return "얼음,번개 계열 마법사";
      }
      if (item.item_name.includes("백금의 서")) {
        return "비숍 계열 마법사";
      }
    }
    return WEAPON_PART_JOB[item.item_equipment_part] ?? "공용";
  }

  if (ARMOR_SLOTS.has(slot)) {
    for (const [keywords, job] of ARMOR_JOB_KEYWORDS) {
      if (keywords.some((kw) => item.item_name.includes(kw))) {
        return job;
      }
    }
  }

  return "공용";
}

const ZERO_WEAPON_PARTS = new Set(["태도", "대검"]);

function getSlotBadges(item: ItemEquipment): string[] {
  const slot = item.item_equipment_slot;
  const isZeroWeaponInAux = slot === "보조무기" && ZERO_WEAPON_PARTS.has(item.item_equipment_part);
  const tag = isZeroWeaponInAux ? "무기" : (SLOT_TAG[slot] ?? slot);
  const badges: string[] = [tag];

  if (slot === "무기" || slot === "보조무기") {
    const hand = getWeaponHand(item.item_equipment_part);
    if (hand) {
      badges.push(hand);
    }
    badges.push(item.item_equipment_part);
  } else if (SLOT_TAG[slot] && SLOT_TAG[slot] !== slot) {
    badges.push(item.item_equipment_part);
  }

  return badges;
}


const SCISSORS_5_ITEMS = new Set([
  "루즈 컨트롤 머신 마크",
  "마력이 깃든 안대",
  "컴플리트 언더컨트롤",
  "몽환의 벨트",
  "고통의 근원",
  "커맨더 포스 이어링",
  "거대한 공포",
  "미트라의 분노 : 전사",
  "미트라의 분노 : 마법사",
  "미트라의 분노 : 궁수",
  "미트라의 분노 : 도적",
  "미트라의 분노 : 해적",
  "근원의 속삭임",
  "죽음의 맹세",
  "황홀한 악몽",
  "오만의 원죄",
]);

const SUPERIOR_KEYWORDS = [
  "헬리시움 정예",
  "노비 히아데스",
  "노바 리카온",
  "노바 알테어",
  "노바 케이론",
  "노바 헤르메스",
  "타일런트 히아데스",
  "타일런트 리카온",
  "타일런트 알테어",
  "타일런트 케이론",
  "타일런트 헤르메스",
];

const STARFORCE_BLOCKED_SLOTS = new Set(["엠블렘", "포켓 아이템", "뱃지", "안드로이드", "훈장"]);

const STARFORCE_WEAPON_PARTS = ["블레이드", "방패", "대검", "태도"];

const STARFORCE_SPECIAL_RINGS = new Set([
  "연금술사의 반지",
  "버서커의 임모탈 링",
  "가디언의 임모탈 링",
  "아크로드의 이터널 링",
  "오라클의 이터널 링",
  "버서커의 마이스터 임모탈 링",
  "가디언의 마이스터 임모탈 링",
  "아크로드의 마이스터 이터널 링",
  "오라클의 마이스터 이터널 링",
  "올마이티링",
  "마이스터 올마이티링",
  "무르무르의 메이지 링",
  "무르무르의 로드 링",
  "구미호의 혼령 반지",
  "구미호의 주술 반지",
  "마이스터링",
  "스칼렛 링",
  "실버블라썸 링",
  "고귀한 이피아의 반지",
  "거대한 공포",
  "가디언 엔젤 링",
  "여명의 가디언 엔젤 링",
  "근원의 속삭임",
  "링 오브 페어리퀸",
  "이피아의 반지",
  "플래티넘 크로스 링",
]);

function getMaxStarforce(item: ItemEquipment, currentStar: number): number {
  if (STARFORCE_BLOCKED_SLOTS.has(item.item_equipment_slot)) {
    return 0;
  }

  // 반지: 특수 목록에 없으면 숨김, 단 이미 강화된 수치가 있으면 표시
  if (item.item_equipment_slot.startsWith("반지")) {
    if (!STARFORCE_SPECIAL_RINGS.has(item.item_name) && currentStar === 0) {
      return 0;
    }
  }

  // 보조무기: 특정 무기 종류만 스타포스 적용 (단, 이미 강화된 경우 표시)
  if (item.item_equipment_slot === "보조무기") {
    const isStarforceable = STARFORCE_WEAPON_PARTS.some((kw) => item.item_name.includes(kw));
    if (!isStarforceable && currentStar === 0) {
      return 0;
    }
  }

  const name = item.item_name;
  const level = item.item_base_option.base_equipment_level ?? 0;

  if (name.includes("아케인셰이드") && name.includes("블레이드")) {
    return 26;
  }
  if (name.includes("데스티니") && level >= 200) {
    return 25;
  }

  const isSuperior = SUPERIOR_KEYWORDS.some((kw) => name.includes(kw));
  if (isSuperior) {
    if (level <= 94) {
      return 3;
    }
    if (level <= 107) {
      return 5;
    }
    if (level <= 117) {
      return 8;
    }
    if (level <= 127) {
      return 10;
    }
    if (level <= 137) {
      return 12;
    }
    return 15;
  }

  if (level <= 94) {
    return 5;
  }
  if (level <= 107) {
    return 8;
  }
  if (level <= 117) {
    return 10;
  }
  if (level <= 127) {
    return 15;
  }
  if (level <= 137) {
    return 20;
  }
  return 30;
}

const GRADE_LOWER: Record<string, string> = {
  레전드리: "유니크",
  유니크: "에픽",
  에픽: "레어",
  레어: "레어",
};

function getOptionGrade(
  optionText: string | null,
  overallGrade: string | null,
  gradeMap: Record<string, string>,
): string | null {
  if (!optionText || !overallGrade) {
    return null;
  }
  return gradeMap[optionText] ?? GRADE_LOWER[overallGrade] ?? overallGrade;
}

const POTENTIAL_GRADE_COLOR: Record<string, string> = {
  레어: "#66ffff",
  에픽: "#bb77ff",
  유니크: "#ffcc00",
  레전드리: "#ccff00",
};

const POTENTIAL_GRADE_LETTER: Record<string, string> = {
  레어: "R",
  에픽: "E",
  유니크: "U",
  레전드리: "L",
};

function PotentialMark({ grade }: { grade: string | null }) {
  if (!grade) {
    return (
      <div
        className="w-3 h-3 rounded-sm flex items-center justify-center"
        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
      >
        <div
          className="w-1 h-1 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
        />
      </div>
    );
  }

  const color = POTENTIAL_GRADE_COLOR[grade] ?? "#ffffff";
  const letter = POTENTIAL_GRADE_LETTER[grade] ?? "?";

  return (
    <div
      className="w-3 h-3 rounded-xs flex items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <span className="text-[8px] font-extrabold leading-none" style={{ color: "#252c34" }}>
        {letter}
      </span>
    </div>
  );
}

const STARS_PER_GROUP = 5;
const GROUPS_PER_ROW = 3;

function StarRow({ current, max }: { current: number; max: number }) {
  const rows: React.ReactNode[] = [];
  let idx = 0;

  while (idx < max) {
    const groups: React.ReactNode[] = [];
    for (let g = 0; g < GROUPS_PER_ROW && idx < max; g++) {
      const stars: React.ReactNode[] = [];
      for (let s = 0; s < STARS_PER_GROUP && idx < max; s++) {
        const filled = idx < current;
        stars.push(
          <Star
            key={idx}
            size={10}
            fill={filled ? "#ffcc00" : "rgba(255,255,255,0.1)"}
            color={filled ? "#ffcc00" : "rgba(255,255,255,0.1)"}
          />,
        );
        idx++;
      }
      groups.push(
        <span key={g} className="flex">
          {stars}
        </span>,
      );
    }
    rows.push(
      <div key={rows.length} className="flex justify-center gap-2">
        {groups}
      </div>,
    );
  }

  return <div className="flex flex-col gap-0.5 py-1 pb-2">{rows}</div>;
}

export default function ItemTooltipContent({
  item,
  combatPowerDiff,
  potentialGradeMap = {},
}: Props) {
  const currentStar = parseInt(item.starforce, 10);
  const maxStar = getMaxStarforce(item, currentStar);

  const itemLevel = item.item_base_option.base_equipment_level ?? 0;
  const scissorsMax = SCISSORS_5_ITEMS.has(item.item_name) ? 5 : 10;

  // 유효기간 포맷
  const expireLabel = (() => {
    if (!item.date_expire) {
      return null;
    }
    const d = new Date(item.date_expire);
    const yyyy = d.getFullYear();
    const M = d.getMonth() + 1;
    const D = d.getDate();
    const h = d.getHours();
    const m = d.getMinutes();
    return `유효 기간 : ${yyyy}년 ${M}월 ${D}일 ${h}시 ${m}분 (연장 불가)`;
  })();

  // 교환 불가 표시 여부 및 가위 잔여 횟수 계산
  let tradeLabel: string | null = null;
  if (item.cuttable_count === "255") {
    const isRing = item.item_equipment_slot.startsWith("반지");
    if (isRing || itemLevel >= 130) {
      tradeLabel = "교환 불가";
    }
  } else if (item.cuttable_count === "0") {
    tradeLabel = "교환 불가";
  } else {
    const left = parseInt(item.cuttable_count, 10);
    tradeLabel = `교환 불가 (가위 사용 잔여 횟수 : ${left} / ${scissorsMax})`;
  }

  return (
    <div
      className="w-80 rounded-xl px-4 py-3 font-galmuri font-thin"
      style={{ background: "rgba(37, 44, 52, 0.85)" }}
    >
      {maxStar > 0 && <StarRow current={currentStar} max={maxStar} />}
      <p className="text-center text-[14px] font-normal text-white">{item.item_name}</p>
      {tradeLabel !== null && (
        <p className="text-center text-[10px] font-normal" style={{ color: "rgb(255, 138, 24)" }}>
          {tradeLabel}
        </p>
      )}
      {expireLabel !== null && (
        <p className="text-center text-[10px] font-normal" style={{ color: "rgb(255, 138, 24)" }}>
          {expireLabel}
        </p>
      )}
      <hr className="my-2 border-white/20" />
      <div className="flex items-start justify-between">
        <div
          className="relative w-16 h-16 rounded flex items-center justify-center"
          style={{ background: "linear-gradient(to bottom, #3d5c70, #c8d4dc)" }}
        >
          <Image
            src={item.item_icon}
            alt={item.item_name}
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
            unoptimized
          />
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <p className="text-[11px] text-white/70">전투력 증가량</p>
          {combatPowerDiff !== undefined ? (
            <p
              className="text-xl font-sans font-bold"
              style={{ color: combatPowerDiff >= 0 ? "#ffffff" : "#ff4444" }}
            >
              {formatCombatPowerDiff(combatPowerDiff)}
            </p>
          ) : (
            <p className="text-xl font-sans text-white/50 font-bold">현재 장착 중인 장비</p>
          )}
          <div className="flex gap-1 mt-1">
            {getSlotBadges(item).map((badge) => (
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
        <span className="text-white">{getItemJob(item)}</span>
      </p>
      {(item.item_base_option.base_equipment_level ?? 0) > 0 && (
        <p className="text-[10px] font-galmuri text-white/50 mt-1 whitespace-nowrap">
          요구 레벨
          <span className="inline-block w-8" />
          {(() => {
            const base = item.item_base_option.base_equipment_level ?? 0;
            const dec = item.item_add_option.equipment_level_decrease ?? 0;
            const actual = base - dec;
            return dec > 0 ? (
              <>
                <span className="text-white">Lv. {actual}</span>
                <span className="text-white/50">
                  {" ( "}
                  {base}
                </span>
                <span style={{ color: "rgb(10, 227, 173)" }}>
                  {" - "}
                  {dec}
                </span>
                <span className="text-white/50">{" )"}</span>
              </>
            ) : (
              <span className="text-white">Lv. {base}</span>
            );
          })()}
        </p>
      )}
      <hr className="my-2 border-white/20" />
      {(item.item_equipment_slot === "무기" ||
        (item.item_equipment_slot === "보조무기" &&
          (item.item_equipment_part === "블레이드" ||
            ZERO_WEAPON_PARTS.has(item.item_equipment_part)))) &&
        WEAPON_ATTACK_SPEED[item.item_equipment_part] !== undefined && (
          <p className="text-[10px] font-galmuri text-white/50 whitespace-nowrap">
            공격 속도
            <span className="inline-block w-8" />
            <span className="text-white/50">
              {WEAPON_ATTACK_SPEED[item.item_equipment_part]}단계
            </span>
          </p>
        )}
      {[
        {
          label: "STR",
          total: item.item_total_option.str,
          base: item.item_base_option.str,
          sf: item.item_starforce_option.str,
          etc: item.item_etc_option.str,
          add: item.item_add_option.str,
        },
        {
          label: "DEX",
          total: item.item_total_option.dex,
          base: item.item_base_option.dex,
          sf: item.item_starforce_option.dex,
          etc: item.item_etc_option.dex,
          add: item.item_add_option.dex,
        },
        {
          label: "INT",
          total: item.item_total_option.int,
          base: item.item_base_option.int,
          sf: item.item_starforce_option.int,
          etc: item.item_etc_option.int,
          add: item.item_add_option.int,
        },
        {
          label: "LUK",
          total: item.item_total_option.luk,
          base: item.item_base_option.luk,
          sf: item.item_starforce_option.luk,
          etc: item.item_etc_option.luk,
          add: item.item_add_option.luk,
        },
        {
          label: "올스탯",
          total: item.item_total_option.all_stat,
          base: item.item_base_option.all_stat,
          add: item.item_add_option.all_stat,
        },
        {
          label: "최대HP",
          total: item.item_total_option.max_hp,
          base: item.item_base_option.max_hp,
          sf: item.item_starforce_option.max_hp,
          etc: item.item_etc_option.max_hp,
          add: item.item_add_option.max_hp,
        },
        {
          label: "최대MP",
          total: item.item_total_option.max_mp,
          base: item.item_base_option.max_mp,
          sf: item.item_starforce_option.max_mp,
          etc: item.item_etc_option.max_mp,
          add: item.item_add_option.max_mp,
        },
        {
          label: "공격력",
          total: item.item_total_option.attack_power,
          base: item.item_base_option.attack_power,
          sf: item.item_starforce_option.attack_power,
          etc: item.item_etc_option.attack_power,
          add: item.item_add_option.attack_power,
        },
        {
          label: "마력",
          total: item.item_total_option.magic_power,
          base: item.item_base_option.magic_power,
          sf: item.item_starforce_option.magic_power,
          etc: item.item_etc_option.magic_power,
          add: item.item_add_option.magic_power,
        },
        {
          label: "방어력",
          total: item.item_total_option.armor,
          base: item.item_base_option.armor,
          sf: item.item_starforce_option.armor,
          etc: item.item_etc_option.armor,
          add: item.item_add_option.armor,
        },
        {
          label: "보스 몬스터 데미지",
          total: item.item_total_option.boss_damage,
          base: item.item_base_option.boss_damage,
          add: item.item_add_option.boss_damage,
          suffix: "%",
        },
        {
          label: "몬스터 방어율 무시",
          total: item.item_total_option.ignore_monster_armor ?? "0",
          base: item.item_base_option.ignore_monster_armor ?? "0",
          add: item.item_add_option.ignore_monster_armor ?? "0",
          suffix: "%",
        },
      ]
        .filter(({ total }) => parseInt(total ?? "0", 10) > 0)
        .map(({ label, total, base, sf, etc, add, suffix = "" }) => (
          <p key={label} className="text-[10px] font-galmuri text-white whitespace-nowrap">
            {label}
            <span className="inline-block w-3" />
            <span className="text-white">
              +{total}
              {suffix}
            </span>
            {(parseInt(sf ?? "0", 10) > 0 ||
              parseInt(etc ?? "0", 10) > 0 ||
              parseInt(add ?? "0", 10) > 0) && (
              <span className="text-white">
                {" ("}
                {base}
                {suffix}
                {parseInt(sf ?? "0", 10) > 0 && (
                  <span style={{ color: "rgb(255, 204, 0)" }}>
                    {" "}
                    +{sf}
                    {suffix}
                  </span>
                )}
                {parseInt(etc ?? "0", 10) > 0 && (
                  <span style={{ color: "rgb(175, 173, 255)" }}>
                    {" "}
                    +{etc}
                    {suffix}
                  </span>
                )}
                {parseInt(add ?? "0", 10) > 0 && (
                  <span style={{ color: "rgb(10, 227, 173)" }}>
                    {" "}
                    +{add}
                    {suffix}
                  </span>
                )}
                {")"}
              </span>
            )}
          </p>
        ))}
      {item.item_description && (
        <p className="text-[10px] font-galmuri text-white whitespace-pre-wrap leading-relaxed mt-2">
          {item.item_description}
        </p>
      )}
      {(() => {
        const upgraded = parseInt(item.scroll_upgrade, 10);
        const remaining = parseInt(item.scroll_upgradeable_count, 10);
        const resilience = parseInt(item.scroll_resilience_count, 10);
        if (upgraded === 0 && remaining === 0 && resilience === 0) {
          return null;
        }
        return upgraded === 0 ? (
          <p className="text-[10px] font-galmuri text-white/30 whitespace-nowrap mt-1">
            주문서 강화 없음 (잔여 {remaining}회, 복구 가능 {resilience}회)
          </p>
        ) : (
          <p className="text-[10px] font-galmuri text-white/80 whitespace-nowrap mt-1">
            주문서 강화 {upgraded}회 (잔여 {remaining}회, 복구 가능 {resilience}회)
          </p>
        );
      })()}
      {!["포켓 아이템", "뱃지", "훈장", "안드로이드"].includes(item.item_equipment_slot) && (
        <>
          <hr className="my-2 border-white/20" />
          <div className="flex flex-col gap-1.5">
            {[
              {
                mark: item.potential_option_grade,
                label: "잠재능력",
                options: [
                  item.potential_option_1,
                  item.potential_option_2,
                  item.potential_option_3,
                ],
              },
              {
                mark: item.additional_potential_option_grade,
                label: "에디셔널 잠재능력",
                options: [
                  item.additional_potential_option_1,
                  item.additional_potential_option_2,
                  item.additional_potential_option_3,
                ],
              },
            ].map(({ mark, label, options }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <PotentialMark grade={mark} />
                  <span
                    className="text-[10px] font-galmuri"
                    style={{
                      color: mark
                        ? (POTENTIAL_GRADE_COLOR[mark] ?? "#ffffff")
                        : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {label} : {mark ?? "없음"}
                  </span>
                </div>
                {options.map((text, i) => {
                  if (!text) {
                    return null;
                  }
                  const grade = i === 0 ? mark : getOptionGrade(text, mark, potentialGradeMap);
                  const squareColor = grade
                    ? (POTENTIAL_GRADE_COLOR[grade] ?? "rgba(255,255,255,0.4)")
                    : "rgba(255,255,255,0.2)";
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 shrink-0 flex items-center justify-center">
                        <div className="w-1 h-1" style={{ backgroundColor: squareColor }} />
                      </div>
                      <p className="text-[10px] font-galmuri text-white">{text}</p>
                    </div>
                  );
                })}
              </div>
            ))}
            {item.item_equipment_slot === "무기" && (
              <div className="mt-1 flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                  <Image
                    src="/soul.svg"
                    alt="소울"
                    width={40}
                    height={10}
                    className="h-3 w-auto"
                    unoptimized
                  />
                  <span className="font-galmuri text-[10px] text-white">
                    소울 : {item.soul_name ?? "소울 웨폰으로 변환 필요"}
                  </span>
                </div>
                {item.soul_option && (
                  <p className="font-galmuri text-[10px] text-white" style={{ marginLeft: "2px" }}>
                    {item.soul_option}
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
