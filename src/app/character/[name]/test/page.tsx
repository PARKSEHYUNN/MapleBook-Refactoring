/**
 * @file src/app/character/[name]/test/page.tsx - 전투력 계산 검증 테스트 페이지
 * @description 개발용: 실제 전투력 vs 공식 기반 계산 전투력 비교
 */

import { notFound } from "next/navigation";

import { eq } from "drizzle-orm";

import { getDb } from "@/db";
import { characters } from "@/db/schema";
import { StatJsonType } from "@/types/character";

interface Props {
  params: Promise<{ name: string }>;
}

type StatKey = "STR" | "DEX" | "INT" | "LUK";
type AttackKey = "공격력" | "마력";

interface ClassConfig {
  mainStat: StatKey;
  subStat: StatKey;
  attack: AttackKey;
}

// 직업별 주스탯/부스탯/공격 타입 매핑 (common.ts ClassName 기준 전체)
const CLASS_CONFIG: Record<string, ClassConfig> = {
  // ── STR / DEX / 공격력 ──────────────────────────────────────────
  // 전사 계열 (익스플로러)
  초보자: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  검사: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  파이터: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  페이지: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  스피어맨: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  크루세이더: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  나이트: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  버서커: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  히어로: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  팔라딘: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  다크나이트: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  // 시그너스 전사
  노블레스: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  소울마스터: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  스트라이커: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  미하일: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  // 영웅 / 레지스탕스 / 기타
  아란: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  블래스터: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  카이저: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  데몬슬레이어: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  아크: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  제로: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  은월: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  아델: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  렌: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  // 해적 STR 계열 (익스플로러)
  인파이터: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  버커니어: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
  바이퍼: { mainStat: "STR", subStat: "DEX", attack: "공격력" },

  // ── INT / LUK / 마력 ────────────────────────────────────────────
  // 마법사 계열 (익스플로러)
  매지션: { mainStat: "INT", subStat: "LUK", attack: "마력" },
  "위자드(불,독)": { mainStat: "INT", subStat: "LUK", attack: "마력" },
  "위자드(썬,콜)": { mainStat: "INT", subStat: "LUK", attack: "마력" },
  클레릭: { mainStat: "INT", subStat: "LUK", attack: "마력" },
  "메이지(불,독)": { mainStat: "INT", subStat: "LUK", attack: "마력" },
  "메이지(썬,콜)": { mainStat: "INT", subStat: "LUK", attack: "마력" },
  프리스트: { mainStat: "INT", subStat: "LUK", attack: "마력" },
  "아크메이지(불,독)": { mainStat: "INT", subStat: "LUK", attack: "마력" },
  "아크메이지(썬,콜)": { mainStat: "INT", subStat: "LUK", attack: "마력" },
  비숍: { mainStat: "INT", subStat: "LUK", attack: "마력" },
  // 시그너스 마법사
  플레임위자드: { mainStat: "INT", subStat: "LUK", attack: "마력" },
  // 레지스탕스 마법사 (common.ts 표기: 베틀메이지)
  베틀메이지: { mainStat: "INT", subStat: "LUK", attack: "마력" },
  // 영웅 / 기타
  에반: { mainStat: "INT", subStat: "LUK", attack: "마력" },
  루미너스: { mainStat: "INT", subStat: "LUK", attack: "마력" },
  키네시스: { mainStat: "INT", subStat: "LUK", attack: "마력" },
  일리움: { mainStat: "INT", subStat: "LUK", attack: "마력" },
  라라: { mainStat: "INT", subStat: "LUK", attack: "마력" },

  // ── DEX / STR / 공격력 ──────────────────────────────────────────
  // 궁수 계열 (익스플로러)
  아처: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  헌터: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  사수: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  레인저: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  저격수: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  보우마스터: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  신궁: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  "아처(패스파인더)": { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  에이션트아처: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  체이서: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  패스파인더: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  // 시그너스 궁수
  윈드브레이커: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  // 레지스탕스
  와일드헌터: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  메카닉: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  // 영웅 / 기타
  메르세데스: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  카인: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  호영: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  // 해적 DEX 계열 (익스플로러)
  해적: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  건슬링거: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  발키리: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  캐논슈터: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  캐논블래스터: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  캡틴: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  캐논마스터: { mainStat: "DEX", subStat: "STR", attack: "공격력" },
  // 기타 DEX
  엔젤릭버스터: { mainStat: "DEX", subStat: "STR", attack: "공격력" },

  // ── LUK / DEX / 공격력 ──────────────────────────────────────────
  // 도적 계열 (익스플로러)
  로그: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  어쌔신: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  시프: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  허밋: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  시프마스터: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  나이트로드: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  섀도어: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  세미듀어러: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  듀어러: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  듀얼마스터: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  슬래셔: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  듀얼블레이더: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  // 시그너스 도적
  나이트워커: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  // 영웅 / 기타
  팬텀: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  카데나: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },
  칼리: { mainStat: "LUK", subStat: "DEX", attack: "공격력" },

  // ── 레지스탕스 공통 1차 ─────────────────────────────────────────
  시티즌: { mainStat: "STR", subStat: "DEX", attack: "공격력" },
};

