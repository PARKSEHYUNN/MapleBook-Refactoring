"use client";

import Image from "next/image";

import { UnionRaiderType } from "@/types/character";

type Cell = '1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H';

const GRID: Cell[][] = [
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


const CELL_COLOR: Record<Cell, string> = {
  '1': 'rgba(255,220,130,0.55)',
  '2': 'rgba(150,230,180,0.55)',
  '3': 'rgba(255,170,170,0.55)',
  '4': 'rgba(170,205,255,0.55)',
  '5': 'rgba(210,185,255,0.55)',
  '6': 'rgba(255,195,150,0.55)',
  '7': 'rgba(150,230,220,0.55)',
  '8': 'rgba(255,185,215,0.55)',
  'A': 'rgba(255,200,100,0.75)',
  'B': 'rgba(255,150,150,0.75)',
  'C': 'rgba(130,210,160,0.75)',
  'D': 'rgba(255,160,200,0.75)',
  'E': 'rgba(150,185,255,0.75)',
  'F': 'rgba(200,160,255,0.75)',
  'G': 'rgba(120,215,230,0.75)',
  'H': 'rgba(140,200,255,0.75)',
};

// leftPct = (col + 0.5) / 22 * 100,  topPct = (row + 0.5) / 20 * 100
const ZONE_LABELS: { id: Cell; label: string; leftPct: number; topPct: number; fontSize: number }[] = [
  { id: '1', label: '상태이상 내성',   leftPct: (6    /22)*100, topPct: (2.5 /20)*100, fontSize: 11 },
  { id: '2', label: '획득 경험치',     leftPct: (16   /22)*100, topPct: (2.5 /20)*100, fontSize: 11 },
  { id: '3', label: '크리티컬\n데미지', leftPct: (2.5  /22)*100, topPct: (7.5 /20)*100, fontSize: 9  },
  { id: '4', label: '크리티컬\n확률',  leftPct: (19.5 /22)*100, topPct: (7.5 /20)*100, fontSize: 9  },
  { id: '5', label: '방어율\n무시',    leftPct: (2.5  /22)*100, topPct: (13.5/20)*100, fontSize: 9  },
  { id: '6', label: '보스\n데미지',    leftPct: (19.5 /22)*100, topPct: (13.5/20)*100, fontSize: 9  },
  { id: '7', label: '버프 지속시간',   leftPct: (7    /22)*100, topPct: (18  /20)*100, fontSize: 11 },
  { id: '8', label: '일반 데미지',     leftPct: (15.5 /22)*100, topPct: (18  /20)*100, fontSize: 11 },
  { id: 'A', label: '공격력',          leftPct: (7    /22)*100, topPct: (7.5 /20)*100, fontSize: 9  },
  { id: 'B', label: 'STR',             leftPct: (9    /22)*100, topPct: (6.5 /20)*100, fontSize: 9  },
  { id: 'C', label: 'LUK',             leftPct: (13   /22)*100, topPct: (6.5 /20)*100, fontSize: 9  },
  { id: 'D', label: 'HP',              leftPct: (15   /22)*100, topPct: (7.5 /20)*100, fontSize: 9  },
  { id: 'E', label: 'DEX',             leftPct: (7    /22)*100, topPct: (11.5/20)*100, fontSize: 9  },
  { id: 'F', label: 'INT',             leftPct: (9.5  /22)*100, topPct: (13.5/20)*100, fontSize: 9  },
  { id: 'G', label: '마력',            leftPct: (12.5 /22)*100, topPct: (13.5/20)*100, fontSize: 9  },
  { id: 'H', label: 'MP',              leftPct: (15   /22)*100, topPct: (11.5/20)*100, fontSize: 9  },
];

const CELL_TITLE = Object.fromEntries(
  ZONE_LABELS.map(({ id, label }) => [id, label.replace('\n', ' ')])
) as Record<Cell, string>;

const BLOCK_PALETTE = [
  '#ff6b6b', '#ffa94d', '#ffd43b', '#a9e34b',
  '#38d9a9', '#4dabf7', '#748ffc', '#da77f2',
  '#f783ac', '#63e6be', '#74c0fc', '#e599f7',
  '#ff8787', '#66d9e8', '#51cf66', '#ffa8a8',
];

const BLOCK_TYPE_TO_ICON: Record<string, string> = {
  '전사형': 'ClassIcon_Warrior.png',
  '마법사형': 'ClassIcon_Mage.png',
  '궁수형': 'ClassIcon_Archer.png',
  '도적형': 'ClassIcon_Rogue.png',
  '해적형': 'ClassIcon_Pirates.png',
  '이동형': 'ClassIcon_Mobile.png',
  '혼합형': 'ClassIcon_Hybrid.png',
};

export default function UnionRaidGrid({ unionRaider }: { unionRaider: UnionRaiderType | null }) {
  const cellColorMap = new Map<string, string>();
  const controlPoints: { col: number; row: number; blockType: string }[] = [];

  if (unionRaider) {
    unionRaider.union_block.forEach((block, idx) => {
      const color = BLOCK_PALETTE[idx % BLOCK_PALETTE.length];
      for (const pos of block.block_position) {
        cellColorMap.set(`${pos.x + 10},${9 - pos.y}`, color);
      }
      const cp = block.block_control_point;
      controlPoints.push({ col: cp.x + 10, row: 9 - cp.y, blockType: block.block_type });
    });
  }

  return (
    <div
      className="w-4/5 mx-auto rounded-xl overflow-hidden relative"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(22, 1fr)',
        gridTemplateRows: 'repeat(20, 1fr)',
        aspectRatio: '22 / 20',
        background: 'rgba(0,0,0,0.1)',
      }}
    >
      {GRID.flat().map((cell, i) => {
        const col = i % 22;
        const row = Math.floor(i / 22);
        const blockColor = cellColorMap.get(`${col},${row}`);
        let bg: string;
        if (blockColor) {
          bg = blockColor + 'cc';
        } else if (unionRaider) {
          bg = CELL_COLOR[cell].replace(
            /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
            (_, r, g, b) => `rgba(${r},${g},${b},0.12)`,
          );
        } else {
          bg = CELL_COLOR[cell];
        }
        return (
          <div
            key={i}
            title={CELL_TITLE[cell]}
            style={{ backgroundColor: bg }}
          />
        );
      })}

      {ZONE_LABELS.map(({ id, label, leftPct, topPct, fontSize }) => (
        <div
          key={id}
          className="absolute pointer-events-none select-none font-bold text-white text-center leading-tight"
          style={{
            left: `${leftPct}%`,
            top: `${topPct}%`,
            fontSize,
            transform: 'translate(-50%, -50%)',
            textShadow: '0 1px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)',
            whiteSpace: 'pre-line',
          }}
        >
          {label}
        </div>
      ))}

      {controlPoints.map(({ col, row, blockType }, idx) => {
        const icon = BLOCK_TYPE_TO_ICON[blockType];
        if (!icon) return null;
        return (
          <div
            key={idx}
            className="absolute pointer-events-none"
            style={{
              left: `${(col + 0.5) / 22 * 100}%`,
              top: `${(row + 0.5) / 20 * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: '4.5%',
              aspectRatio: '1',
              position: 'absolute',
            }}
          >
            <Image
              src={`/Union/${icon}`}
              alt={blockType}
              fill
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.9))' }}
            />
          </div>
        );
      })}
    </div>
  );
}
