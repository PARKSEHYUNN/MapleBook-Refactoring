"use client";

import { useState } from "react";
import Image from "next/image";

import { Hexagon, Link, Sword } from "lucide-react";

import Tooltip from "@/components/ui/Tooltip";
import type {
  HexaMatrixJsonType,
  HexaStatJsonType,
  LinkSkillJsonType,
  SkillInfo,
  SkillJsonType,
  VMatrixJsonType,
} from "@/types/character";

const GRADE_LABEL: Record<string, string> = {
  "0": "0차",
  "1": "1차",
  "1.5": "1.5차",
  "2": "2차",
  "2.5": "2.5차",
  "3": "3차",
  "4": "4차",
  hyperpassive: "하이퍼 패시브",
  hyperactive: "하이퍼 액티브",
  "5": "5차",
  "6": "6차",
};

const GRADE_ORDER = [
  "0", "1", "1.5", "2", "2.5", "3", "4",
  "hyperpassive", "hyperactive", "5", "6",
];

const SKILL14_GRADES = new Set([
  "0", "1", "1.5", "2", "2.5", "3", "4", "hyperpassive", "hyperactive",
]);

function renderSkillSection(s: SkillInfo) {
  const masterMatch = s.skill_description.match(/\[마스터 레벨 : (\d+)\]/);
  const masterLevel = masterMatch
    ? `[마스터 레벨 : ${masterMatch[1]}]`
    : `[마스터 레벨 : ${s.skill_level}]`;
  const desc = s.skill_description.replace(/\[마스터 레벨 : \d+\]\n?/, "").trim();
  return (
    <>
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
    </>
  );
}

interface SkillTabProps {
  skillJson: SkillJsonType | null;
  linkSkillJson: LinkSkillJsonType | null;
  vmatrixJson: VMatrixJsonType | null;
  hexamatrixJson: HexaMatrixJsonType | null;
  hexaStatJson: HexaStatJsonType | null;
}

