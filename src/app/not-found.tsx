/**
 * @file src/app/not-found.tsx - 404 페이지
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 존재하지 않는 경로에 접근했을 때 Next.js가 자동으로 렌더링하는 404 페이지입니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import Link from "next/link";

import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      {/* 아이콘 */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-base-200">
        <SearchX className="h-12 w-12 text-base-content/30" />
      </div>

      {/* 텍스트 */}
      <div className="space-y-2">
        <p className="text-6xl font-bold text-base-content/10">404</p>
        <h1 className="text-xl font-semibold text-base-content">페이지를 찾을 수 없어요</h1>
        <p className="text-sm text-base-content/50">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </div>

      {/* 홈으로 버튼 */}
      <Link href="/" className="btn btn-primary rounded-full gap-2 px-6">
        <Home className="h-4 w-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
