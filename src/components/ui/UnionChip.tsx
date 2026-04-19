"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Gem, Info, LayoutGrid, Trophy } from "lucide-react";

import type {
  CharacterUnion,
  UnionArtifactType,
  UnionBlock,
  UnionChampionType,
  UnionRaiderType,
} from "@/types/character";

import { BLOCK_TYPE_COLOR } from "./union/constants";
import { UnionArtifact } from "./union/UnionArtifact";
import { UnionGrid } from "./union/UnionGrid";

// ─── 로컬 타입 ────────────────────────────────────────────────────────────────

interface Character {
  union_level?: number | null;
  union_grade?: string | null;
  union_json?: CharacterUnion | null;
  union_raider: UnionRaiderType | null;
  union_artifact: UnionArtifactType | null;
  union_champion: UnionChampionType | null;
}

// ─── 탭 ───────────────────────────────────────────────────────────────────────

type UnionTab = "basic" | "raider" | "artifact" | "champion";

const UNION_TABS: { id: UnionTab; label: string; icon: React.ElementType }[] = [
  { id: "basic", label: "기본", icon: Info },
  { id: "raider", label: "레이더", icon: LayoutGrid },
  { id: "artifact", label: "아티팩트", icon: Gem },
  { id: "champion", label: "챔피언", icon: Trophy },
];

// ─── 안내 버튼 ────────────────────────────────────────────────────────────────

function BadgeTooltip({ stat, children }: { stat: string | null; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const isTouchRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Element)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  if (!stat) {
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        if (!isTouchRef.current) {
          setOpen(true);
        }
      }}
      onMouseLeave={() => {
        if (!isTouchRef.current) {
          setOpen(false);
        }
      }}
      onTouchStart={() => {
        isTouchRef.current = true;
        setOpen((o) => !o);
      }}
    >
      {children}
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 w-max max-w-40 rounded-lg border border-white/10 bg-[#252C34F0] px-2 py-1 text-[10px] text-white/80 shadow-xl text-center">
          {stat}
        </div>
      )}
    </div>
  );
}

