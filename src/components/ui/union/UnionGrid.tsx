"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { createPortal } from "react-dom";

import { TOOLTIP_OPEN_EVENT } from "@/hooks/useEquipTooltip";
import type { UnionBlock } from "@/types/character";

import {
  BLOCK_TYPE_COLOR,
  BLOCK_TYPE_ICON,
  CELL_BORDER_STYLE,
  getZone,
  GRID_COLS,
  GRID_ROWS,
  isVariableZone,
  STAT_PASTEL_COLOR,
  UNION_TOOLTIP_W,
  ZONE_CENTROID,
  ZONE_EMPTY_COLOR,
} from "./constants";
import {
  buildBlockBorderStyles,
  buildBlockCentroids,
  buildCellMap,
  calcUnionTooltipPos,
  getBlockGrade,
  getBlockZones,
  getZoneName,
  inferVariableZoneNames,
} from "./utils";

type ActiveCell = { block: UnionBlock; style: React.CSSProperties } | null;

export function UnionGrid({
  blocks,
  occupiedStats,
}: {
  blocks: UnionBlock[];
  occupiedStats: string[];
}) {
  const cellMap = useMemo(() => buildCellMap(blocks), [blocks]);
  const { inferred: inferredZoneNames, zoneCells } = useMemo(
    () => inferVariableZoneNames(blocks, occupiedStats),
    [blocks, occupiedStats],
  );
  const blockBorderStyles = useMemo(() => buildBlockBorderStyles(cellMap), [cellMap]);
  const blockCentroids = useMemo(() => buildBlockCentroids(blocks), [blocks]);

  const varZoneDisplay = useMemo((): Record<string, string> => {
    const display: Record<string, string> = {};
    const usedStats = new Set(Object.values(inferredZoneNames));

    for (const [zone, stat] of Object.entries(inferredZoneNames)) {
      display[zone] = stat;
    }
    for (const [zone, def] of Object.entries({
      A: "공격력",
      B: "STR",
      C: "LUK",
      D: "HP",
      E: "DEX",
      F: "INT",
      G: "마력",
      H: "MP",
    })) {
      if (display[zone]) {
        continue;
      }
      if ((zoneCells[zone] ?? 0) === 0 && !usedStats.has(def)) {
        display[zone] = def;
        usedStats.add(def);
      }
    }
    const remaining = Object.values({
      A: "공격력",
      B: "STR",
      C: "LUK",
      D: "HP",
      E: "DEX",
      F: "INT",
      G: "마력",
      H: "MP",
    }).filter((s) => !usedStats.has(s));
    let ri = 0;
    for (const zone of Object.keys({
      A: "공격력",
      B: "STR",
      C: "LUK",
      D: "HP",
      E: "DEX",
      F: "INT",
      G: "마력",
      H: "MP",
    })) {
      if (display[zone]) {
        continue;
      }
      if ((zoneCells[zone] ?? 0) === 0) {
        display[zone] = remaining[ri++] ?? zone;
      }
    }
    return display;
  }, [inferredZoneNames, zoneCells]);

  const getDisplayZoneName = (zone: string): string => {
    if (!isVariableZone(zone)) {
      return getZoneName(zone);
    }
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
    if (!active) {
      return;
    }
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Element;
      if (!target.closest("[data-union-tooltip]") && !target.closest("[data-union-cell]")) {
        closeCell();
      }
    };
    const handleOtherOpen = (e: Event) => {
      if ((e as CustomEvent).detail !== gridRef) {
        closeCell();
      }
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
              bgColor = BLOCK_TYPE_COLOR[block.block_type] ?? "rgba(255,255,255,0.2)";
            } else if (isCenter) {
              bgColor = "rgba(255,255,255,0.15)";
            } else if (zone && isVariableZone(zone)) {
              const statName = varZoneDisplay[zone];
              bgColor =
                (statName ? STAT_PASTEL_COLOR[statName] : undefined) ?? "rgba(255,255,255,0.12)";
            } else {
              bgColor = (zone ? ZONE_EMPTY_COLOR[zone] : undefined) ?? "transparent";
            }

            return (
              <div
                key={key}
                data-union-cell
                onMouseEnter={
                  block
                    ? (e) => {
                        if (!isTouchRef.current) {
                          openCell(e.currentTarget, block, key);
                        }
                      }
                    : undefined
                }
                onMouseLeave={
                  block
                    ? () => {
                        if (!isTouchRef.current) {
                          closeCell();
                        }
                      }
                    : undefined
                }
                onTouchStart={() => {
                  isTouchRef.current = true;
                }}
                onClick={
                  block
                    ? (e) => {
                        if (activeKeyRef.current === key) {
                          closeCell();
                        } else {
                          openCell(e.currentTarget, block, key);
                        }
                      }
                    : undefined
                }
                style={{
                  backgroundColor: bgColor,
                  ...(block ? {} : CELL_BORDER_STYLE.get(key)),
                  ...blockBorderStyles.get(key),
                }}
                className={`w-full h-full ${block ? "cursor-pointer" : ""}`}
              />
            );
          }),
        )}

        <div className="absolute inset-0 pointer-events-none">
          {blockCentroids.map(({ block, col, row }, i) => {
            const icon = BLOCK_TYPE_ICON[block.block_type];
            if (!icon) {
              return null;
            }
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${((col + 0.5) / GRID_COLS) * 100}%`,
                  top: `${((row + 0.5) / GRID_ROWS) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Image src={icon} alt={block.block_type} width={10.5} height={10.5} />
              </div>
            );
          })}
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...ZONE_CENTROID.entries()].map(([zone, { col, row }]) => {
            const isVar = isVariableZone(zone);
            return (
              <div
                key={zone}
                className="absolute text-center"
                style={{
                  left: `${((col + 0.5) / GRID_COLS) * 100}%`,
                  top: `${((row + 0.5) / GRID_ROWS) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  fontSize: "10px",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "rgba(255,255,255,1)",
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

      {active &&
        createPortal(
          <div
            data-union-tooltip
            className="fixed z-9999 pointer-events-none"
            style={{ width: UNION_TOOLTIP_W, ...active.style }}
          >
            <div
              className="rounded-xl border border-white/10 shadow-2xl backdrop-blur-sm p-3 flex flex-col gap-1.5"
              style={{ background: "#252C34E6" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-sm shrink-0"
                  style={{ backgroundColor: BLOCK_TYPE_COLOR[active.block.block_type] ?? "#999" }}
                />
                <Image
                  src={`/Union/Grade/Union_Raider_Grade_${getBlockGrade(active.block.block_level)}.png`}
                  alt={getBlockGrade(active.block.block_level)}
                  width={36}
                  height={36}
                  className="w-6 h-4 object-contain object-left"
                />
                <span className="text-sm font-semibold text-white leading-tight">
                  {active.block.block_class}
                </span>
              </div>

              <div className="flex items-center gap-1.5 pl-4.5">
                <span className="text-xs text-white/45">{active.block.block_type}</span>
                <span className="text-white/25 text-xs">·</span>
                <span className="text-xs text-white/45">Lv.{active.block.block_level}</span>
              </div>

              {(() => {
                const zones = getBlockZones(active.block);
                if (zones.length === 0) {
                  return null;
                }
                return (
                  <div className="mt-0.5 pt-1.5 border-t border-white/10 flex flex-col gap-1">
                    {zones.map(({ zone, count }) => {
                      const isVar = isVariableZone(zone);
                      return (
                        <div key={zone} className="flex items-center gap-1.5 pl-4.5">
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
          document.body,
        )}
    </div>
  );
}
