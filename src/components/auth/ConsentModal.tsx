/**
 * @file src/components/auth/ConsentModal.tsx - 약관 동의 모달
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * NEEDS_SETUP 또는 NEEDS_CONSENT 상태의 사용자에게 서비스 이용약관 및
 * 개인정보처리방침 동의를 요청하는 모달입니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

"use client";

import { useState } from "react";

import { LoaderCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { TERMS_VERSION } from "@/constants/terms";
import privacyContent from "@/legal/privacy.md";
import termsContent from "@/legal/terms.md";

type Tab = "terms" | "privacy";

interface ConsentModalProps {
  onNext: (data: { termsVersion: string; privacyVersion: string }) => void;
  isLoading?: boolean;
  mainCharacterId?: string;
}

const mdComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ children }) => (
    <h1 className="text-base font-bold mb-3 mt-1 text-base-content">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-semibold mt-4 mb-1.5 text-base-content">{children}</h2>
  ),
  p: ({ children }) => (
    <p className="mb-2 text-sm text-base-content/80 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-4 mb-2 space-y-1 text-sm text-base-content/80">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-4 mb-2 space-y-1 text-sm text-base-content/80">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-base-content">{children}</strong>,
  hr: () => <hr className="my-3 border-base-300" />,
};

export default function ConsentModal({ onNext, isLoading, mainCharacterId }: ConsentModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("terms");
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const canSubmit = termsChecked && privacyChecked && !isLoading;

  const handleNext = () => {
    if (!termsChecked || !privacyChecked) {
      return;
    }
    onNext({ termsVersion: TERMS_VERSION.SERVICE, privacyVersion: TERMS_VERSION.PRIVACY });
  };

  return (
    <dialog className="modal modal-open" style={{ zIndex: 9999 }}>
      <div className="modal-box max-w-2xl rounded-2xl p-6 flex flex-col gap-4 h-[90vh] max-h-[90vh]">
        {/* 헤더 */}
        <div>
          <h2 className="text-lg font-bold">서비스 이용 약관 동의</h2>
          <p className="text-sm text-base-content/60 mt-0.5">
            서비스를 이용하려면 아래 약관을 확인하고 동의해야 합니다.
          </p>
        </div>

        {/* 탭 */}
        <div role="tablist" className="tabs tabs-bordered shrink-0">
          <button
            role="tab"
            className={`tab text-sm${activeTab === "terms" ? " tab-active font-medium" : ""}`}
            onClick={() => setActiveTab("terms")}
          >
            서비스 이용약관
          </button>
          <button
            role="tab"
            className={`tab text-sm${activeTab === "privacy" ? " tab-active font-medium" : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            개인정보처리방침
          </button>
        </div>

        {/* 문서 내용 */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-base-300 bg-base-200/40 p-4 min-h-0">
          <ReactMarkdown components={mdComponents}>
            {activeTab === "terms" ? termsContent : privacyContent}
          </ReactMarkdown>
        </div>

        {/* 체크박스 */}
        <div className="space-y-2 shrink-0">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm mt-0.5 shrink-0"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
            />
            <span className="text-sm leading-relaxed">
              <span className="text-error font-medium">[필수]</span> 서비스 이용약관을 읽었으며 이에
              동의합니다.
            </span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm mt-0.5 shrink-0"
              checked={privacyChecked}
              onChange={(e) => setPrivacyChecked(e.target.checked)}
            />
            <span className="text-sm leading-relaxed">
              <span className="text-error font-medium">[필수]</span> 개인정보처리방침을 읽었으며
              이에 동의합니다.
            </span>
          </label>
        </div>

        {/* 제출 버튼 */}
        <button
          type="button"
          className="btn btn-primary w-full rounded-xl shrink-0 gap-2"
          disabled={!canSubmit}
          onClick={handleNext}
        >
          {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {isLoading ? "처리 중..." : mainCharacterId !== undefined ? "동의하고 계속하기" : "다음"}
        </button>
      </div>
    </dialog>
  );
}
