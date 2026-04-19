"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SnapshotJsonType } from "@/types/user";

interface Snapshot {
  snapshotDate: string;
  snapshotData: SnapshotJsonType;
}

type Metric = "character_level" | "combat_power" | "union_level" | "popularity";

const METRICS: { id: Metric; label: string; format: (v: number) => string }[] = [
  { id: "combat_power", label: "전투력", format: (v) => v.toLocaleString() },
  { id: "character_level", label: "레벨", format: (v) => `Lv.${v}` },
  { id: "union_level", label: "유니온레벨", format: (v) => v.toLocaleString() },
  { id: "popularity", label: "인기도", format: (v) => v.toLocaleString() },
];

type SubTab = "trend" | "compare";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "trend", label: "성장 추이" },
  { id: "compare", label: "기간 비교" },
];

function formatYAxis(v: number): string {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(v);
}

export function HistoryChip({ characterName }: { characterName: string }) {
  const [subTab, setSubTab] = useState<SubTab>("trend");
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<Metric>("combat_power");

  function fetchSnapshots() {
    setIsLoading(true);
    fetch(`/api/character/${encodeURIComponent(characterName)}/snapshots`)
      .then((r) => r.json())
      .then((json) => setSnapshots(json.data ?? []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchSnapshots();
    window.addEventListener("character-refreshed", fetchSnapshots);
    return () => window.removeEventListener("character-refreshed", fetchSnapshots);
  }, [characterName]);

  const metricInfo = METRICS.find((m) => m.id === activeMetric)!;

  const chartData = snapshots.map((s) => {
    const raw = s.snapshotData[activeMetric] as number;
    const expRate = s.snapshotData.character_exp_rate;
    const value = activeMetric === "character_level" ? raw + expRate / 100 : raw;
    return { date: s.snapshotDate.slice(5).replace("-", "/"), value, expRate };
  });

  const yDomain: [number | string, number | string] = ["auto", "auto"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1">
        {SUB_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSubTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              subTab === id
                ? "bg-base-content text-base-100"
                : "bg-base-200 text-base-content/60 hover:bg-base-300 hover:text-base-content/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {subTab === "trend" && (
        <div className="rounded-xl border border-base-300 bg-base-200/30 p-4 flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {METRICS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveMetric(id)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                  activeMetric === id
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content/60 hover:bg-base-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="h-52 flex items-center justify-center text-sm text-base-content/40">
              불러오는 중...
            </div>
          ) : snapshots.length === 0 ? (
            <div className="h-52 flex flex-col items-center justify-center gap-2 text-base-content/40">
              <span className="text-sm">성장 기록이 아직 없어요</span>
              <span className="text-xs">캐릭터를 갱신하면 기록이 쌓여요</span>
            </div>
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, opacity: 0.45 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, opacity: 0.45 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={activeMetric === "character_level" ? (v) => String(Math.floor(v)) : formatYAxis}
                    width={activeMetric === "combat_power" ? 44 : 36}
                    domain={yDomain}
                  />
                  <Tooltip
                    formatter={(value: number, _name: string, props: { payload?: { expRate?: number } }) => {
                      if (activeMetric === "character_level" && props.payload?.expRate !== undefined) {
                        return [`Lv.${Math.floor(value)} (${props.payload.expRate.toFixed(2)}%)`, "레벨"];
                      }
                      return [metricInfo.format(value), metricInfo.label];
                    }}
                    labelStyle={{ fontSize: 11, marginBottom: 2 }}
                    contentStyle={{
                      background: "#252C34F0",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: 11,
                      padding: "6px 10px",
                    }}
                    itemStyle={{ color: "rgba(255,255,255,0.8)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#8B5CF6", strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#8B5CF6" }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {subTab === "compare" && (
        <div className="rounded-xl border border-base-300 bg-base-200/30 p-8 flex flex-col items-center justify-center gap-2 text-base-content/40">
          <span className="text-sm">기간 비교 기능은 준비 중이에요</span>
        </div>
      )}
    </div>
  );
}
