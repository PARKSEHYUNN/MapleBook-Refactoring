"use client";

// src/components/character/UnionChip.tsx
// 유니온 탭: 레이더 그리드, 레이더 스탯, 아티팩트, 챔피언

import { useMemo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Gem, LayoutGrid, Trophy } from "lucide-react";
import type { Character, UnionBlock, UnionChampion } from "@/types/character";
import { TOOLTIP_OPEN_EVENT } from "@/hooks/useEquipTooltip";

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const GRID_COLS = 22;
const GRID_ROWS = 20;
const UNION_TOOLTIP_W = 200;

// 직업 계열 → 블록 색상
const BLOCK_TYPE_COLOR: Record<string, string> = {
  전사: "#f87171",
  마법사: "#38bdf8",
  궁수: "#4ade80",
  도적: "#c084fc",
  해적: "#94a3b8",
  하이브리드: "#facc15",
  "메이플 M 캐릭터": "#f472b6",
};

// 직업 계열 → 클래스 아이콘
const BLOCK_TYPE_ICON: Record<string, string> = {
  전사: "/assets/Union/ClassIcon_Warrior.png",
  마법사: "/assets/Union/ClassIcon_Mage.png",
  궁수: "/assets/Union/ClassIcon_Archer.png",
  도적: "/assets/Union/ClassIcon_Rogue.png",
  해적: "/assets/Union/ClassIcon_Pirates.png",
  하이브리드: "/assets/Union/ClassIcon_Hybrid.png",
  "메이플 M 캐릭터": "/assets/Union/ClassIcon_Mobile.png",
};

// 직업명 → 직업 계열 매핑
const CLASS_TO_JOB_TYPE: Record<string, string> = {
  // 전사
  "히어로": "전사", "팔라딘": "전사", "다크나이트": "전사",
  "소울마스터": "전사", "미하일": "전사",
  "아란": "전사",
  "데몬슬레이어": "전사", "데몬어벤져": "전사",
  "블래스터": "전사",
  "카이저": "전사",
  "제로": "전사",
  "아델": "전사",
  "렌": "전사",

  // 마법사
  "아크메이지(불,독)": "마법사", "아크메이지(썬,콜)": "마법사", "비숍": "마법사",
  "플레임위자드": "마법사",
  "에반": "마법사", "루미너스": "마법사",
  "배틀메이지": "마법사",
  "키네시스": "마법사",
  "일리움": "마법사",
  "라라": "마법사",

  // 궁수
  "보우마스터": "궁수", "신궁": "궁수", "패스파인더": "궁수",
  "윈드브레이커": "궁수",
  "메르세데스": "궁수",
  "와일드헌터": "궁수",
  "카인": "궁수",

  // 도적
  "나이트로드": "도적", "섀도어": "도적", "듀얼블레이드": "도적",
  "나이트워커": "도적",
  "팬텀": "도적",
  "제논": "도적",
  "카데나": "도적",
  "칼리": "도적",
  "호영": "도적",

  // 해적
  "바이퍼": "해적", "캡틴": "해적", "캐논슈터": "해적",
  "스트라이커": "해적",
  "은월": "해적",
  "메카닉": "해적",
  "엔젤릭버스터": "해적",
  "아크": "해적",
};

// 직업 계열 → 조각상 파일 정보 [번호, 영문명]
const JOB_TYPE_TO_STATUE: Record<string, [number, string]> = {
  전사: [1, "Warrior"],
  마법사: [2, "Mage"],
  궁수: [3, "Archer"],
  도적: [4, "Rouge"],
  해적: [5, "Pirate"],
};

// 챔피언 등급 → 조각상 번호 (C는 None_0 공통)
const GRADE_TO_STATUE_NUM: Record<string, number> = {
  B: 1, A: 2, S: 3, SS: 4, SSS: 5,
};

function getStatueImage(championClass: string, grade: string): string {
  const jobType = CLASS_TO_JOB_TYPE[championClass];
  const statueInfo = jobType ? JOB_TYPE_TO_STATUE[jobType] : null;
  const gradeNum = GRADE_TO_STATUE_NUM[grade];
  if (!statueInfo || !gradeNum) {
    return "/assets/UnionChampion/0_UnionChampion_Statue_None_0.png";
  }
  const [n, typeName] = statueInfo;
  return `/assets/UnionChampion/${n}_UnionChampion_Statue_${typeName}_${gradeNum}.png`;
}

// 존 → 빈 칸 배경색
const ZONE_EMPTY_COLOR: Record<string, string> = {
  '1': "rgba(148,163,184,0.18)",
  '2': "rgba(251,191,36,0.15)",
  '3': "rgba(167,139,250,0.18)",
  '4': "rgba(96,165,250,0.18)",
  '5': "rgba(52,211,153,0.18)",
  '6': "rgba(251,113,133,0.18)",
  '7': "rgba(251,146,60,0.15)",
  '8': "rgba(250,204,21,0.15)",
  A: "rgba(255,255,255,0.08)",
  B: "rgba(255,255,255,0.08)",
  C: "rgba(255,255,255,0.08)",
  D: "rgba(255,255,255,0.08)",
  E: "rgba(255,255,255,0.08)",
  F: "rgba(255,255,255,0.08)",
  G: "rgba(255,255,255,0.08)",
  H: "rgba(255,255,255,0.08)",
};

