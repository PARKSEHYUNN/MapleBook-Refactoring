"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { RotateCw } from "lucide-react";

interface Props {
  name: string;
  badgeBg?: string;
  badgeHover?: string;
  badgeText?: string;
}

export default function RefreshButton({
  name,
  badgeBg = "bg-black/50",
  badgeHover = "hover:bg-black/70",
  badgeText = "text-white",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRefresh() {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await fetch(`/api/character/${encodeURIComponent(name)}/refresh`, { method: "POST" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className={`flex w-28 lg:w-36 cursor-pointer items-center justify-center rounded-xl ${badgeBg} px-3 transition-colors ${badgeHover} disabled:opacity-60`}
    >
      <span className={`font-galmuri text-[10px] ${badgeText} flex items-center gap-2`}>
        <RotateCw width={10} className={loading ? "animate-spin" : ""} /> 갱신
      </span>
    </button>
  );
}
