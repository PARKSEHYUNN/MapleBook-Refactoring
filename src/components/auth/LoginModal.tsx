/**
 * @file src/components/auth/LoginModal.tsx - 로그인 모달
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * Nexon Open API 키 입력 기반 로그인 모달 컴포넌트입니다.
 * API 키 입력, 자동 로그인 옵션, API 키 확인 방법 안내를 포함합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

"use client";

import { useState } from "react";

import { ChevronDown, Eye, EyeOff, HelpCircle, LoaderCircle, LogIn, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { BaseModal } from "@/components/ui/BaseModal";

export default function LoginModal() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const t = useTranslations("Auth");

  // 로그인 처리 함수
  const handleLogin = async () => {
    // 오류 메세지 상태 초기화
    setShowWarning(false);
    setWarningText("");

    // apiKey가 비어있으면
    if (!apiKey.trim()) {
      setWarningText(t("APIKEY_EMPTY"));
      setShowWarning(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, rememberMe }),
      });

      if (response.ok) {
        window.location.reload();
        return;
      }

      const result = (await response.json()) as { errorCode: string; message: string };
      setWarningText(t(result.errorCode) ?? t("ERROR"));
      setShowWarning(true);
      return;
    } catch (error) {
      setWarningText(t("ERROR"));
      setShowWarning(true);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 트리거 버튼 */}
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary btn-sm rounded-full px-4 text-sm font-medium"
      >
        로그인
      </button>

      {open && (
        <BaseModal boxClassName="max-w-sm p-6" onBackdropClick={() => !isLoading && setOpen(false)} portal>
              {/* 헤더 */}
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold">로그인</h2>
                <button
                  onClick={() => !isLoading && setOpen(false)}
                  className="btn btn-ghost btn-circle btn-sm"
                  aria-label="닫기"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* API 키 입력 */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-base-content">Nexon Open API 키</label>
                  <div className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-200/50 px-3 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <input
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      readOnly
                      onFocus={(e) => e.target.removeAttribute("readonly")}
                      autoComplete="new-password"
                      placeholder="API 키를 입력하세요"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-base-content/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((v) => !v)}
                      className="shrink-0 text-base-content/40 hover:text-base-content transition-colors"
                      aria-label={showKey ? "키 숨기기" : "키 보기"}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {showWarning && (
                    <span className="text-sm text-red-500 px-1">⚠ {warningText}</span>
                  )}
                </div>

                {/* 자동 로그인 */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="cursor-pointer text-sm">
                    자동 로그인
                  </label>

                  {/* ? 툴팁 */}
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center text-base-content/40 hover:text-base-content transition-colors"
                      aria-label="자동 로그인 안내"
                      onMouseEnter={() => setTooltipVisible(true)}
                      onMouseLeave={() => setTooltipVisible(false)}
                      onClick={() => setTooltipVisible((v) => !v)}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>

                    {tooltipVisible && (
                      <div className="absolute bottom-full left-1/2 mb-2 w-64 -translate-x-1/2 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2.5 text-xs text-warning-content shadow-lg z-50 backdrop-blur-sm">
                        <p className="font-semibold text-warning mb-1">⚠ 자동 로그인 주의</p>
                        <p className="text-base-content/70 leading-relaxed">
                          API 키가 브라우저에 장기 저장됩니다. 공용 PC나 타인과 공유하는 기기에서는
                          사용하지 마세요.
                        </p>
                        {/* 말풍선 꼬리 */}
                        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-warning/30" />
                      </div>
                    )}
                  </div>
                </div>

                {/* API 키 확인 방법 아코디언 */}
                <div>
                  <button
                    type="button"
                    onClick={() => setGuideOpen((v) => !v)}
                    className="flex items-center gap-1 text-sm text-base-content/50 hover:text-base-content/80 transition-colors"
                  >
                    API 키 확인 방법
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        guideOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {guideOpen && (
                    <div className="mt-2 text-sm text-base-content/60">
                      {/* 추후 내용 추가 예정 */}
                      <p className="text-base-content/30">설명 준비 중...</p>
                    </div>
                  )}
                </div>

                {/* 로그인 버튼 */}
                <button
                  type="button"
                  className="btn btn-primary w-full rounded-xl gap-2"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  {isLoading ? "로그인 중..." : "로그인"}
                </button>
              </div>
        </BaseModal>
      )}
    </>
  );
}