// ─── 존 맵 (20행 × 22열) ──────────────────────────────────────────────────────
// 1-8: 고정 옵션 존 / A-H: 가변 옵션 존

const ZONE_MAP: string[][] = [
  ['3','1','1','1','1','1','1','1','1','1','1','2','2','2','2','2','2','2','2','2','2','4'],
  ['3','3','1','1','1','1','1','1','1','1','1','2','2','2','2','2','2','2','2','2','4','4'],
  ['3','3','3','1','1','1','1','1','1','1','1','2','2','2','2','2','2','2','2','4','4','4'],
  ['3','3','3','3','1','1','1','1','1','1','1','2','2','2','2','2','2','2','4','4','4','4'],
  ['3','3','3','3','3','1','1','1','1','1','1','2','2','2','2','2','2','4','4','4','4','4'],
  ['3','3','3','3','3','A','B','B','B','B','B','C','C','C','C','C','D','4','4','4','4','4'],
  ['3','3','3','3','3','A','A','B','B','B','B','C','C','C','C','D','D','4','4','4','4','4'],
  ['3','3','3','3','3','A','A','A','B','B','B','C','C','C','D','D','D','4','4','4','4','4'],
  ['3','3','3','3','3','A','A','A','A','B','B','C','C','D','D','D','D','4','4','4','4','4'],
  ['3','3','3','3','3','A','A','A','A','A','B','C','D','D','D','D','D','4','4','4','4','4'],
  ['5','5','5','5','5','E','E','E','E','E','F','G','H','H','H','H','H','6','6','6','6','6'],
  ['5','5','5','5','5','E','E','E','E','F','F','G','G','H','H','H','H','6','6','6','6','6'],
  ['5','5','5','5','5','E','E','E','F','F','F','G','G','G','H','H','H','6','6','6','6','6'],
  ['5','5','5','5','5','E','E','F','F','F','F','G','G','G','G','H','H','6','6','6','6','6'],
  ['5','5','5','5','5','E','F','F','F','F','F','G','G','G','G','G','H','6','6','6','6','6'],
  ['5','5','5','5','5','7','7','7','7','7','7','8','8','8','8','8','8','6','6','6','6','6'],
  ['5','5','5','5','7','7','7','7','7','7','7','8','8','8','8','8','8','8','6','6','6','6'],
  ['5','5','5','7','7','7','7','7','7','7','7','8','8','8','8','8','8','8','8','6','6','6'],
  ['5','5','7','7','7','7','7','7','7','7','7','8','8','8','8','8','8','8','8','8','6','6'],
  ['5','7','7','7','7','7','7','7','7','7','7','8','8','8','8','8','8','8','8','8','8','6'],
];

const FIXED_ZONE_NAME: Record<string, string> = {
  '1': '상태이상 내성',
  '2': '획득 경험치',
  '3': '크리티컬 데미지',
  '4': '크리티컬 확률',
  '5': '방어율 무시',
  '6': '보스 데미지',
  '7': '버프 지속시간',
  '8': '일반 데미지',
};

const VARIABLE_ZONE_DEFAULT: Record<string, string> = {
  A: '공격력',
  B: 'STR',
  C: 'LUK',
  D: 'HP',
  E: 'DEX',
  F: 'INT',
  G: '마력',
  H: 'MP',
};

// ─── 가변 옵션 추론 (union_occupied_stat 기반) ────────────────────────────────
// STR/DEX/INT/LUK: 셀당 5 선형 (15셀 → 75)
// 공격력/마력: 1/5/10/15셀 → 1/2/4/6 단계
// HP/MP: 1/5/10/15셀 → 250/500/1000/2000 단계
const VARIABLE_STAT_PARSE_ORDER = ['STR', 'DEX', 'INT', 'LUK', '공격력', '마력', 'HP', 'MP'];

function getZone(col: number, row: number): string | null {
  return ZONE_MAP[row]?.[col] ?? null;
}

// 존 중심 좌표 사전 계산 (모듈 로드 시 1회)
const ZONE_CENTROID: Map<string, { col: number; row: number }> = (() => {
  const sumCol: Record<string, number> = {};
  const sumRow: Record<string, number> = {};
  const count: Record<string, number> = {};
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const z = ZONE_MAP[row][col];
      sumCol[z] = (sumCol[z] ?? 0) + col;
      sumRow[z] = (sumRow[z] ?? 0) + row;
      count[z] = (count[z] ?? 0) + 1;
    }
  }
  const map = new Map<string, { col: number; row: number }>();
  for (const z of Object.keys(count)) {
    map.set(z, { col: sumCol[z] / count[z], row: sumRow[z] / count[z] });
  }
  return map;
})();

// 존 경계 border 스타일 사전 계산 (모듈 로드 시 1회)
const ZONE_BORDER = "1px solid rgba(255,255,255,0.22)";
const CELL_BORDER_STYLE: Map<string, React.CSSProperties> = (() => {
  const map = new Map<string, React.CSSProperties>();
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const zone = ZONE_MAP[row][col];
      const style: React.CSSProperties = {};
      if (col < GRID_COLS - 1 && ZONE_MAP[row][col + 1] !== zone)
        style.borderRight = ZONE_BORDER;
      if (row < GRID_ROWS - 1 && ZONE_MAP[row + 1][col] !== zone)
        style.borderBottom = ZONE_BORDER;
      if (Object.keys(style).length > 0)
        map.set(`${col},${row}`, style);
    }
  }
  return map;
})();