export default function SkillTab({
  skillJson,
  linkSkillJson,
  vmatrixJson,
  hexamatrixJson,
  hexaStatJson,
}: SkillTabProps) {
  const [skillTab, setSkillTab] = useState<"skill14" | "vmatrix" | "hexa" | "link">("skill14");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {[
          {
            id: "skill14" as const,
            label: "1~4차",
            icon: <Sword className="w-3.5 h-3.5" />,
          },
          {
            id: "vmatrix" as const,
            label: "V 매트릭스",
            icon: <span className="font-logo text-[12px] leading-none">V</span>,
          },
          {
            id: "hexa" as const,
            label: "HEXA 매트릭스",
            icon: <Hexagon className="w-3.5 h-3.5" />,
          },
          {
            id: "link" as const,
            label: "링크 스킬",
            icon: <Link className="w-3.5 h-3.5" />,
          },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSkillTab(id)}
            className={[
              "flex items-center gap-1.5 rounded-full border px-2 py-1.5 text-xs transition-colors",
              skillTab === id
                ? "border-base-content/30 bg-base-content/10 text-base-content"
                : "border-base-300 bg-base-200/30 text-base-content/50 hover:bg-base-200/60",
            ].join(" ")}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {skillTab === "skill14" &&
        (() => {
          const filtered = (skillJson ?? [])
            .filter((g) => SKILL14_GRADES.has(g.character_skill_grade))
            .sort(
              (a, b) =>
                GRADE_ORDER.indexOf(a.character_skill_grade) -
                GRADE_ORDER.indexOf(b.character_skill_grade),
            );

          if (filtered.length === 0) {
            return (
              <p className="py-6 text-center text-sm text-base-content/40">스킬 정보 없음</p>
            );
          }
          return (
            <div className="flex flex-col gap-3">
              {filtered.map((gradeData) => {
                const learned = gradeData.character_skill.filter((s) => s.skill_level > 0);
                if (learned.length === 0) return null;
                return (
                  <div
                    key={gradeData.character_skill_grade}
                    className="rounded-xl border border-base-300 bg-base-200/30 p-3"
                  >
                    <p className="text-xs font-semibold text-base-content/50 mb-2">
                      {GRADE_LABEL[gradeData.character_skill_grade] ??
                        gradeData.character_skill_grade}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {learned.map((skill) => (
                        <Tooltip
                          key={skill.skill_name}
                          wrapperClassName="flex"
                          content={
                            <div
                              className="rounded-xl px-4 py-3 font-galmuri font-thin w-72"
                              style={{ background: "rgba(37, 44, 52, 0.85)" }}
                            >
                              {renderSkillSection(skill)}
                            </div>
                          }
                          className="!bg-transparent !border-none !shadow-none !p-0"
                        >
                          <div className="flex items-center gap-2 rounded-lg border border-base-300 bg-base-200/40 px-2 py-1.5 w-full">
                            <div className="relative shrink-0 w-9 h-9 rounded-md overflow-hidden">
                              <Image
                                src={skill.skill_icon}
                                alt={skill.skill_name}
                                width={36}
                                height={36}
                                className="w-full h-full object-contain pixelated"
                                unoptimized
                              />
                            </div>
                            <div className="min-w-0 flex flex-col">
                              <p className="text-[11px] text-base-content truncate leading-tight">
                                {skill.skill_name}
                              </p>
                              <p className="text-[11px] text-base-content/50 leading-tight">
                                {skill.skill_level}
                              </p>
                            </div>
                          </div>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

      {skillTab === "vmatrix" &&
        (() => {
          const cores = vmatrixJson?.character_v_core_equipment ?? [];

          if (cores.length === 0) {
            return (
              <p className="py-6 text-center text-sm text-base-content/40">
                V매트릭스 정보 없음
              </p>
            );
          }

          const skill5 = (skillJson ?? []).find((g) => g.character_skill_grade === "5");
          const skill5List = skill5?.character_skill ?? [];
          const skillInfoMap = new Map(skill5List.map((s) => [s.skill_name, s]));

          const getMatchingSkills = (coreName: string): SkillInfo[] => {
            if (skillInfoMap.has(coreName)) return [skillInfoMap.get(coreName)!];
            for (const [name1, info1] of skillInfoMap) {
              const prefix1 = name1.replace(" 강화", "") + "/";
              if (coreName.startsWith(prefix1)) {
                const rest1 = coreName.slice(prefix1.length);
                if (skillInfoMap.has(rest1)) return [info1, skillInfoMap.get(rest1)!];
                for (const [name2, info2] of skillInfoMap) {
                  const prefix2 = name2.replace(" 강화", "") + "/";
                  if (rest1.startsWith(prefix2)) {
                    const rest2 = rest1.slice(prefix2.length);
                    if (skillInfoMap.has(rest2)) return [info1, info2, skillInfoMap.get(rest2)!];
                  }
                }
              }
            }
            return [];
          };

          const getCoreIcons = (coreName: string): string[] =>
            getMatchingSkills(coreName).map((s) => s.skill_icon);

          const getSkillsForCore = (coreName: string): SkillInfo[] =>
            getMatchingSkills(coreName);

          const activeCores = cores.filter((c) => c.v_core_level > 0);
          const jobCores = activeCores.filter((c) => c.v_core_type === "직업 코어");
          const enhanceCores = activeCores.filter((c) => c.v_core_type === "강화 코어");
          const commonCores = activeCores.filter((c) => c.v_core_type === "공용 코어");

          const CoreSection = ({ label, items }: { label: string; items: typeof cores }) => (
            <div className="rounded-xl border border-base-300 bg-base-200/30 p-3">
              <p className="text-xs font-semibold text-base-content/50 mb-2">{label}</p>
              {items.length === 0 ? (
                <p className="text-[11px] text-base-content/30 text-center py-2">없음</p>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  {items.map((core) => {
                    const icons = getCoreIcons(core.v_core_name);
                    const skills = getSkillsForCore(core.v_core_name);
                    const tooltipContent =
                      skills.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {skills.map((s, i) => (
                            <div
                              key={`${s.skill_name}-${i}`}
                              className="rounded-xl px-4 py-3 font-galmuri font-thin w-72"
                              style={{ background: "rgba(37, 44, 52, 0.85)" }}
                            >
                              {renderSkillSection(s)}
                            </div>
                          ))}
                        </div>
                      ) : undefined;
                    return (
                      <Tooltip
                        key={core.slot_id}
                        wrapperClassName="flex"
                        content={tooltipContent}
                        className="!bg-transparent !border-none !shadow-none !p-0"
                      >
                        <div className="flex items-center gap-2 rounded-lg border border-base-300 bg-base-200/40 px-2 py-1.5 w-full">
                          {icons.length > 0 && (
                            <div className="relative shrink-0 w-9 h-9 rounded-md overflow-hidden">
                              {icons.length === 1 ? (
                                <Image
                                  src={icons[0]}
                                  alt={core.v_core_name}
                                  width={36}
                                  height={36}
                                  className="w-full h-full object-contain pixelated"
                                  unoptimized
                                />
                              ) : icons.length === 2 ? (
                                <>
                                  <Image
                                    src={icons[0]}
                                    alt=""
                                    width={36}
                                    height={36}
                                    className="absolute inset-0 w-full h-full object-contain pixelated"
                                    style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
                                    unoptimized
                                  />
                                  <Image
                                    src={icons[1]}
                                    alt=""
                                    width={36}
                                    height={36}
                                    className="absolute inset-0 w-full h-full object-contain pixelated"
                                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
                                    unoptimized
                                  />
                                  <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                      background:
                                        "linear-gradient(to bottom left, transparent calc(50% - 1px), rgba(255,255,255,0.85) calc(50% - 1px), rgba(255,255,255,0.85) calc(50% + 1px), transparent calc(50% + 1px))",
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <Image
                                    src={icons[0]}
                                    alt=""
                                    width={36}
                                    height={36}
                                    className="absolute inset-0 w-full h-full object-contain pixelated"
                                    style={{
                                      clipPath: "polygon(50% 50%, 0% 0%, 0% 100%, 50% 100%)",
                                    }}
                                    unoptimized
                                  />
                                  <Image
                                    src={icons[1]}
                                    alt=""
                                    width={36}
                                    height={36}
                                    className="absolute inset-0 w-full h-full object-contain pixelated"
                                    style={{ clipPath: "polygon(50% 50%, 0% 0%, 100% 0%)" }}
                                    unoptimized
                                  />
                                  <Image
                                    src={icons[2]}
                                    alt=""
                                    width={36}
                                    height={36}
                                    className="absolute inset-0 w-full h-full object-contain pixelated"
                                    style={{
                                      clipPath: "polygon(50% 50%, 100% 0%, 100% 100%, 50% 100%)",
                                    }}
                                    unoptimized
                                  />
                                  <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                  >
                                    <line x1="50" y1="50" x2="0" y2="0" stroke="rgba(255,255,255,0.85)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                    <line x1="50" y1="50" x2="100" y2="0" stroke="rgba(255,255,255,0.85)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                    <line x1="50" y1="50" x2="50" y2="100" stroke="rgba(255,255,255,0.85)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                  </svg>
                                </>
                              )}
                            </div>
                          )}
                          <div className="min-w-0 flex flex-col">
                            <p className="text-[11px] text-base-content truncate leading-tight">
                              {core.v_core_name}
                            </p>
                            <p className="text-[11px] text-base-content/50 leading-tight">
                              {core.v_core_level}
                            </p>
                          </div>
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              )}
            </div>
          );

          return (
            <div className="flex flex-col gap-3">
              <CoreSection label="직업 코어" items={jobCores} />
              <CoreSection label="강화 코어" items={enhanceCores} />
              <CoreSection label="공용 코어" items={commonCores} />
            </div>
          );
        })()}

      {skillTab === "hexa" &&
        (() => {
          const hexaCores = hexamatrixJson?.character_hexa_core_equipment ?? [];
          const hexaStats = hexaStatJson?.character_hexa_stat_core ?? [];
          const skill6List =
            (skillJson ?? []).find((g) => g.character_skill_grade === "6")?.character_skill ?? [];
          const skill6Map = new Map(skill6List.map((s) => [s.skill_name, s]));

          const hexaCoreTypes = ["스킬 코어", "마스터리 코어", "강화 코어", "공용 코어"] as const;

          const renderHexaCard = (
            key: string,
            skillName: string,
            level: number,
            skillInfo: ReturnType<typeof skill6Map.get>,
          ) => {
            const icon = skillInfo?.skill_icon ?? null;
            const tooltipContent = skillInfo ? (
              <div
                className="rounded-xl px-4 py-3 font-galmuri font-thin w-72"
                style={{ background: "rgba(37, 44, 52, 0.85)" }}
              >
                {renderSkillSection(skillInfo)}
              </div>
            ) : undefined;
            return (
              <Tooltip
                key={key}
                wrapperClassName="flex"
                content={tooltipContent}
                className="!bg-transparent !border-none !shadow-none !p-0"
              >
                <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-base-200/50 w-full">
                  <div className="relative w-9 h-9 rounded-md overflow-hidden border border-base-300 bg-base-300 shrink-0">
                    {icon ? (
                      <Image src={icon} alt={skillName} fill className="object-contain" />
                    ) : (
                      <span className="text-[10px] text-base-content/30 flex items-center justify-center h-full">
                        ?
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-base-content/90 leading-tight line-clamp-2">
                      {skillName}
                    </span>
                    <span className="text-[10px] text-base-content/50">Lv. {level}</span>
                  </div>
                </div>
              </Tooltip>
            );
          };

          const HexaCoreSection = ({
            label,
            items,
            splitLinkedSkills = false,
          }: {
            label: string;
            items: typeof hexaCores;
            splitLinkedSkills?: boolean;
          }) => (
            <div className="rounded-xl border border-base-300 bg-base-200/30 p-3">
              <p className="text-xs font-semibold text-base-content/50 mb-2">{label}</p>
              {items.length === 0 ? (
                <p className="text-[11px] text-base-content/30 text-center py-2">없음</p>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  {splitLinkedSkills
                    ? items.flatMap((core) =>
                        core.linked_skill.map((ls, i) =>
                          renderHexaCard(
                            `${core.hexa_core_name}-${i}`,
                            ls.hexa_skill_id,
                            core.hexa_core_level,
                            skill6Map.get(ls.hexa_skill_id),
                          ),
                        ),
                      )
                    : items.map((core) =>
                        renderHexaCard(
                          core.hexa_core_name,
                          core.hexa_core_name,
                          core.hexa_core_level,
                          skill6Map.get(core.hexa_core_name) ??
                            skill6Map.get(core.linked_skill[0]?.hexa_skill_id ?? ""),
                        ),
                      )}
                </div>
              )}
            </div>
          );

          if (hexaCores.length === 0 && hexaStats.length === 0) {
            return (
              <p className="py-6 text-center text-sm text-base-content/40">
                HEXA 매트릭스 정보 없음
              </p>
            );
          }

          return (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-base-content/70">HEXA 코어</p>
                {hexaCoreTypes.map((type) => (
                  <HexaCoreSection
                    key={type}
                    label={type}
                    items={hexaCores.filter((c) => c.hexa_core_type === type)}
                    splitLinkedSkills={type === "마스터리 코어"}
                  />
                ))}
              </div>
              {(() => {
                const statCoreGroups = [
                  { label: "코어 1", cores: hexaStatJson?.character_hexa_stat_core ?? [] },
                  { label: "코어 2", cores: hexaStatJson?.character_hexa_stat_core_2 ?? [] },
                  { label: "코어 3", cores: hexaStatJson?.character_hexa_stat_core_3 ?? [] },
                ].filter((g) => g.cores.some((c) => c.stat_grade > 0));
                if (statCoreGroups.length === 0) return null;
                return (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-base-content/70">HEXA 스탯</p>
                    <div className="flex flex-col gap-2">
                      {statCoreGroups.map(({ label, cores }) => (
                        <div
                          key={label}
                          className="rounded-xl border border-base-300 bg-base-200/30 p-3"
                        >
                          <p className="text-xs font-semibold text-base-content/50 mb-2">
                            {label}
                          </p>
                          <div className="flex flex-col gap-1">
                            {cores
                              .filter((c) => c.stat_grade > 0)
                              .map((stat) => (
                                <div
                                  key={stat.slot_id}
                                  className="flex flex-col gap-0.5 py-1.5 px-2 rounded-lg bg-base-200/50"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium text-base-content/90">
                                      {stat.main_stat_name}
                                    </span>
                                    <span className="text-[10px] text-primary font-semibold">
                                      Lv.{stat.main_stat_level}
                                    </span>
                                  </div>
                                  {stat.sub_stat_name_1 && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] text-base-content/50">
                                        {stat.sub_stat_name_1}
                                      </span>
                                      <span className="text-[10px] text-base-content/50">
                                        Lv.{stat.sub_stat_level_1}
                                      </span>
                                    </div>
                                  )}
                                  {stat.sub_stat_name_2 && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] text-base-content/50">
                                        {stat.sub_stat_name_2}
                                      </span>
                                      <span className="text-[10px] text-base-content/50">
                                        Lv.{stat.sub_stat_level_2}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })()}

      {skillTab === "link" &&
        (() => {
          const linkSkills = linkSkillJson?.character_link_skill ?? [];
          const ownedSkill = linkSkillJson?.character_owned_link_skill ?? null;
          if (linkSkills.length === 0 && !ownedSkill) {
            return (
              <p className="py-6 text-center text-sm text-base-content/40">링크 스킬 정보 없음</p>
            );
          }
          const renderLinkCard = (
            skill: NonNullable<typeof linkSkills>[number],
            key: string,
          ) => (
            <Tooltip
              key={key}
              wrapperClassName="flex"
              content={
                <div
                  className="rounded-xl px-4 py-3 font-galmuri font-thin w-72"
                  style={{ background: "rgba(37, 44, 52, 0.85)" }}
                >
                  <p className="text-center text-[14px] font-normal text-white px-2">
                    {skill.skill_name}
                  </p>
                  <div className="flex items-start gap-2 mt-1.5">
                    <Image
                      src={skill.skill_icon}
                      alt=""
                      width={36}
                      height={36}
                      className="w-9 h-9 object-contain pixelated shrink-0"
                      unoptimized
                    />
                    <div className="flex flex-col gap-0.5">
                      {skill.skill_description && (
                        <p className="text-[10px] text-white/60 whitespace-pre-wrap leading-relaxed">
                          {skill.skill_description}
                        </p>
                      )}
                    </div>
                  </div>
                  {skill.skill_effect && (
                    <div className="mt-2 flex flex-col gap-0.5">
                      <hr className="mb-2 border-white/20" />
                      <p className="text-[10px] text-white/50">[현재레벨 {skill.skill_level}]</p>
                      <p className="text-[10px] text-white/60 whitespace-pre-wrap leading-relaxed">
                        {skill.skill_effect}
                      </p>
                    </div>
                  )}
                </div>
              }
              className="!bg-transparent !border-none !shadow-none !p-0"
            >
              <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-base-200/50 w-full">
                <div className="relative w-9 h-9 rounded-md overflow-hidden border border-base-300 bg-base-300 shrink-0">
                  <Image
                    src={skill.skill_icon}
                    alt={skill.skill_name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-base-content/90 leading-tight truncate">
                    {skill.skill_name}
                  </span>
                  <span className="text-[10px] text-base-content/50">Lv.{skill.skill_level}</span>
                </div>
              </div>
            </Tooltip>
          );
          return (
            <div className="flex flex-col gap-3">
              {ownedSkill && (
                <div className="rounded-xl border border-base-300 bg-base-200/30 p-3">
                  <p className="text-xs font-semibold text-base-content/50 mb-2">보유 링크 스킬</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {renderLinkCard(ownedSkill, "owned")}
                  </div>
                </div>
              )}
              {linkSkills.length > 0 && (
                <div className="rounded-xl border border-base-300 bg-base-200/30 p-3">
                  <p className="text-xs font-semibold text-base-content/50 mb-2">장착 링크 스킬</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {linkSkills.map((s, i) => renderLinkCard(s, `link-${i}`))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
    </div>
  );
}
