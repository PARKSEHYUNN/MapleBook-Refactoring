// src/components/layout/Navbar.tsx

import Link from "next/link";

import { Album, Award, ChevronDown, Search, Swords, Trophy } from "lucide-react";

import Icon from "@/assets/icons/icon.svg";
import Logo from "@/assets/icons/logo.svg";

import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <div className="navbar shadow-sm max-w-6xl mx-auto w-full">
      {/* --- 왼쪽: 캐릭터 / 길드 드롭다운 --- */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost rounded-full">
            <span>캐릭터</span>
            <ChevronDown />
          </div>

          <div
            tabIndex={-1}
            className="dropdown-content bg-base-100 rounded-box z-50 mt-3 w-72 p-3 shadow-lg border border-base-300"
          >
            {/* 검색 창 */}
            <div className="flex gap-1 mb-3">
              <input
                type="text"
                placeholder="캐릭터 검색"
                className="input input-bordered input-sm flex-1 rounded-full"
              />
              <button className="btn btn-sm btn-ghost rounded-full">
                <Search />
              </button>
            </div>

            {/* 구분 선 */}
            <div className="divider my-1 text-xs text-base-content/50">랭킹</div>

            {/* 랭킹 메뉴 */}
            <ul className="menu menu-sm p-0 gap-0.5 w-full">
              <li>
                <Link href="/ranking/overall" className="flex-center gap-2">
                  <Trophy />
                  <span>종합 랭킹</span>
                </Link>
              </li>
              <li>
                <Link href="/ranking/overall" className="flex-center gap-2">
                  <Swords />
                  <span>전투력 랭킹</span>
                </Link>
              </li>
              <li>
                <Link href="/ranking/overall" className="flex-center gap-2">
                  <Award />
                  <span>유니온 랭킹</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* --- 중앙: 로고 --- */}
      <div className="navbar-center">
        <Link
          href="/"
          className="text-xl flex items-center gap-3 hover:opacity-70 transition-opacity duration-200"
        >
          <Album style={{ color: "#FFA533" }} />
          <span className="font-logo font-bold text-xl" style={{ color: "#FFA533" }}>
            MapleBook
          </span>
        </Link>
      </div>

      {/* 오른쪽: 테마 변경 / 로그인 or 사용자 정보 탭 */}
      <div className="navbar-end">
        <ThemeToggle />
      </div>
    </div>
  );
}