function isVariableZone(zone: string): boolean {
  return zone >= 'A' && zone <= 'H';
}

function getZoneName(zone: string): string {
  return FIXED_ZONE_NAME[zone] ?? VARIABLE_ZONE_DEFAULT[zone] ?? zone;
}

function getExpectedStatAmount(cells: number, stat: string): number {
  if (cells <= 0) return 0;
  if (['STR', 'DEX', 'INT', 'LUK'].includes(stat)) return cells * 5;
  if (['공격력', '마력'].includes(stat)) return cells;
  if (['HP', 'MP'].includes(stat)) return cells * 250;
  return 0;
}

function parseVariableOccupiedStats(occupiedStats: string[]): { stat: string; amount: number }[] {
  const result: { stat: string; amount: number }[] = [];
  for (const s of occupiedStats) {
    for (const stat of VARIABLE_STAT_PARSE_ORDER) {
      // "STR 5 증가", "공격력 6 증가", "최대 HP 2000 증가"
      const re = new RegExp(`(?:최대\\s+)?${stat}\\s+(\\d+)\\s*증가`);
      const m = s.match(re);
      if (m) {
        result.push({ stat, amount: parseInt(m[1], 10) });
        break;
      }
    }
  }
  return result;
}

function inferVariableZoneNames(
  blocks: UnionBlock[],
  occupiedStats: string[],
): { inferred: Record<string, string>; zoneCells: Record<string, number>; occupiedStatSet: Set<string> } {
  // 가변 존별 점령 셀 수 집계
  const zoneCells: Record<string, number> = {};
  for (const block of blocks) {
    for (const pos of block.block_position) {
      const { col, row } = toCell(pos.x, pos.y);
      const zone = getZone(col, row);
      if (zone && isVariableZone(zone)) {
        zoneCells[zone] = (zoneCells[zone] ?? 0) + 1;
      }
    }
  }

  const parsedStats = parseVariableOccupiedStats(occupiedStats);
  const occupiedStatSet = new Set(parsedStats.map(({ stat }) => stat));
  const result: Record<string, string> = {};
  const usedZones = new Set<string>();
  const usedStats = new Set<string>();

  let changed = true;
  while (changed) {
    changed = false;

    // Rule 1: 후보 존이 유일한 경우 확정
    for (const { stat, amount } of parsedStats) {
      if (usedStats.has(stat)) continue;
      const candidates = Object.entries(zoneCells).filter(
        ([zone, cells]) =>
          !usedZones.has(zone) &&
          cells > 0 &&
          getExpectedStatAmount(cells, stat) === amount,
      );
      if (candidates.length === 1) {
        result[candidates[0][0]] = stat;
        usedZones.add(candidates[0][0]);
        usedStats.add(stat);
        changed = true;
      }
    }

    // Rule 2: 기본값 존의 스탯이 유효하게 매칭되면 우선 배정 (동점 해소)
    for (const [zone, defaultStat] of Object.entries(VARIABLE_ZONE_DEFAULT)) {
      if (usedZones.has(zone) || usedStats.has(defaultStat)) continue;
      const cells = zoneCells[zone] ?? 0;
      if (cells === 0) continue;
      const statEntry = parsedStats.find(({ stat }) => stat === defaultStat);
      if (!statEntry) continue;
      if (getExpectedStatAmount(cells, defaultStat) !== statEntry.amount) continue;
      result[zone] = defaultStat;
      usedZones.add(zone);
      usedStats.add(defaultStat);
      changed = true;
    }
  }

  // Rule 3: 그리디 폴백 — Rule 1/2로 해소 못한 스탯을 후보 존에 순서대로 배정
  // (기본값 매칭 존 우선, 없으면 알파벳 첫 번째)
  for (const stat of VARIABLE_STAT_PARSE_ORDER) {
    if (usedStats.has(stat)) continue;
    const statEntry = parsedStats.find(({ stat: s }) => s === stat);
    if (!statEntry) continue;
    const candidates = Object.entries(zoneCells)
      .filter(([zone, cells]) => !usedZones.has(zone) && cells > 0 && getExpectedStatAmount(cells, stat) === statEntry.amount)
      .sort(([a], [b]) => a.localeCompare(b));
    if (!candidates.length) continue;
    const preferred = candidates.find(([zone]) => VARIABLE_ZONE_DEFAULT[zone] === stat) ?? candidates[0];
    result[preferred[0]] = stat;
    usedZones.add(preferred[0]);
    usedStats.add(stat);
  }

  return { inferred: result, zoneCells, occupiedStatSet };
}

// 블록이 걸쳐 있는 모든 존과 셀 수 반환 (내림차순)
function getBlockZones(block: UnionBlock): { zone: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const pos of block.block_position) {
    const { col, row } = toCell(pos.x, pos.y);
    const zone = getZone(col, row);
    if (zone) counts[zone] = (counts[zone] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([zone, count]) => ({ zone, count }));
}

// ─── 그리드 변환 ───────────────────────────────────────────────────────────────

function toCell(x: number, y: number) {
  return { col: x + 11, row: 10 - y };
}

