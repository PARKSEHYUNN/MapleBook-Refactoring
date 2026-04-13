// src/components/layout/NavbarAuth.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

import { LogOut, Settings, User } from "lucide-react";

import LoginModal from "@/components/auth/LoginModal";
import { useMe } from "@/hooks/useMe";

interface NavbarAuthProps {
  dropdownAlign?: "end" | "start";
}

export default function NavbarAuth({ dropdownAlign = "end" }: NavbarAuthProps) {
  const { me, isLoading, isLoggedIn } = useMe();

  if (isLoading) {
    return <div className="w-8 h-8 animate-pulse rounded-full bg-base-300" />;
  }

  if (!isLoggedIn) {
    return <LoginModal />;
  }

  const imageUrl =
    me?.status === "ACTIVE" && me.mainCharacterImage ? me.mainCharacterImage : "/default.png";
  const characterName =
    me?.status === "ACTIVE" && me.mainCharacterName ? me.mainCharacterName : null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className={`dropdown ${dropdownAlign === "end" ? "dropdown-end" : ""}`}>
      {/* 트리거 버튼 */}
      <button
        tabIndex={0}
        className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-base-200 transition-colors"
      >
        <div className="relative w-10 h-10 overflow-hidden rounded-full border border-base-300">
          <Image
            src={imageUrl}
            alt="대표 캐릭터"
            fill
            className="object-cover scale-[4.5] translate-y-[0%]"
          />
        </div>
        <span className="text-sm font-medium">
          {characterName ?? "대표 캐릭터 미설정"}
        </span>
      </button>

      {/* 드롭다운 */}
      <div
        tabIndex={-1}
        className="dropdown-content z-50 mt-2 w-52 origin-top-right rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl"
      >
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/me"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-base-content/80 hover:bg-base-200 hover:text-base-content transition-colors"
            >
              <User className="h-4 w-4 text-primary/70" />
              내 정보
            </Link>
          </li>
          <li>
            <Link
              href="/me/settings"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-base-content/80 hover:bg-base-200 hover:text-base-content transition-colors"
            >
              <Settings className="h-4 w-4 text-primary/70" />
              설정
            </Link>
          </li>
          <li className="mt-1 pt-1 border-t border-base-300">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-error/80 hover:bg-error/10 hover:text-error transition-colors"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