interface CalcResult {
  calculated: number | null;
  error?: string;
  steps: {
    label: string;
    value: string | number | null;
    missing?: boolean;
  }[];
}

function calcCombatPower(statJson: StatJsonType, characterClass: string): CalcResult {
  const steps: CalcResult["steps"] = [];

  // 데몬어벤져 특수 처리
  if (characterClass === "데몬어벤져") {
    return { calculated: null, error: "데몬어벤져는 HP 기반 공식으로 별도 처리 필요", steps: [] };
  }
  // 제논 특수 처리
  if (characterClass === "제논") {
    return {
      calculated: null,
      error: "제논은 STR+DEX+LUK 합산 공식으로 별도 처리 필요",
      steps: [],
    };
  }

  const config = CLASS_CONFIG[characterClass];
  if (!config) {
    return {
      calculated: null,
      error: `직업 매핑 없음: "${characterClass}" — CLASS_CONFIG에 추가 필요`,
      steps: [],
    };
  }

  const { mainStat, subStat, attack } = config;

  // stat 조회 헬퍼
  const getStat = (name: string): number | null => {
    const entry = statJson.final_stat.find((s) => s.stat_name === name);
    if (!entry) {
      return null;
    }
    const val = parseFloat(entry.stat_value.replace(/,/g, ""));
    return isNaN(val) ? null : val;
  };

  // --- 1. 주스탯 ---
  const mainBase = getStat(mainStat);
  const mainPct = getStat(`${mainStat} %`);
  const mainFixed = getStat(`% 이외 ${mainStat} 합계`);

  steps.push({ label: `주스탯 기반 (${mainStat})`, value: mainBase, missing: mainBase === null });
  steps.push({
    label: `주스탯 % (${mainStat} %)`,
    value: mainPct !== null ? `${mainPct}%` : null,
    missing: mainPct === null,
  });
  steps.push({
    label: `% 이외 ${mainStat} 합계`,
    value: mainFixed,
    missing: mainFixed === null,
  });

  let finalMain: number | null = null;
  if (mainBase !== null && mainPct !== null && mainFixed !== null) {
    finalMain = Math.floor(mainBase * (1 + mainPct / 100) + mainFixed);
  }
  steps.push({
    label: `최종 주스탯 = floor(${mainStat} × (1 + ${mainStat}%) + 고정)`,
    value: finalMain,
  });

  // --- 2. 부스탯 ---
  const subBase = getStat(subStat);
  const subPct = getStat(`${subStat} %`);
  const subFixed = getStat(`% 이외 ${subStat} 합계`);

  steps.push({ label: `부스탯 기반 (${subStat})`, value: subBase, missing: subBase === null });
  steps.push({
    label: `부스탯 % (${subStat} %)`,
    value: subPct !== null ? `${subPct}%` : null,
    missing: subPct === null,
  });
  steps.push({
    label: `% 이외 ${subStat} 합계`,
    value: subFixed,
    missing: subFixed === null,
  });

  let finalSub: number | null = null;
  if (subBase !== null && subPct !== null && subFixed !== null) {
    finalSub = Math.floor(subBase * (1 + subPct / 100) + subFixed);
  }
  steps.push({
    label: `최종 부스탯 = floor(${subStat} × (1 + ${subStat}%) + 고정)`,
    value: finalSub,
  });

  // --- 3. 스탯 factor ---
  let statFactor: number | null = null;
  if (finalMain !== null && finalSub !== null) {
    statFactor = (finalMain * 4 + finalSub) / 100;
  }
  steps.push({ label: "스탯 factor = (주스탯×4 + 부스탯) / 100", value: statFactor });

  // --- 4. 공격력 ---
  const atkBase = getStat(attack);
  const atkPct = getStat(`${attack} %`);

  steps.push({
    label: `${attack} 기반`,
    value: atkBase,
    missing: atkBase === null,
  });
  steps.push({
    label: `${attack} %`,
    value: atkPct !== null ? `${atkPct}%` : null,
    missing: atkPct === null,
  });

  let atkFactor: number | null = null;
  if (atkBase !== null && atkPct !== null) {
    atkFactor = Math.floor(atkBase * (1 + atkPct / 100));
  }
  steps.push({
    label: `최종 ${attack} = floor(${attack} × (1 + ${attack}%))`,
    value: atkFactor,
  });

  // --- 5. 데미지 ---
  const damagePct = getStat("데미지") ?? 0;
  const bossDamagePct = getStat("보스 몬스터 데미지") ?? 0;
  const damageFactor = 1 + (damagePct + bossDamagePct) / 100;
  steps.push({ label: "데미지 %", value: `${damagePct}%` });
  steps.push({ label: "보스 몬스터 데미지 %", value: `${bossDamagePct}%` });
  steps.push({
    label: "데미지 factor = 1 + (데미지 + 보스데미지) / 100",
    value: damageFactor.toFixed(4),
  });

  // --- 6. 크리티컬 데미지 ---
  const critDamagePct = getStat("크리티컬 데미지") ?? 0;
  const critFactor = (135 + critDamagePct) / 100;
  steps.push({ label: "크리티컬 데미지 %", value: `${critDamagePct}%` });
  steps.push({ label: "크리티컬 factor = (135 + 크리데) / 100", value: critFactor.toFixed(4) });

  // --- 7. 최종 데미지 (제네시스 무기 여부 미확인 → 1.0) ---
  const finalDamageFactor = 1.0;
  steps.push({ label: "최종데미지 factor (제네시스 무기 미확인 → 1.0)", value: finalDamageFactor });

  // --- 결과 ---
  let calculated: number | null = null;
  if (statFactor !== null && atkFactor !== null) {
    calculated = Math.floor(statFactor * atkFactor * damageFactor * critFactor * finalDamageFactor);
  }

  return { calculated, steps };
}