function buildCellMap(blocks: UnionBlock[]): Map<string, UnionBlock> {
  const map = new Map<string, UnionBlock>();
  for (const block of blocks) {
    for (const pos of block.block_position) {
      const { col, row } = toCell(pos.x, pos.y);
      if (col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS) {
        map.set(`${col},${row}`, block);
      }
    }
  }
  return map;
}

// ─── 툴팁 위치 계산 ────────────────────────────────────────────────────────────

function getBlockGrade(level: string): string {
  const lv = parseInt(level, 10);
  if (lv >= 250) return "SSS";
  if (lv >= 200) return "SS";
  if (lv >= 140) return "S";
  if (lv >= 100) return "A";
  return "B";
}

function calcUnionTooltipPos(el: HTMLElement): React.CSSProperties {
  const rect = el.getBoundingClientRect();
  const MARGIN = 8;
  let left = rect.left;
  if (left + UNION_TOOLTIP_W > window.innerWidth - MARGIN)
    left = window.innerWidth - UNION_TOOLTIP_W - MARGIN;
  if (left < MARGIN) left = MARGIN;
  if (rect.top > window.innerHeight * 0.5)
    return { bottom: window.innerHeight - rect.top + MARGIN, left };
  return { top: rect.bottom + MARGIN, left };
}

// ─── 그리드 컴포넌트 ───────────────────────────────────────────────────────────

type ActiveCell = { block: UnionBlock; style: React.CSSProperties } | null;

// 블록 외곽선: 같은 블록이 아닌 인접 셀 방향에 테두리
function buildBlockBorderStyles(cellMap: Map<string, UnionBlock>): Map<string, React.CSSProperties> {
  const map = new Map<string, React.CSSProperties>();
  const B = "1px solid rgba(255,255,255,0.7)";
  cellMap.forEach((block, key) => {
    const [col, row] = key.split(",").map(Number);
    const style: React.CSSProperties = {};
    if (cellMap.get(`${col},${row - 1}`) !== block) style.borderTop = B;
    if (cellMap.get(`${col + 1},${row}`) !== block) style.borderRight = B;
    if (cellMap.get(`${col},${row + 1}`) !== block) style.borderBottom = B;
    if (cellMap.get(`${col - 1},${row}`) !== block) style.borderLeft = B;
    if (Object.keys(style).length) map.set(key, style);
  });
  return map;
}

// 블록 아이콘 위치 계산 (block_control_point 기준)
function buildBlockCentroids(blocks: UnionBlock[]): { block: UnionBlock; col: number; row: number }[] {
  return blocks.flatMap(block => {
    const cp = block.block_control_point;
    if (cp == null) return [];
    const { col, row } = toCell(cp.x, cp.y);
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return [];
    return [{ block, col, row }];
  });
}

