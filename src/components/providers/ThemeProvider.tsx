/**
 * @file src/components/ThemeProvider.tsx - 클라이언트 사이드 테마 프로바이더
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * `next-themes` 라이브러리를 래핑하여 애플리케이션에 테마 컨텍스트를 제공하는 컴포넌트입니다.
 * 클라이언트 컴포넌트("use client")로 선언되어 브라우저의 로컬 스토리지 및 시스템 설정과
 * 연동된 다크 모드/라이트 모드 상태를 관리합니다.
 * 하위 컴포넌트들이 현재 테마 상태에 접근하고 실시간으로 테마를 전환할 수 있도록 지원합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

"use client";

import * as React from "react";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
