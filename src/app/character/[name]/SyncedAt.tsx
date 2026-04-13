"use client";

import { useEffect, useState } from "react";

function calcRelativeTime(syncedAt: string): string {
  const diff = Math.floor((Date.now() - new Date(syncedAt + "Z").getTime()) / 1000);
  if (diff < 60) { return `${diff}초 전`; }
  if (diff < 3600) { return `${Math.floor(diff / 60)}분 전`; }
  if (diff < 86400) { return `${Math.floor(diff / 3600)}시간 전`; }
  if (diff < 604800) { return `${Math.floor(diff / 86400)}일 전`; }
  if (diff < 2592000) { return `${Math.floor(diff / 604800)}주 전`; }
  if (diff < 31536000) { return `${Math.floor(diff / 2592000)}달 전`; }
  return `${Math.floor(diff / 31536000)}년 전`;
}

export default function SyncedAt({ syncedAt }: { syncedAt: string }) {
  const [label, setLabel] = useState(() => calcRelativeTime(syncedAt));

  useEffect(() => {
    setLabel(calcRelativeTime(syncedAt));

    const diff = Math.floor((Date.now() - new Date(syncedAt + "Z").getTime()) / 1000);
    // 1시간 미만이면 주기적으로 갱신, 이상이면 갱신 불필요
    if (diff >= 3600) { return; }

    const interval = setInterval(() => {
      const d = Math.floor((Date.now() - new Date(syncedAt + "Z").getTime()) / 1000);
      setLabel(calcRelativeTime(syncedAt));
      if (d >= 3600) { clearInterval(interval); }
    }, 1000);

    return () => clearInterval(interval);
  }, [syncedAt]);

  return <span className="font-galmuri text-[10px] font-medium">{label}</span>;
}
