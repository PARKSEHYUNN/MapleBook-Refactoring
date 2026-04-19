import type { UnionBlock } from "@/types/character";

import {
  GRID_COLS,
  GRID_ROWS,
  UNION_TOOLTIP_W,
  FIXED_ZONE_NAME,
  VARIABLE_ZONE_DEFAULT,
  VARIABLE_STAT_PARSE_ORDER,
  getZone,
  isVariableZone,
} from "./constants";

export function getZoneName(zone: string): string {
  return FIXED_ZONE_NAME[zone] ?? VARIABLE_ZONE_DEFAULT[zone] ?? zone;
}

export function getExpectedStatAmount(cells: number, stat: string): number {
  if (cells <= 0) return 0;
  if (["STR", "DEX", "INT", "LUK"].includes(stat)) return cells * 5;
  if (["공격력", "마력"].includes(stat)) return cells;
  if (["HP", "MP"].includes(stat)) return cells * 250;
  return 0;
}

export function parseVariableOccupiedStats(occupiedStats: string[]): { stat: string; amount: number }[] {
  const result: { stat: string; amount: number }[] = [];
  for (const s of occupiedStats) {
    for (const stat of VARIABLE_STAT_PARSE_ORDER) {
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

export function inferVariableZoneNames(
  blocks: UnionBlock[],
  occupiedStats: string[],
): {
  inferred: Record<string, string>;
  zoneCells: Record<string, number>;
  occupiedStatSet: Set<string>;
} {
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

    for (const { stat, amount } of parsedStats) {
      if (usedStats.has(stat)) continue;
      const candidates = Object.entries(zoneCells).filter(
        ([zone, cells]) =>
          !usedZones.has(zone) && cells > 0 && getExpectedStatAmount(cells, stat) === amount,
      );
      if (candidates.length === 1) {
        result[candidates[0][0]] = stat;
        usedZones.add(candidates[0][0]);
        usedStats.add(stat);
        changed = true;
      }
    }

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

  for (const stat of VARIABLE_STAT_PARSE_ORDER) {
    if (usedStats.has(stat)) continue;
    const statEntry = parsedStats.find(({ stat: s }) => s === stat);
    if (!statEntry) continue;
    const candidates = Object.entries(zoneCells)
      .filter(
        ([zone, cells]) =>
          !usedZones.has(zone) &&
          cells > 0 &&
          getExpectedStatAmount(cells, stat) === statEntry.amount,
      )
      .sort(([a], [b]) => a.localeCompare(b));
    if (!candidates.length) continue;
    const preferred =
      candidates.find(([zone]) => VARIABLE_ZONE_DEFAULT[zone] === stat) ?? candidates[0];
    result[preferred[0]] = stat;
    usedZones.add(preferred[0]);
    usedStats.add(stat);
  }

  return { inferred: result, zoneCells, occupiedStatSet };
}

export function getBlockZones(block: UnionBlock): { zone: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const pos of block.block_position) {
    const { col, row } = toCell(pos.x, pos.y);
    const zone = getZone(col, row);
    if (zone) {
      counts[zone] = (counts[zone] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([zone, count]) => ({ zone, count }));
}

export function toCell(x: number, y: number) {
  return { col: x + 11, row: 10 - y };
}

export function buildCellMap(blocks: UnionBlock[]): Map<string, UnionBlock> {
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

export function getBlockGrade(level: string): string {
  const lv = parseInt(level, 10);
  if (lv >= 250) return "SSS";
  if (lv >= 200) return "SS";
  if (lv >= 140) return "S";
  if (lv >= 100) return "A";
  return "B";
}

export function calcUnionTooltipPos(el: HTMLElement): React.CSSProperties {
  const rect = el.getBoundingClientRect();
  const MARGIN = 8;
  let left = rect.left;
  if (left + UNION_TOOLTIP_W > window.innerWidth - MARGIN) {
    left = window.innerWidth - UNION_TOOLTIP_W - MARGIN;
  }
  if (left < MARGIN) left = MARGIN;
  if (rect.top > window.innerHeight * 0.5) {
    return { bottom: window.innerHeight - rect.top + MARGIN, left };
  }
  return { top: rect.bottom + MARGIN, left };
}

export function buildBlockBorderStyles(
  cellMap: Map<string, UnionBlock>,
): Map<string, React.CSSProperties> {
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

export function buildBlockCentroids(
  blocks: UnionBlock[],
): { block: UnionBlock; col: number; row: number }[] {
  return blocks.flatMap((block) => {
    const cp = block.block_control_point;
    if (cp == null) return [];
    const { col, row } = toCell(cp.x, cp.y);
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return [];
    return [{ block, col, row }];
  });
}