export default async function CharacterTestPage({ params }: Props) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);

  const db = await getDb();
  const [character] = await db.select().from(characters).where(eq(characters.characterName, name));
  if (!character) {
    notFound();
  }

  const statJson = character.statJson as StatJsonType | null;
  const { calculated, steps, error } =
    statJson && character.characterClass
      ? calcCombatPower(statJson, character.characterClass)
      : { calculated: null, steps: [], error: "스탯 데이터 없음 (DB에 statJson 없음)" };

  const actual = character.combatPower ?? null;
  const diff = actual !== null && calculated !== null ? actual - calculated : null;
  const diffPct =
    diff !== null && actual !== null && actual !== 0
      ? ((Math.abs(diff) / actual) * 100).toFixed(2)
      : null;

  return (
    <div className="p-6 font-mono text-sm max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-1">{name}</h1>
      <p className="text-xs text-base-content/50 mb-6">
        직업: {character.characterClass ?? "-"} / Lv.{character.characterLevel}
      </p>

      {/* 비교 카드 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="p-4 rounded-xl border border-base-300 bg-base-200/40">
          <div className="text-[10px] text-base-content/50 mb-1">실제 전투력 (NEXON API)</div>
          <div className="text-2xl font-bold tabular-nums">{actual?.toLocaleString() ?? "—"}</div>
        </div>
        <div className="p-4 rounded-xl border border-base-300 bg-base-200/40">
          <div className="text-[10px] text-base-content/50 mb-1">계산된 전투력 (공식)</div>
          <div className="text-2xl font-bold tabular-nums">
            {calculated?.toLocaleString() ?? "—"}
          </div>
          {error && <div className="text-[10px] text-red-400 mt-1">{error}</div>}
        </div>
        <div className="p-4 rounded-xl border border-base-300 bg-base-200/40">
          <div className="text-[10px] text-base-content/50 mb-1">차이</div>
          {diff !== null ? (
            <>
              <div
                className={`text-2xl font-bold tabular-nums ${diff === 0 ? "text-green-500" : "text-red-400"}`}
              >
                {diff > 0 ? "+" : ""}
                {diff.toLocaleString()}
              </div>
              <div className="text-[10px] text-base-content/50">{diffPct}% 오차</div>
            </>
          ) : (
            <div className="text-2xl text-base-content/30">—</div>
          )}
        </div>
      </div>

      {/* 계산 단계 */}
      {steps.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold mb-2 text-base">계산 단계</h2>
          <div className="rounded-xl border border-base-300 overflow-hidden">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`flex justify-between gap-4 px-4 py-1.5 text-xs border-b border-base-300/50 last:border-0 ${s.missing ? "bg-red-500/10" : ""}`}
              >
                <span className={s.missing ? "text-red-400" : "text-base-content/60"}>
                  {s.label}
                </span>
                <span
                  className={`tabular-nums font-semibold ${s.missing ? "text-red-400" : s.value === null ? "text-yellow-500" : "text-base-content"}`}
                >
                  {s.missing ? "스탯명 없음 ❌" : s.value === null ? "계산 불가" : String(s.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 전체 스탯 목록 */}
      {statJson && (
        <div>
          <h2 className="font-bold mb-2 text-base">
            전체 final_stat 목록 ({statJson.final_stat.length}개)
          </h2>
          <div className="rounded-xl border border-base-300 overflow-hidden">
            {statJson.final_stat.map((s) => (
              <div
                key={s.stat_name}
                className="flex justify-between gap-4 px-4 py-1 text-xs border-b border-base-300/50 last:border-0"
              >
                <span className="text-base-content/50">{s.stat_name}</span>
                <span className="tabular-nums font-semibold">{s.stat_value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