function UnionGrid({ blocks, occupiedStats }: { blocks: UnionBlock[]; occupiedStats: string[] }) {
  const cellMap = useMemo(() => buildCellMap(blocks), [blocks]);
  const { inferred: inferredZoneNames, zoneCells } = useMemo(
    () => inferVariableZoneNames(blocks, occupiedStats),
    [blocks, occupiedStats],
  );
  const blockBorderStyles = useMemo(() => buildBlockBorderStyles(cellMap), [cellMap]);
  const blockCentroids = useMemo(() => buildBlockCentroids(blocks), [blocks]);

  // 가변 존 표시 이름 계산
  const varZoneDisplay = useMemo((): Record<string, string> => {
    const display: Record<string, string> = {};
    const usedStats = new Set(Object.values(inferredZoneNames));

    // 1단계: 추론된 존
    for (const [zone, stat] of Object.entries(inferredZoneNames)) {
      display[zone] = stat;
    }
    // 2단계: 빈 존 중 기본값 스탯이 아직 사용 안 된 경우 → 기본값 표시
    for (const [zone, def] of Object.entries(VARIABLE_ZONE_DEFAULT)) {
      if (display[zone]) continue;
      if ((zoneCells[zone] ?? 0) === 0 && !usedStats.has(def)) {
        display[zone] = def;
        usedStats.add(def);
      }
    }
    // 3단계: 기본값이 이미 쓰인 빈 존 → 아직 안 쓴 스탯을 순서대로 채움
    const remaining = Object.values(VARIABLE_ZONE_DEFAULT).filter(s => !usedStats.has(s));
    let ri = 0;
    for (const zone of Object.keys(VARIABLE_ZONE_DEFAULT)) {
      if (display[zone]) continue;
      if ((zoneCells[zone] ?? 0) === 0) {
        display[zone] = remaining[ri++] ?? zone;
      }
      // 점령됐으나 추론 불가 → 존 문자 유지 (display에 없으면 아래 fallback)
    }
    return display;
  }, [inferredZoneNames, zoneCells]);

  const getDisplayZoneName = (zone: string): string => {
    if (!isVariableZone(zone)) return getZoneName(zone);
    return varZoneDisplay[zone] ?? zone;
  };
  const [active, setActive] = useState<ActiveCell>(null);
  const isTouchRef = useRef(false);
  const activeKeyRef = useRef<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const openCell = (el: HTMLElement, block: UnionBlock, key: string) => {
    setActive({ block, style: calcUnionTooltipPos(el) });
    activeKeyRef.current = key;
    window.dispatchEvent(new CustomEvent(TOOLTIP_OPEN_EVENT, { detail: gridRef }));
  };

  const closeCell = () => {
    setActive(null);
    activeKeyRef.current = null;
  };

  useEffect(() => {
    if (!active) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Element;
      if (!target.closest("[data-union-tooltip]") && !target.closest("[data-union-cell]"))
        closeCell();
    };
    const handleOtherOpen = (e: Event) => {
      if ((e as CustomEvent).detail !== gridRef) closeCell();
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    window.addEventListener(TOOLTIP_OPEN_EVENT, handleOtherOpen);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      window.removeEventListener(TOOLTIP_OPEN_EVENT, handleOtherOpen);
    };
  }, [active]);

  return (
    <div className="w-full overflow-x-auto">
      <div
        ref={gridRef}
        className="mx-auto relative"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`,
          maxWidth: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {Array.from({ length: GRID_ROWS }, (_, row) =>
          Array.from({ length: GRID_COLS }, (_, col) => {
            const key = `${col},${row}`;
            const block = cellMap.get(key);
            const zone = getZone(col, row);
            const isCenter = col === 11 && row === 10;

            let bgColor: string;
            if (block) {
              console.log(block.block_type)
              bgColor = BLOCK_TYPE_COLOR[block.block_type] ?? "rgba(255,255,255,0.2)";
            } else if (isCenter) {
              bgColor = "rgba(255,255,255,0.15)";
            } else {
              bgColor = (zone ? ZONE_EMPTY_COLOR[zone] : undefined) ?? "transparent";
            }

            return (
              <div
                key={key}
                data-union-cell
                onMouseEnter={block ? (e) => { if (!isTouchRef.current) openCell(e.currentTarget, block, key); } : undefined}
                onMouseLeave={block ? () => { if (!isTouchRef.current) closeCell(); } : undefined}
                onTouchStart={() => { isTouchRef.current = true; }}
                onClick={block ? (e) => {
                  if (activeKeyRef.current === key) closeCell();
                  else openCell(e.currentTarget, block, key);
                } : undefined}
                style={{ backgroundColor: bgColor, ...(block ? {} : CELL_BORDER_STYLE.get(key)), ...blockBorderStyles.get(key) }}
                className={`w-full h-full ${block ? "cursor-pointer" : ""}`}
              />
            );
          })
        )}

        {/* 블록 중심 아이콘 오버레이 */}
        <div className="absolute inset-0 pointer-events-none">
          {blockCentroids.map(({ block, col, row }, i) => {
            const icon = BLOCK_TYPE_ICON[block.block_type];
            if (!icon) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(col + 0.5) / GRID_COLS * 100}%`,
                  top: `${(row + 0.5) / GRID_ROWS * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Image src={icon} alt={block.block_type} width={10.5} height={10.5} />
              </div>
            );
          })}
        </div>

        {/* 존 레이블 오버레이 */}
        <div className="absolute inset-0 pointer-events-none">
          {[...ZONE_CENTROID.entries()].map(([zone, { col, row }]) => {
            const isVar = isVariableZone(zone);
            return (
              <div
                key={zone}
                className="absolute text-center"
                style={{
                  left: `${(col + 0.5) / GRID_COLS * 100}%`,
                  top: `${(row + 0.5) / GRID_ROWS * 100}%`,
                  transform: "translate(-50%, -50%)",
                  fontSize: isVar ? "7px" : "8.5px",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "rgba(255,255,255,0.55)",
                  textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                  whiteSpace: "pre",
                }}
              >
                {isVar ? getDisplayZoneName(zone) : getDisplayZoneName(zone).replace(" ", "\n")}
              </div>
            );
          })}
        </div>
      </div>

      {active && createPortal(
        <div
          data-union-tooltip
          className="fixed z-[9999] pointer-events-none"
          style={{ width: UNION_TOOLTIP_W, ...active.style }}
        >
          <div
            className="rounded-xl border border-white/10 shadow-2xl backdrop-blur-sm p-3 flex flex-col gap-1.5"
            style={{ background: "#252C34E6" }}
          >
            {/* 블록명 + 계열색 */}
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-sm shrink-0"
                style={{ backgroundColor: BLOCK_TYPE_COLOR[active.block.block_type] ?? "#999" }}
              />
              <Image
                src={`/assets/Union/Grade/Union_Raider_Grade_${getBlockGrade(active.block.block_level)}.png`}
                alt={getBlockGrade(active.block.block_level)}
                width={36} height={36}
                className="w-6 h-4 object-contain object-left"
              />
              <span className="text-sm font-semibold text-white leading-tight">
                {active.block.block_class}
              </span>
            </div>

            {/* 계열 · 레벨 */}
            <div className="flex items-center gap-1.5 pl-[18px]">
              <span className="text-xs text-white/45">{active.block.block_type}</span>
              <span className="text-white/25 text-xs">·</span>
              <span className="text-xs text-white/45">Lv.{active.block.block_level}</span>
            </div>

            {/* 존 정보 */}
            {(() => {
              const zones = getBlockZones(active.block);
              if (zones.length === 0) return null;
              return (
                <div className="mt-0.5 pt-1.5 border-t border-white/10 flex flex-col gap-1">
                  {zones.map(({ zone, count }) => {
                    const isVar = isVariableZone(zone);
                    return (
                      <div key={zone} className="flex items-center gap-1.5 pl-[18px]">
                        <span
                          className="text-[10px] px-1.5 py-px rounded font-medium leading-none shrink-0"
                          style={{
                            background: isVar ? "rgba(96,165,250,0.15)" : "rgba(163,230,53,0.15)",
                            color: isVar ? "#93c5fd" : "#bef264",
                          }}
                        >
                          {isVar ? "가변" : "고정"}
                        </span>
                        <span className="text-xs text-white/60">{getDisplayZoneName(zone)}</span>
                        <span className="text-white/25 text-xs">·</span>
                        <span className="text-xs text-white/35">{count}칸</span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── 안내 버튼 ────────────────────────────────────────────────────────────────

function InfoButton({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const isTouchRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Element)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        className="w-4 h-4 rounded-full border border-zinc-400 dark:border-white/35 text-[10px] font-bold flex items-center justify-center text-zinc-400 dark:text-white/35 hover:text-zinc-600 dark:hover:text-white/60 hover:border-zinc-600 dark:hover:border-white/60 transition-colors cursor-help shrink-0"
        onMouseEnter={() => { if (!isTouchRef.current) setOpen(true); }}
        onMouseLeave={() => { if (!isTouchRef.current) setOpen(false); }}
        onTouchStart={() => { isTouchRef.current = true; }}
        onClick={() => setOpen(o => !o)}
        aria-label="가변 옵션 안내"
      >
        ?
      </button>
      {open && (
        <div
          className="absolute left-0 top-6 z-50 w-64 rounded-xl border border-white/10 shadow-2xl backdrop-blur-sm p-3"
          style={{ background: "#252C34F0" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── 범례 ─────────────────────────────────────────────────────────────────────

function UnionLegend({ blocks }: { blocks: UnionBlock[] }) {
  const types = useMemo(() => {
    const seen = new Map<string, number>();
    for (const b of blocks) {
      seen.set(b.block_type, (seen.get(b.block_type) ?? 0) + 1);
    }
    return [...seen.entries()].sort((a, b) => b[1] - a[1]);
  }, [blocks]);

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {types.map(([type, count]) => (
        <div key={type} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: BLOCK_TYPE_COLOR[type] ?? "#999" }}
          />
          <span className="text-xs text-zinc-500 dark:text-white/55">
            {type} <span className="text-zinc-400 dark:text-white/35">({count})</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── 스탯 섹션 ─────────────────────────────────────────────────────────────────

function StatList({ title, stats }: { title: string; stats: string[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-zinc-500 dark:text-white/50 uppercase tracking-wide">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-300 dark:bg-white/30 shrink-0" />
            <span className="text-xs text-zinc-700 dark:text-white/80">{stat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 서브탭 ────────────────────────────────────────────────────────────────────

type UnionTab = "raider" | "artifact" | "champion";

const UNION_TAB_ICONS: Record<UnionTab, React.ReactNode> = {
  raider:   <LayoutGrid className="w-3.5 h-3.5" />,
  artifact: <Gem className="w-3.5 h-3.5" />,
  champion: <Trophy className="w-3.5 h-3.5" />,
};

const UNION_TABS: { id: UnionTab; label: string }[] = [
  { id: "raider",   label: "유니온 공격대" },
  { id: "artifact", label: "유니온 아티팩트" },
  { id: "champion", label: "유니온 챔피언" },
];

// ─── 유니온 아티팩트 ───────────────────────────────────────────────────────────

const CRYSTAL_MAX_LEVEL = 5;
const EFFECT_MAX_LEVEL = 10;

const CRYSTAL_IMAGE_MAP: Record<string, string> = {
  "주황버섯":  "1_OrangeMushroom",
  "슬라임":    "2_Slime",
  "뿔버섯":    "3_HornyMushroom",
  "스텀프":    "4_Stump",
  "스톤골렘":  "5_StoneGolem",
  "발록":      "6_Balrog",
  "자쿰":      "7_Zakum",
  "핑크빈":    "8_PinkBean",
  "파풀라투스": "9_ Papulatus",
};

function getCrystalImage(crystalName: string, level: number): string {
  const shortName = crystalName.replace("크리스탈 : ", "").trim();
  const key = CRYSTAL_IMAGE_MAP[shortName];
  if (!key) return "";
  const suffix = level >= CRYSTAL_MAX_LEVEL ? "5" : "1_4";
  return `/assets/Artifact/${key}_${suffix}.png`;
}

function CrystalCard({ crystal }: { crystal: import("@/types/character").UnionArtifactCrystal }) {
  const isExpired = crystal.validity_flag === "1";
  const expire = crystal.date_expire
    ? new Date(crystal.date_expire).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })
    : null;
  const imgSrc = getCrystalImage(crystal.name, crystal.level);
  const shortName = crystal.name.replace("크리스탈 : ", "");

  return (
    <div className={`rounded-lg border p-3 flex flex-col gap-2 ${
      isExpired
        ? "border-zinc-200 dark:border-white/10 opacity-50"
        : "border-zinc-200 dark:border-white/15 bg-white/30 dark:bg-white/5"
    }`}>
      {/* 이미지 + 이름 */}
      <div className="flex items-center gap-2">
        {imgSrc && (
          <div className="shrink-0 w-11 h-11 flex items-center justify-center">
            <Image src={imgSrc} alt={shortName} width={167} height={139} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        )}
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs font-semibold text-zinc-700 dark:text-white/80 truncate">
            {shortName}
          </span>
          {/* 레벨 바 */}
          <Image
            src={`/assets/Artifact/Artifact_${isExpired ? "Disable" : "Enable"}_${crystal.level}.png`}
            alt={`Lv.${crystal.level}`}
            width={95}
            height={23}
            style={{ height: "14px", width: "auto" }}
          />
        </div>
      </div>
      {/* 옵션 */}
      <div className="flex flex-col gap-0.5">
        {[crystal.crystal_option_name_1, crystal.crystal_option_name_2, crystal.crystal_option_name_3].map((opt, i) => (
          <div key={i} className="flex items-start gap-1">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-300 dark:bg-white/25 shrink-0" />
            <span className="text-[11px] text-zinc-600 dark:text-white/60 leading-tight">{opt}</span>
          </div>
        ))}
      </div>
      {/* 만료일 */}
      {expire && (
        <p className="text-[10px] text-zinc-400 dark:text-white/30">
          {isExpired ? "만료됨" : `${expire} 만료`}
        </p>
      )}
    </div>
  );
}

function UnionArtifactTab({ character }: { character: Character }) {
  const artifact = character.union_artifact;

  if (
    !artifact ||
    (artifact.union_artifact_effect.length === 0 && artifact.union_artifact_crystal.length === 0)
  ) {
    return (
      <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-6 text-center text-sm text-zinc-400 dark:text-white/40">
        아티팩트 데이터가 없어요
      </div>
    );
  }

  const { union_artifact_effect, union_artifact_crystal, union_artifact_remain_ap } = artifact;

  return (
    <div className="flex flex-col gap-4">
      {/* 효과 */}
      {union_artifact_effect.length > 0 && (
        <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-700 dark:text-white/80">아티팩트 효과</p>
            {union_artifact_remain_ap > 0 && (
              <span className="text-xs text-zinc-400 dark:text-white/40">
                잔여 AP {union_artifact_remain_ap.toLocaleString()}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {union_artifact_effect.map((effect, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex gap-0.5 shrink-0">
                  {Array.from({ length: EFFECT_MAX_LEVEL }, (_, j) => (
                    <div
                      key={j}
                      className={`w-1 h-3 rounded-full ${
                        j < effect.level
                          ? "bg-amber-400 dark:bg-amber-500"
                          : "bg-zinc-200 dark:bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-zinc-700 dark:text-white/75 leading-tight">{effect.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 크리스탈 */}
      {union_artifact_crystal.length > 0 && (
        <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-4 flex flex-col gap-3">
          <p className="text-sm font-semibold text-zinc-700 dark:text-white/80">크리스탈</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {union_artifact_crystal.map((crystal, i) => (
              <CrystalCard key={i} crystal={crystal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 유니온 챔피언 ─────────────────────────────────────────────────────────────


function ChampionCard({ c }: { c: UnionChampion }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const avatarUrl = c.champion_image ?? null;
  const statueUrl = getStatueImage(c.champion_class, c.champion_grade);

  return (
    <Link href={`/character/${encodeURIComponent(c.champion_name)}`} className="rounded-lg border border-zinc-200 dark:border-white/15 bg-white/30 dark:bg-white/5 overflow-hidden flex flex-col hover:ring-2 hover:ring-zinc-300 dark:hover:ring-white/20 transition-shadow">
      {/* 캐릭터 + 조각상 */}
      <div className="relative w-full aspect-[3/2]">
        {/* 조각상 (뒤) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={statueUrl}
          alt=""
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 object-contain object-bottom"
        />
        {/* 캐릭터 (앞, 위로 올림) */}
        {avatarUrl ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <svg className="animate-spin w-6 h-6 text-zinc-300 dark:text-white/20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={c.champion_name}
              onLoad={() => setImgLoaded(true)}
              className={`absolute top-[25%] left-[51%] -translate-x-1/2 w-3/5 object-contain object-top z-10 transition-opacity duration-200 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </>
        ) : (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-zinc-200 dark:bg-white/10 z-10" />
        )}
      </div>

      {/* 텍스트 정보 */}
      <div className="flex flex-col gap-1.5 p-3 pt-2">
        {/* 슬롯 + 등급 + 이름 + 직업 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-medium text-zinc-400 dark:text-white/30">#{c.champion_slot}</span>
          <Image
            src={`/assets/UnionChampion/Grade/Union_Champion_Grade_${c.champion_grade}.png`}
            alt={c.champion_grade}
            width={36} height={36}
            className="w-7 h-4 object-contain object-left"
          />
          <span className="text-xs font-semibold text-zinc-700 dark:text-white/80 truncate">{c.champion_name}</span>
          <span className="text-[10px] text-zinc-400 dark:text-white/35 ml-auto shrink-0">{c.champion_class}</span>
        </div>
        {/* 휘장 */}
        <div className="flex justify-center items-center w-full px-2">
          {([
            [1, "B"],
            [2, "A"],
            [3, "S"],
            [4, "SS"],
            [5, "SSS"],
          ] as [number, string][]).map(([n, grade]) => {
            const enabled = c.champion_badge_info.length >= n;
            return (
              <Image
                key={grade}
                src={`/assets/UnionChampion/Insignia/${n}_UnionChampion_Insignia_${grade}_${enabled ? "Enable" : "Disable"}.png`}
                alt={grade}
                width={48}
                height={48}
                className="w-10 h-14 object-contain"
              />
            );
          })}
        </div>
        {/* 배지 스탯 */}
        <div className="flex flex-col gap-0.5">
          {c.champion_badge_info.map((b, i) => (
            <div key={i} className="flex items-start gap-1">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-300 dark:bg-white/25 shrink-0" />
              <span className="text-[11px] text-zinc-600 dark:text-white/60 leading-tight">{b.stat}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

function UnionChampionTab({ character }: { character: Character }) {
  const champion = character.union_champion;

  if (!champion || champion.union_champion.length === 0) {
    return (
      <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-6 text-center text-sm text-zinc-400 dark:text-white/40">
        챔피언 데이터가 없어요
      </div>
    );
  }

  const { union_champion, champion_badge_total_info } = champion;

  return (
    <div className="flex flex-col gap-4">
      {/* 총 배지 효과 */}
      {champion_badge_total_info.length > 0 && (
        <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-4 flex flex-col gap-3">
          <p className="text-sm font-semibold text-zinc-700 dark:text-white/80">총 배지 효과</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {champion_badge_total_info.map((item, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-300 dark:bg-white/30 shrink-0" />
                <span className="text-xs text-zinc-700 dark:text-white/80">{item.stat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 챔피언 목록 */}
      {union_champion.length > 0 && (
        <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-4 flex flex-col gap-3">
          <p className="text-sm font-semibold text-zinc-700 dark:text-white/80">챔피언</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {union_champion.map((c) => (
              <ChampionCard key={c.champion_slot} c={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export function UnionChip({ character }: { character: Character }) {
  const [activeTab, setActiveTab] = useState<UnionTab>("raider");
  const raider = character.union_raider;
  const inUsePreset = raider?.use_preset_no ?? 1;
  const [selectedPreset, setSelectedPreset] = useState<number>(inUsePreset);

  if (!raider) {
    return (
      <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-6 text-center text-sm text-zinc-400 dark:text-white/40">
        유니온 데이터가 없어요
      </div>
    );
  }

  const presetKey = `union_raider_preset_${selectedPreset}` as
    | "union_raider_preset_1" | "union_raider_preset_2" | "union_raider_preset_3"
    | "union_raider_preset_4" | "union_raider_preset_5";
  const currentPreset = raider[presetKey] ?? {
    union_raider_stat: raider.union_raider_stat,
    union_occupied_stat: raider.union_occupied_stat,
    union_block: raider.union_block,
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 탭 헤더 */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {UNION_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
              activeTab === tab.id
                ? "border-base-content/30 bg-base-content/10 text-base-content"
                : "border-base-300 bg-base-200/30 text-base-content/50 hover:bg-base-200/60",
            ].join(" ")}
          >
            {UNION_TAB_ICONS[tab.id]}
            {tab.label}
          </button>
        ))}
        {character.union_level != null && (
          <span className="ml-auto text-xs text-zinc-400 dark:text-white/40">
            Lv.{character.union_level.toLocaleString()}
            {character.union_grade && ` · ${character.union_grade}`}
          </span>
        )}
      </div>

      {/* 유니온 공격대 탭 */}
      {activeTab === "raider" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-4 flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-zinc-700 dark:text-white/80">유니온 공격대 배치</p>
              <InfoButton>
                <p className="text-xs text-white/70 leading-relaxed">
                  가변 옵션 구역은 점령 보너스 스탯을 기반으로 추론한 값이에요.
                  <br />
                  고유하게 특정되지 않은 구역은 기본값으로 표시되며, 실제 설정과 다를 수 있어요.
                </p>
              </InfoButton>
              <div className="ml-auto flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setSelectedPreset(n)}
                    className={`w-5 h-5 rounded text-[10px] font-medium transition-colors border ${
                      selectedPreset === n
                        ? "bg-zinc-700 dark:bg-white/20 text-white border-transparent"
                        : "bg-zinc-200 dark:bg-white/5 text-zinc-400 dark:text-white/30 hover:bg-zinc-300 dark:hover:bg-white/10 border-transparent"
                    } ${inUsePreset === n ? "ring-1 ring-zinc-400 dark:ring-white/40" : ""}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <UnionGrid blocks={currentPreset.union_block} occupiedStats={currentPreset.union_occupied_stat} />
            <UnionLegend blocks={currentPreset.union_block} />
          </div>

          {currentPreset.union_raider_stat.length > 0 && (
            <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-4">
              <StatList title="배치 보너스 스탯" stats={currentPreset.union_raider_stat} />
            </div>
          )}

          {currentPreset.union_occupied_stat.length > 0 && (
            <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-4">
              <StatList title="점령 보너스 스탯" stats={currentPreset.union_occupied_stat} />
            </div>
          )}
        </div>
      )}

      {/* 유니온 아티팩트 탭 */}
      {activeTab === "artifact" && <UnionArtifactTab character={character} />}

      {/* 유니온 챔피언 탭 */}
      {activeTab === "champion" && <UnionChampionTab character={character} />}
    </div>
  );
}
