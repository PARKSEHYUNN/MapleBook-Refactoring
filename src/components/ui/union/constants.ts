import { ZONE_MAP } from "./zoneMap";

export const GRID_COLS = 22;
export const GRID_ROWS = 20;
export const UNION_TOOLTIP_W = 200;

export const BLOCK_TYPE_COLOR: Record<string, string> = {
  전사: "#f87171",
  마법사: "#38bdf8",
  궁수: "#4ade80",
  도적: "#c084fc",
  해적: "#94a3b8",
  하이브리드: "#facc15",
  "메이플 M 캐릭터": "#f472b6",
};

export const BLOCK_TYPE_ICON: Record<string, string> = {
  전사: "/Union/ClassIcon_Warrior.png",
  마법사: "/Union/ClassIcon_Mage.png",
  궁수: "/Union/ClassIcon_Archer.png",
  도적: "/Union/ClassIcon_Rogue.png",
  해적: "/Union/ClassIcon_Pirates.png",
  하이브리드: "/Union/ClassIcon_Hybrid.png",
  "메이플 M 캐릭터": "/Union/ClassIcon_Mobile.png",
};

export const ZONE_EMPTY_COLOR: Record<string, string> = {
  "1": "rgba(148,163,184,0.32)",
  "2": "rgba(251,191,36,0.28)",
  "3": "rgba(167,139,250,0.32)",
  "4": "rgba(96,165,250,0.32)",
  "5": "rgba(52,211,153,0.28)",
  "6": "rgba(251,113,133,0.28)",
  "7": "rgba(251,146,60,0.28)",
  "8": "rgba(250,204,21,0.28)",
};

export const STAT_PASTEL_COLOR: Record<string, string> = {
  STR: "rgba(252,165,165,0.35)",
  DEX: "rgba(134,239,172,0.35)",
  INT: "rgba(147,197,253,0.35)",
  LUK: "rgba(196,181,253,0.35)",
  공격력: "rgba(253,186,116,0.35)",
  마력: "rgba(103,232,249,0.35)",
  HP: "rgba(253,164,175,0.35)",
  MP: "rgba(125,211,252,0.35)",
};

export const FIXED_ZONE_NAME: Record<string, string> = {
  "1": "상태이상 내성",
  "2": "획득 경험치",
  "3": "크리티컬 데미지",
  "4": "크리티컬 확률",
  "5": "방어율 무시",
  "6": "보스 데미지",
  "7": "버프 지속시간",
  "8": "일반 데미지",
};

export const VARIABLE_ZONE_DEFAULT: Record<string, string> = {
  A: "공격력",
  B: "STR",
  C: "LUK",
  D: "HP",
  E: "DEX",
  F: "INT",
  G: "마력",
  H: "MP",
};

export const VARIABLE_STAT_PARSE_ORDER = ["STR", "DEX", "INT", "LUK", "공격력", "마력", "HP", "MP"];

export function getZone(col: number, row: number): string | null {
  return ZONE_MAP[row]?.[col] ?? null;
}

export function isVariableZone(zone: string): boolean {
  return zone >= "A" && zone <= "H";
}

export const ZONE_CENTROID: Map<string, { col: number; row: number }> = (() => {
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

export const ZONE_BORDER = "1px solid rgba(255,255,255,0.22)";

export const CELL_BORDER_STYLE: Map<string, React.CSSProperties> = (() => {
  const map = new Map<string, React.CSSProperties>();
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const zone = ZONE_MAP[row][col];
      const style: React.CSSProperties = {};
      if (col < GRID_COLS - 1 && ZONE_MAP[row][col + 1] !== zone) {
        style.borderRight = ZONE_BORDER;
      }
      if (row < GRID_ROWS - 1 && ZONE_MAP[row + 1][col] !== zone) {
        style.borderBottom = ZONE_BORDER;
      }
      if (Object.keys(style).length > 0) {
        map.set(`${col},${row}`, style);
      }
    }
  }
  return map;
})();
