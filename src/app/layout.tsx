/**
 * @file src/app/layout.tsx - 애플리케이션 루트 레이아웃
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 모든 페이지에 공통적으로 적용되는 최상위 레이아웃 컴포넌트입니다.
 * 메이플스토리 로컬 폰트를 적용하여 전역 디자인 아이덴티티를 설정하며,
 * 다크 모드 지원을 위한 ThemeProvider와 공통 네비게이션 바(Navbar)를 포함합니다.
 * 기본적인 메타데이터 정의 및 반응형 레이아웃 구조(Header, Main)를 설정하여
 * 일관된 사용자 경험과 검색 엔진 최적화(SEO)를 지원합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { ReactNode } from "react";
import localFont from "next/font/local";

import Navbar from "@/components/layout/Navbar";

import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import AuthGate from "@/components/layout/AuthGate";
import CursorManager from "@/components/providers/CursorManager";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const logoFont = localFont({
  src: [
    {
      path: "../assets/fonts/MaplestoryLight.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/MaplestoryBold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-maplestory",
  display: "swap",
});

const galmuriFont = localFont({
  src: [
    {
      path: "../assets/fonts/Galmuri11.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/Galmuri11-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-galmuri",
  display: "swap",
});

export const metadata = {
  title: "MapleBook",
  description: "내 캐릭터의 평가를 확인해보세요!",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html
      lang="ko"
      className={`${logoFont.variable} ${galmuriFont.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-base-100 text-base-content transition-colors duration-300">
        <CursorManager>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
              <div className="flex flex-col min-h-screen">
                <header className="w-full bg-base-200/50 backdrop-blur-md sticky top-0 z-50 border-b border-base-300">
                  <div className="w-full h-16 flex items-center justify-between">
                    <Navbar />
                  </div>
                </header>
                <main className="flex-grow w-full lg:w-3/5 mx-auto px-4 py-8">
                  {children}
                  <AuthGate />
                </main>
              </div>
            </ThemeProvider>
          </NextIntlClientProvider>
        </CursorManager>
      </body>
    </html>
  );
}
