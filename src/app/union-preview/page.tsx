"use client";

import { useState } from "react";

const JOB_TYPES = [
  { label: "전사", idx: 1, en: "Warrior" },
  { label: "마법사", idx: 2, en: "Mage" },
  { label: "궁수", idx: 3, en: "Archer" },
  { label: "도적", idx: 4, en: "Rouge" },
  { label: "해적", idx: 5, en: "Pirate" },
];

const GRADES = [
  { grade: "B", n: 1 },
  { grade: "A", n: 2 },
  { grade: "S", n: 3 },
  { grade: "SS", n: 4 },
  { grade: "SSS", n: 5 },
];

// ── 이 값을 수정하면서 맞추세요 ──────────────────────────────────────────────────
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

function getOffset(jobLabel: string, grade: string): Offset {
  return JOB_TYPE_IMAGE_OFFSET[jobLabel]?.[grade] ?? DEFAULT_OFFSET;
}

export default function UnionPreviewPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [selectedGrade, setSelectedGrade] = useState(3);

  const gradeInfo = GRADES[selectedGrade - 1];

  return (
    <div className="min-h-screen bg-base-200 p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-2 max-w-xl">
        <h1 className="text-lg font-bold">유니온 챔피언 배경 미리보기</h1>
        <input
          type="text"
          placeholder="캐릭터 이미지 URL 붙여넣기"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="input input-bordered input-sm w-full font-mono text-xs"
        />
        <div className="flex gap-2">
          {GRADES.map(({ grade, n }) => (
            <button
              key={n}
              onClick={() => setSelectedGrade(n)}
              className={`btn btn-xs ${selectedGrade === n ? "btn-primary" : "btn-ghost"}`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 min-w-max">
        {JOB_TYPES.map(({ label, idx, en }) => {
          const bgSrc = `/Union/Champion/${idx}_UnionChampion_Statue_${en}_${gradeInfo.n}.png`;
          const offset = getOffset(label, gradeInfo.grade);
          return (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-center text-base-content/60">
                {label}
              </span>
              <div className="relative h-56 w-48 rounded-xl border border-base-300 bg-base-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bgSrc}
                  alt={label}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                />
                {imageUrl && (
                  <div className="absolute inset-0 flex items-end justify-center z-10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="character"
                      style={{
                        height: "128px",
                        width: "auto",
                        transform: `scale(${offset.scale}) translate(${offset.tx}px, ${offset.ty}px)`,
                      }}
                    />
                  </div>
                )}
                <div className="absolute bottom-1 inset-x-0 text-center z-20">
                  <span className="text-[9px] text-white/50 font-mono bg-black/40 px-1 rounded">
                    s{offset.scale} x{offset.tx} y{offset.ty}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-base-content/40 mt-2">
        <p>
          오프셋 조정:{" "}
          <code className="bg-base-300 px-1 rounded">src/app/union-preview/page.tsx</code> 상단{" "}
          <code className="bg-base-300 px-1 rounded">JOB_TYPE_IMAGE_OFFSET</code> 수정
        </p>
        <p>
          확정 후 같은 값을{" "}
          <code className="bg-base-300 px-1 rounded">src/components/ui/UnionChip.tsx</code>의{" "}
          <code className="bg-base-300 px-1 rounded">JOB_TYPE_IMAGE_OFFSET</code>에 복사
        </p>
      </div>
    </div>
  );
}