function InfoButton({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const isTouchRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Element)) {
        setOpen(false);
      }
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
        onMouseEnter={() => {
          if (!isTouchRef.current) {
            setOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (!isTouchRef.current) {
            setOpen(false);
          }
        }}
        onTouchStart={() => {
          isTouchRef.current = true;
        }}
        onClick={() => setOpen((o) => !o)}
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
  if (stats.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-zinc-500 dark:text-white/50 uppercase tracking-wide">
        {title}
      </p>
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

// ─── 챔피언 배경 ──────────────────────────────────────────────────────────────

const CLASS_TO_JOB_TYPE: Record<string, string> = {
  // 전사
  히어로: "전사",
  팔라딘: "전사",
  다크나이트: "전사",
  소울마스터: "전사",
  미하일: "전사",
  아란: "전사",
  데몬슬레이어: "전사",
  데몬어벤져: "전사",
  블래스터: "전사",
  카이저: "전사",
  제로: "전사",
  아델: "전사",
  렌: "전사",
  // 마법사
  "아크메이지(불,독)": "마법사",
  "아크메이지(썬,콜)": "마법사",
  비숍: "마법사",
  플레임위자드: "마법사",
  에반: "마법사",
  루미너스: "마법사",
  배틀메이지: "마법사",
  키네시스: "마법사",
  일리움: "마법사",
  라라: "마법사",
  // 궁수
  보우마스터: "궁수",
  신궁: "궁수",
  패스파인더: "궁수",
  윈드브레이커: "궁수",
  메르세데스: "궁수",
  와일드헌터: "궁수",
  카인: "궁수",
  // 도적
  나이트로드: "도적",
  섀도어: "도적",
  듀얼블레이드: "도적",
  나이트워커: "도적",
  팬텀: "도적",
  제논: "도적",
  카데나: "도적",
  칼리: "도적",
  호영: "도적",
  // 해적
  바이퍼: "해적",
  캡틴: "해적",
  캐논마스터: "해적",
  스트라이커: "해적",
  은월: "해적",
  메카닉: "해적",
  엔젤릭버스터: "해적",
  아크: "해적",
};

const JOB_TYPE_TO_STATUE: Record<string, [number, string]> = {
  전사: [1, "Warrior"],
  마법사: [2, "Mage"],
  궁수: [3, "Archer"],
  도적: [4, "Rouge"],
  해적: [5, "Pirate"],
};

const GRADE_TO_STATUE_NUM: Record<string, number> = {
  B: 1,
  A: 2,
  S: 3,
  SS: 4,
  SSS: 5,
};

const JOB_TYPE_TO_CLASS_ICON: Record<string, string> = {
  전사: "Warrior",
  마법사: "Mage",
  궁수: "Archer",
  도적: "Rogue",
  해적: "Pirates",
};

function getClassIcon(championClass: string): string | null {
  const jobType = CLASS_TO_JOB_TYPE[championClass];
  if (!jobType) {
    return null;
  }
  const icon = JOB_TYPE_TO_CLASS_ICON[jobType];
  if (!icon) {
    return null;
  }
  return `/Union/ClassIcon_${icon}.png`;
}

type Offset = { scale: number; tx: number; ty: number };
const DEFAULT_OFFSET: Offset = { scale: 2, tx: 2, ty: -14 };

const JOB_TYPE_IMAGE_OFFSET: Record<string, Partial<Record<string, Offset>>> = {
  전사: {
    B: DEFAULT_OFFSET,
    A: DEFAULT_OFFSET,
    S: DEFAULT_OFFSET,
    SS: DEFAULT_OFFSET,
    SSS: DEFAULT_OFFSET,
  },
  마법사: {
    B: DEFAULT_OFFSET,
    A: DEFAULT_OFFSET,
    S: DEFAULT_OFFSET,
    SS: DEFAULT_OFFSET,
    SSS: DEFAULT_OFFSET,
  },
  궁수: {
    B: DEFAULT_OFFSET,
    A: DEFAULT_OFFSET,
    S: DEFAULT_OFFSET,
    SS: DEFAULT_OFFSET,
    SSS: DEFAULT_OFFSET,
  },
  도적: {
    B: DEFAULT_OFFSET,
    A: DEFAULT_OFFSET,
    S: DEFAULT_OFFSET,
    SS: DEFAULT_OFFSET,
    SSS: DEFAULT_OFFSET,
  },
  해적: {
    B: DEFAULT_OFFSET,
    A: DEFAULT_OFFSET,
    S: DEFAULT_OFFSET,
    SS: DEFAULT_OFFSET,
    SSS: DEFAULT_OFFSET,
  },
};

const CHAMPION_BG_FALLBACK = "/Union/Champion/0_UnionChampion_Statue_None_0.png";

function getChampionBg(championClass: string, championGrade: string): string {
  const jobType = CLASS_TO_JOB_TYPE[championClass];
  if (!jobType) {
    return CHAMPION_BG_FALLBACK;
  }
  const statue = JOB_TYPE_TO_STATUE[jobType];
  if (!statue) {
    return CHAMPION_BG_FALLBACK;
  }
  const gradeNum = GRADE_TO_STATUE_NUM[championGrade];
  if (!gradeNum) {
    return CHAMPION_BG_FALLBACK;
  }
  return `/Union/Champion/${statue[0]}_UnionChampion_Statue_${statue[1]}_${gradeNum}.png`;
}

// ─── 유니온 등급 아이콘 ────────────────────────────────────────────────────────

const UNION_GRADE_ICON_MAP: Record<string, string> = {
  "노비스 유니온": "1_UnionGrade_Novice",
  "베테랑 유니온": "2_UnionGrade_Veteran",
  "마스터 유니온": "3_UnionGrade_Master",
  "그랜드 마스터 유니온": "4_UnionGrade_GrandMaster",
  "슈프림 유니온": "5_UnionGrade_ Supreme",
};

const UNION_GRADE_MAX_BASE: Record<string, number> = {
  "노비스 유니온": 8,
  "베테랑 유니온": 17,
  "마스터 유니온": 26,
  "그랜드 마스터 유니온": 35,
  "슈프림 유니온": 40,
};

function getUnionMaxCount(grade: string | null | undefined): number {
  if (!grade) {
    return 0;
  }
  const match = grade.match(/^(.+)\s+(\d+)$/);
  if (!match) {
    return 0;
  }
  const base = UNION_GRADE_MAX_BASE[match[1]];
  return base !== undefined ? base + parseInt(match[2]) : 0;
}

function getUnionGradeIcon(grade: string | null | undefined): string | null {
  if (!grade) {
    return null;
  }
  const match = grade.match(/^(.+)\s+(\d+)$/);
  if (!match) {
    return null;
  }
  const prefix = UNION_GRADE_ICON_MAP[match[1]];
  if (!prefix) {
    return null;
  }
  return `/Union/${prefix}_${match[2]}.png`;
}

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export function UnionChip({ character }: { character: Character }) {
  const [activeTab, setActiveTab] = useState<UnionTab>("basic");
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
    | "union_raider_preset_1"
    | "union_raider_preset_2"
    | "union_raider_preset_3"
    | "union_raider_preset_4"
    | "union_raider_preset_5";
  const currentPreset = raider[presetKey] ?? {
    union_raider_stat: raider.union_raider_stat,
    union_occupied_stat: raider.union_occupied_stat,
    union_block: raider.union_block,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {UNION_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                activeTab === id
                  ? "bg-base-content text-base-100"
                  : "bg-base-200 text-base-content/60 hover:bg-base-300 hover:text-base-content/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "basic" &&
        (() => {
          const gradeIcon = getUnionGradeIcon(character.union_grade);
          const gradeText = character.union_grade
            ? character.union_grade.replace(
                /(\d+)$/,
                (n) => ["", "I", "II", "III", "IV", "V"][parseInt(n)] ?? n,
              )
            : "없음";
          const blocks = raider.union_block ?? [];
          const raiderCount = blocks.filter((b) => b.block_type !== "메이플 M 캐릭터").length;
          const maxCount = getUnionMaxCount(character.union_grade);
          return (
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-base-300 bg-base-200/30 p-5 flex items-center gap-4">
                {gradeIcon && (
                  <Image src={gradeIcon} alt={gradeText} width={64} height={64} unoptimized />
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold tracking-widest text-base-content/40 uppercase">
                    Union Grade
                  </span>
                  <p className="text-2xl font-sans font-bold text-base-content">{gradeText}</p>
                  {character.union_level != null && (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[10px] font-bold tracking-widest text-base-content/40 uppercase">
                        Total Level
                      </span>
                      <span className="text-xs font-semibold text-base-content/60">
                        Lv.{character.union_level.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-base-300 bg-base-200/30 p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold tracking-widest text-base-content/40 uppercase">
                  공격대원
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-base-content">{raiderCount}</span>
                  {maxCount > 0 && (
                    <span className="text-sm text-base-content/40"> / {maxCount}</span>
                  )}
                </div>
              </div>
              {character.union_json && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-base-300 bg-base-200/30 p-4 flex flex-col gap-1">
                    <span className="text-[10px] font-bold tracking-widest text-base-content/40 uppercase">
                      아티팩트 레벨
                    </span>
                    <span className="text-lg font-bold text-base-content">
                      {character.union_json.union_artifact_level}
                    </span>
                  </div>
                  <div className="rounded-xl border border-base-300 bg-base-200/30 p-4 flex flex-col gap-1">
                    <span className="text-[10px] font-bold tracking-widest text-base-content/40 uppercase">
                      아티팩트 포인트
                    </span>
                    <span className="text-lg font-bold text-base-content">
                      {character.union_json.union_artifact_point.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      {activeTab === "raider" && (
        <>
          <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-base-content/40">UNION RAIDER</p>
                <InfoButton>
                  <p className="text-xs text-white/70 leading-relaxed">
                    가변 옵션 구역은 점령 보너스 스탯을 기반으로 추론한 값이에요.
                    <br />
                    고유하게 특정되지 않은 구역은 기본값으로 표시되며, 실제 설정과 다를 수 있어요.
                  </p>
                </InfoButton>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-widest text-base-content/40">
                  PRESETS
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const isDefault = n === inUsePreset;
                    const isViewing = n === selectedPreset;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setSelectedPreset(n)}
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
            <UnionGrid
              blocks={currentPreset.union_block}
              occupiedStats={currentPreset.union_occupied_stat}
            />
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
        </>
      )}

      {activeTab === "artifact" && (
        <>
          <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-base-content/40">UNION ARTIFACT</p>
              </div>
            </div>
            <UnionArtifact artifactJson={character.union_artifact} />
          </div>
        </>
      )}

      {activeTab === "champion" && (
        <div className="rounded-xl border border-white/60 dark:border-white/20 bg-white/40 dark:bg-white/5 p-4 flex flex-col gap-3">
          <p className="text-sm font-bold text-base-content/40">UNION CHAMPION</p>
          {!character.union_champion?.union_champion?.length ? (
            <p className="text-center text-sm text-base-content/40 py-4">챔피언 데이터가 없어요</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                {character.union_champion.union_champion
                  .sort((a, b) => a.champion_slot - b.champion_slot)
                  .map((champ) => (
                    <Link
                      key={champ.champion_slot}
                      href={`/character/${encodeURIComponent(champ.champion_name)}`}
                      className="flex flex-col w-48 rounded-xl border border-base-300 bg-base-200/30 shrink-0 hover:border-base-content/30 transition-colors"
                    >
                      {/* 이미지 영역 — preview와 동일한 h-56, 카드 폭 w-48 고정 */}
                      <div className="relative h-56 w-48 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getChampionBg(champ.champion_class, champ.champion_grade)}
                          alt=""
                          className="absolute bottom-0 left-1/2 -translate-x-1/2"
                        />
                        {champ.champion_image ? (
                          <div className="absolute inset-0 flex items-end justify-center z-10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={champ.champion_image}
                              alt={champ.champion_name}
                              style={(() => {
                                const jobType = CLASS_TO_JOB_TYPE[champ.champion_class];
                                const grade = champ.champion_grade;
                                const o = jobType
                                  ? (JOB_TYPE_IMAGE_OFFSET[jobType]?.[grade] ?? DEFAULT_OFFSET)
                                  : DEFAULT_OFFSET;
                                return {
                                  height: "128px",
                                  width: "auto",
                                  transform: `scale(${o.scale}) translate(${o.tx}px, ${o.ty}px)`,
                                };
                              })()}
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-0 z-10 flex items-center justify-center text-base-content/30 text-xs">
                            ?
                          </div>
                        )}
                        {champ.champion_grade && (
                          <Image
                            src={`/Union/Grade/Union_Raider_Grade_${champ.champion_grade}.png`}
                            alt={champ.champion_grade}
                            width={36}
                            height={36}
                            unoptimized
                            className="absolute top-1 left-1 z-20"
                          />
                        )}
                      </div>

                      {/* 하단 — 정보 영역 */}
                      <div className="px-2 py-1.5 flex flex-col items-center justify-start gap-0.5">
                        {champ.champion_level != null && (
                          <span className="text-[10px] font-bold text-amber-700/50 dark:text-amber-400/50 text-center">
                            Lv. {champ.champion_level}
                          </span>
                        )}
                        <div className="relative flex items-center justify-center w-full">
                          {getClassIcon(champ.champion_class) && (
                            <Image
                              src={getClassIcon(champ.champion_class)!}
                              alt={champ.champion_class}
                              width={14}
                              height={14}
                              unoptimized
                              className="absolute left-8 shrink-0"
                            />
                          )}
                          <span className="text-[11px] font-semibold text-white truncate">
                            {champ.champion_name}
                          </span>
                        </div>
                      </div>

                      {/* 배너 — Insignia */}
                      <div className="flex justify-around items-center px-2 py-1.5">
                        {[
                          { n: 1, grade: "B" },
                          { n: 2, grade: "A" },
                          { n: 3, grade: "S" },
                          { n: 4, grade: "SS" },
                          { n: 5, grade: "SSS" },
                        ].map(({ n, grade }, i) => {
                          const active = i < (champ.champion_badge_info?.length ?? 0);
                          const stat = champ.champion_badge_info?.[i]?.stat ?? null;
                          return (
                            <BadgeTooltip key={n} stat={active ? stat : null}>
                              <Image
                                src={`/Union/Champion/Insignia/${n}_UnionChampion_Insignia_${grade}_${active ? "Enable" : "Disable"}.png`}
                                alt={grade}
                                width={28}
                                height={28}
                                unoptimized
                              />
                            </BadgeTooltip>
                          );
                        })}
                      </div>
                    </Link>
                  ))}
                <div className="w-48 shrink-0" aria-hidden />
                <div className="w-48 shrink-0" aria-hidden />
              </div>
            </div>
          )}

          {character.union_champion?.champion_badge_total_info?.length ? (
            <div className="rounded-xl border border-base-300 bg-base-200/30 p-4 flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-widest text-base-content/40 uppercase">
                Champion Badge Effects
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                {character.union_champion.champion_badge_total_info.map((info, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400/60 shrink-0" />
                    <span className="text-xs text-base-content/80">{info.stat}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
