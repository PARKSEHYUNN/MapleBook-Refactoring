/**
 * @file src/components/layout/Navbar.tsx - 전역 네비게이션 바
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 모든 페이지에서 공통으로 사용되는 상단 네비게이션 바 컴포넌트입니다.
 * 왼쪽에는 캐릭터 검색 및 랭킹 드롭다운, 중앙에는 로고, 오른쪽에는 테마 토글을 배치합니다.
 * DaisyUI의 navbar/dropdown 컴포넌트와 Tailwind CSS를 활용하여 라이트/다크 모드를 지원합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import Link from "next/link";

import { Award, BookOpen, ChevronDown, Menu, Swords, Trophy } from "lucide-react";

import NavbarAuth from "./NavbarAuth";
import SearchInput from "./SearchInput";
import ThemeToggle from "./ThemeToggle";

const RANKING_LINKS = [
  { href: "/ranking/overall", label: "종합 랭킹", icon: Trophy },
  { href: "/ranking/combat", label: "전투력 랭킹", icon: Swords },
  { href: "/ranking/union", label: "유니온 랭킹", icon: Award },
] as const;


/** 구분선 + 레이블 */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="my-3 flex items-center gap-2">
      <div className="h-px flex-1 bg-base-300" />
      <span className="text-[11px] font-semibold tracking-wider text-base-content/40 uppercase">
        {label}
      </span>
      <div className="h-px flex-1 bg-base-300" />
    </div>
  );
}

export default function Navbar() {
  return (
    <div className="navbar relative max-w-4xl mx-auto w-full px-2">
      {/* ======== 왼쪽 영역 ======== */}
      <div className="flex items-center gap-1">
        {/* ---- 모바일: 햄버거 드롭다운 (lg 미만에서만 표시) ---- */}
        <div className="dropdown lg:hidden">
          <button tabIndex={0} className="btn btn-ghost btn-circle" aria-label="메뉴 열기">
            <Menu className="h-5 w-5" />
          </button>

          <div
            tabIndex={-1}
            className="dropdown-content z-50 mt-2 w-72 origin-top-left rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl"
          >
            {/* 캐릭터 섹션 */}
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-base-200 transition-colors">
                캐릭터
                <ChevronDown className="h-4 w-4 opacity-60 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-1.5 space-y-1.5 px-1">
                <SearchInput placeholder="캐릭터 이름 검색..." basePath="/character" />
                <SectionDivider label="랭킹" />
                <ul className="space-y-0.5">
                  {RANKING_LINKS.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-base-content/80 hover:bg-base-200 hover:text-base-content transition-colors"
                      >
                        <Icon className="h-4 w-4 text-primary/70" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>

            {/* 길드 섹션 */}
            <details className="group mt-0.5">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-base-200 transition-colors">
                길드
                <ChevronDown className="h-4 w-4 opacity-60 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-1.5 space-y-1.5 px-1">
                <SearchInput placeholder="길드 이름 검색..." basePath="/guild" />
                <SectionDivider label="랭킹" />
                <ul className="space-y-0.5">
                  <li>
                    <Link
                      href="/ranking/guild"
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-base-content/80 hover:bg-base-200 hover:text-base-content transition-colors"
                    >
                      <Trophy className="h-4 w-4 text-primary/70" />
                      길드 랭킹
                    </Link>
                  </li>
                </ul>
              </div>
            </details>

            {/* 구분선 */}
            <div className="my-2 h-px bg-base-300" />

            {/* 로그인 + 테마 가로 정렬 */}
            <div className="flex items-center gap-2 px-1">
              <div className="flex-1">
                <NavbarAuth dropdownAlign="start" />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* ---- 데스크톱: 캐릭터/길드 드롭다운 (lg 이상에서만 표시) ---- */}
        <div className="hidden lg:flex items-center gap-1">
          {/* 캐릭터 드롭다운 */}
          <div className="dropdown">
            <button
              tabIndex={0}
              className="btn btn-ghost gap-1.5 rounded-full text-sm font-medium hover:bg-base-200 transition-colors"
            >
              캐릭터
              <ChevronDown className="h-4 w-4 opacity-60" />
            </button>
            <div
              tabIndex={-1}
              className="dropdown-content z-50 mt-2 w-72 origin-top-left rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl"
            >
              <SearchInput placeholder="캐릭터 이름 검색..." basePath="/character" />
              <SectionDivider label="랭킹" />
              <ul className="space-y-0.5">
                {RANKING_LINKS.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-base-content/80 hover:bg-base-200 hover:text-base-content transition-colors"
                    >
                      <Icon className="h-4 w-4 text-primary/70" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 길드 드롭다운 */}
          <div className="dropdown">
            <button
              tabIndex={0}
              className="btn btn-ghost gap-1.5 rounded-full text-sm font-medium hover:bg-base-200 transition-colors"
            >
              길드
              <ChevronDown className="h-4 w-4 opacity-60" />
            </button>
            <div
              tabIndex={-1}
              className="dropdown-content z-50 mt-2 w-72 origin-top-left rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl"
            >
              <SearchInput placeholder="길드 이름 검색..." basePath="/guild" />
              <SectionDivider label="랭킹" />
              <ul className="space-y-0.5">
                <li>
                  <Link
                    href="/ranking/guild"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-base-content/80 hover:bg-base-200 hover:text-base-content transition-colors"
                  >
                    <Trophy className="h-4 w-4 text-primary/70" />
                    길드 랭킹
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ======== 중앙: 로고 ======== */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 hover:bg-base-200/70 transition-colors duration-200"
        >
          <BookOpen style={{ color: "#FFA533" }} />
          <span className="font-logo font-bold text-lg tracking-tight" style={{ color: "#FFA533" }}>
            MapleBook
          </span>
        </Link>
      </div>

      {/* ======== 오른쪽: 테마 토글 + 로그인 (데스크톱만) ======== */}
      <div className="ml-auto hidden lg:flex items-center gap-1">
        <ThemeToggle />
        <NavbarAuth />
      </div>
    </div>
  );
}
