"use client";

import { useRef } from "react";

import { useRouter } from "next/navigation";

import { Search } from "lucide-react";

interface Props {
  placeholder: string;
  /** 검색 결과 경로 prefix. 예: "/character" → /character/{name} */
  basePath: string;
}

export default function SearchInput({ placeholder, basePath }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function navigate() {
    const value = inputRef.current?.value.trim();
    if (!value) { return; }
    router.push(`${basePath}/${encodeURIComponent(value)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { navigate(); }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-200/60 px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <Search className="h-4 w-4 shrink-0 text-base-content/40" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        className="w-full bg-transparent text-sm outline-none placeholder:text-base-content/40"
      />
      <button
        type="button"
        onClick={navigate}
        className="shrink-0 rounded-lg p-1 text-base-content/40 hover:bg-base-300 hover:text-base-content transition-colors"
        aria-label="검색"
      >
        <Search className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
