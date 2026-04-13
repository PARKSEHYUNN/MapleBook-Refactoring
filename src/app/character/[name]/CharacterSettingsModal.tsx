"use client";

import { useMemo, useState, useTransition } from "react";

import { Check, FlipHorizontal2, ImageIcon, Settings, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

import {
  ACTION_FRAMES,
  ACTIONS,
  EMOTION_FRAMES,
  EMOTIONS,
  WMOTIONS,
} from "@/constants/character-motion";

type Tab = "motion" | "theme" | "personal";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "motion", label: "캐릭터 모션", icon: <SlidersHorizontal className="h-3.5 w-3.5" /> },
  { id: "theme", label: "배경 / 테마", icon: <ImageIcon className="h-3.5 w-3.5" /> },
  { id: "personal", label: "개인 설정", icon: <Settings className="h-3.5 w-3.5" /> },
];

const BACKGROUND_OPTIONS = [
  { id: "cernium", label: "세르니움", image: "/CharacterBackground/Cernium.png" },
] as const;

const THEME_OPTIONS = [
  {
    id: "dark",
    label: "기본",
    swatchBg: "bg-black/70",
    badgeBg: "bg-black/50",
    badgeText: "text-white",
  },
  {
    id: "light",
    label: "라이트",
    swatchBg: "bg-neutral-200",
    badgeBg: "bg-white/70",
    badgeText: "text-neutral-700",
  },
  {
    id: "sky",
    label: "하늘",
    swatchBg: "bg-sky-300",
    badgeBg: "bg-sky-200/70",
    badgeText: "text-sky-900",
  },
  {
    id: "pink",
    label: "핑크",
    swatchBg: "bg-pink-300",
    badgeBg: "bg-pink-200/70",
    badgeText: "text-pink-900",
  },
] as const;

type BackgroundId = (typeof BACKGROUND_OPTIONS)[number]["id"];
type ThemeId = (typeof THEME_OPTIONS)[number]["id"];

interface Props {
  characterName: string;
  characterImage: string;
  characterLevel: number;
  initialBio?: string | null;
  initialReviewNotification?: boolean;
  initialBackground?: BackgroundId;
  initialTheme?: ThemeId;
  badgeBg?: string;
  badgeHover?: string;
  badgeText?: string;
}

export default function CharacterSettingsModal({
  characterName,
  characterImage,
  characterLevel,
  initialBio,
  initialReviewNotification = true,
  initialBackground = "cernium",
  initialTheme = "dark",
  badgeBg = "bg-black/50",
  badgeHover = "hover:bg-black/70",
  badgeText = "text-white",
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("motion");

  // 모션 탭 상태
  const [action, setAction] = useState("A00");
  const [actionFrame, setActionFrame] = useState(0);
  const [emotion, setEmotion] = useState("E00");
  const [emotionFrame, setEmotionFrame] = useState(0);
  const [wmotion, setWmotion] = useState("W00");
  const [flipped, setFlipped] = useState(false);

  // 배경/테마 탭 상태
  const [background, setBackground] = useState<BackgroundId>(initialBackground);
  const [theme, setTheme] = useState<ThemeId>(initialTheme);

  // 개인 설정 탭 상태
  const [bio, setBio] = useState(initialBio ?? "");
  const [reviewNotification, setReviewNotification] = useState(initialReviewNotification);

  const [motionPending, startMotionTransition] = useTransition();
  const [themePending, startThemeTransition] = useTransition();
  const [personalPending, startPersonalTransition] = useTransition();
  const [mainPending, startMainTransition] = useTransition();
  const [motionError, setMotionError] = useState<string | null>(null);
  const [motionSuccess, setMotionSuccess] = useState(false);
  const [themeError, setThemeError] = useState<string | null>(null);
  const [themeSuccess, setThemeSuccess] = useState(false);
  const [personalError, setPersonalError] = useState<string | null>(null);
  const [personalSuccess, setPersonalSuccess] = useState(false);
  const [mainError, setMainError] = useState<string | null>(null);
  const [mainSuccess, setMainSuccess] = useState(false);

  const actionMaxFrame = ACTION_FRAMES[action] ?? 0;
  const emotionMaxFrame = EMOTION_FRAMES[emotion] ?? 0;

  const motionImageUrl = useMemo(() => {
    if (!characterImage) {
      return "";
    }
    try {
      const url = new URL(characterImage);
      url.searchParams.set("action", actionFrame > 0 ? `${action}.${actionFrame}` : action);
      url.searchParams.set("emotion", emotionFrame > 0 ? `${emotion}.${emotionFrame}` : emotion);
      url.searchParams.set("wmotion", wmotion);
      return url.toString();
    } catch {
      return characterImage;
    }
  }, [characterImage, action, actionFrame, emotion, emotionFrame, wmotion]);

  const selectedTheme = THEME_OPTIONS.find((t) => t.id === theme) ?? THEME_OPTIONS[0];

  async function patchSettings(payload: Record<string, unknown>) {
    const res = await fetch(`/api/character/${encodeURIComponent(characterName)}/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data as { error?: string }).error ?? "저장에 실패했습니다.");
    }
  }

  function handleMotionReset() {
    setAction("A00");
    setActionFrame(0);
    setEmotion("E00");
    setEmotionFrame(0);
    setWmotion("W00");
    setFlipped(false);
    setMotionError(null);
    setMotionSuccess(false);
  }

  function handleMotionSave() {
    setMotionError(null);
    setMotionSuccess(false);
    startMotionTransition(async () => {
      try {
        await patchSettings({ action, actionFrame, emotion, emotionFrame, wmotion, flip: flipped });
        setMotionSuccess(true);
        router.refresh();
      } catch (e) {
        setMotionError(e instanceof Error ? e.message : "저장에 실패했습니다.");
      }
    });
  }

  function handleThemeReset() {
    setBackground(initialBackground);
    setTheme(initialTheme);
    setThemeError(null);
    setThemeSuccess(false);
  }

  function handleThemeSave() {
    setThemeError(null);
    setThemeSuccess(false);
    startThemeTransition(async () => {
      try {
        await patchSettings({ background, theme });
        setThemeSuccess(true);
        router.refresh();
      } catch (e) {
        setThemeError(e instanceof Error ? e.message : "저장에 실패했습니다.");
      }
    });
  }

  function handlePersonalReset() {
    setBio(initialBio ?? "");
    setReviewNotification(initialReviewNotification);
    setPersonalError(null);
    setPersonalSuccess(false);
  }

  function handlePersonalSave() {
    setPersonalError(null);
    setPersonalSuccess(false);
    startPersonalTransition(async () => {
      try {
        await patchSettings({ bio, reviewNotification });
        setPersonalSuccess(true);
        router.refresh();
      } catch (e) {
        setPersonalError(e instanceof Error ? e.message : "저장에 실패했습니다.");
      }
    });
  }

  function handleSetMain() {
    setMainError(null);
    setMainSuccess(false);
    startMainTransition(async () => {
      try {
        const res = await fetch(`/api/character/${encodeURIComponent(characterName)}/set-main`, {
          method: "POST",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { error?: string }).error ?? "대표 캐릭터 설정에 실패했습니다.");
        }
        setMainSuccess(true);
        router.refresh();
      } catch (e) {
        setMainError(e instanceof Error ? e.message : "대표 캐릭터 설정에 실패했습니다.");
      }
    });
  }

  return (
    <>
      {/* 트리거 뱃지 */}
      <button
        onClick={() => setOpen(true)}
        className={`flex w-28 lg:w-36 cursor-pointer items-center justify-center gap-1 rounded-xl ${badgeBg} px-3 py-1 transition-colors ${badgeHover}`}
      >
        <Settings className={`h-3 w-3 ${badgeText} opacity-70`} />
        <span className={`font-galmuri text-[10px] ${badgeText} opacity-70`}>설정</span>
      </button>

      {/* 모달 */}
      {open &&
        createPortal(
          <dialog className="modal modal-open" style={{ zIndex: 9999 }}>
            <div className="modal-box max-w-md rounded-2xl p-0 overflow-hidden">
              {/* 헤더 */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <h2 className="text-lg font-bold">캐릭터 설정</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="btn btn-ghost btn-circle btn-sm"
                  aria-label="닫기"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 탭 */}
              <div className="flex border-b border-base-300 px-5">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 border-b-2 pb-2.5 pr-4 text-xs font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-base-content/50 hover:text-base-content/70"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 탭 내용 */}
              <div className="min-h-40 px-5 py-5">
                {/* ── 캐릭터 모션 탭 ── */}
                {activeTab === "motion" && (
                  <div className="flex flex-col gap-4">
                    {/* 미리보기 */}
                    <div className="flex h-40 items-center justify-center rounded-xl bg-base-200 overflow-hidden">
                      {motionImageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={motionImageUrl}
                          alt="캐릭터 미리보기"
                          className="h-full object-contain"
                          style={{ transform: `scaleX(${flipped ? -1.5 : 1.5}) scaleY(1.5)` }}
                        />
                      )}
                    </div>

                    {/* 컨트롤 */}
                    <div className="flex flex-wrap gap-3">
                      {/* action */}
                      <div className="flex flex-1 min-w-32 flex-col gap-2">
                        <label className="text-xs text-base-content/50">액션</label>
                        <select
                          value={action}
                          onChange={(e) => {
                            setAction(e.target.value);
                            setActionFrame(0);
                          }}
                          className="select select-sm w-full border border-base-300 bg-base-200 text-sm focus:outline-none"
                        >
                          {ACTIONS.map((a) => (
                            <option key={a.value} value={a.value}>
                              {a.label}
                            </option>
                          ))}
                        </select>
                        {actionMaxFrame > 0 && (
                          <select
                            value={actionFrame}
                            onChange={(e) => setActionFrame(Number(e.target.value))}
                            className="select select-sm w-full border border-base-300 bg-base-200 text-sm focus:outline-none"
                          >
                            {Array.from({ length: actionMaxFrame + 1 }, (_, i) => i).map((f) => (
                              <option key={f} value={f}>
                                {f} 프레임
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* emotion */}
                      <div className="flex flex-1 min-w-32 flex-col gap-2">
                        <label className="text-xs text-base-content/50">감정표현</label>
                        <select
                          value={emotion}
                          onChange={(e) => {
                            setEmotion(e.target.value);
                            setEmotionFrame(0);
                          }}
                          className="select select-sm w-full border border-base-300 bg-base-200 text-sm focus:outline-none"
                        >
                          {EMOTIONS.map((e) => (
                            <option key={e.value} value={e.value}>
                              {e.label}
                            </option>
                          ))}
                        </select>
                        {emotionMaxFrame > 0 && (
                          <select
                            value={emotionFrame}
                            onChange={(e) => setEmotionFrame(Number(e.target.value))}
                            className="select select-sm w-full border border-base-300 bg-base-200 text-sm focus:outline-none"
                          >
                            {Array.from({ length: emotionMaxFrame + 1 }, (_, i) => i).map((f) => (
                              <option key={f} value={f}>
                                {f} 프레임
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* wmotion */}
                      <div className="flex flex-1 min-w-32 flex-col gap-2">
                        <label className="text-xs text-base-content/50">무기</label>
                        <select
                          value={wmotion}
                          onChange={(e) => setWmotion(e.target.value)}
                          className="select select-sm w-full border border-base-300 bg-base-200 text-sm focus:outline-none"
                        >
                          {WMOTIONS.map((w) => (
                            <option key={w.value} value={w.value}>
                              {w.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setFlipped((prev) => !prev)}
                          className={`flex h-8 w-full cursor-pointer items-center justify-center rounded-lg border text-xs transition-colors ${
                            flipped
                              ? "border-base-content/30 bg-base-content/10 text-base-content"
                              : "border-base-300 bg-base-200 text-base-content/50 hover:bg-base-300"
                          }`}
                        >
                          <FlipHorizontal2 width={14} className="mr-1" /> 좌우 반전
                        </button>
                      </div>
                    </div>

                    {/* 구분선 + 버튼 */}
                    <div className="border-t border-base-300 pt-4">
                      {motionError && <p className="mb-3 text-xs text-error">{motionError}</p>}
                      {motionSuccess && <p className="mb-3 text-xs text-success">저장되었습니다.</p>}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleMotionReset}
                          disabled={motionPending}
                          className="btn btn-sm btn-ghost border border-base-300"
                        >
                          리셋
                        </button>
                        <button
                          onClick={handleMotionSave}
                          disabled={motionPending}
                          className="btn btn-sm btn-primary"
                        >
                          {motionPending ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            "저장"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 배경 / 테마 탭 ── */}
                {activeTab === "theme" && (
                  <div className="flex flex-col gap-5">
                    {/* 배경 섹션 */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-xs font-medium text-base-content/50">배경</label>
                      <div className="flex flex-wrap gap-2.5">
                        {BACKGROUND_OPTIONS.map((bg) => {
                          const selected = background === bg.id;
                          return (
                            <button
                              key={bg.id}
                              onClick={() => setBackground(bg.id)}
                              className={`relative h-20 w-32 overflow-hidden rounded-xl border-2 transition-all ${
                                selected
                                  ? "border-primary shadow-md"
                                  : "border-base-300 hover:border-base-content/30"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={bg.image}
                                alt={bg.label}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/40 py-1 text-center text-[10px] text-white">
                                {bg.label}
                              </div>
                              {selected && (
                                <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                                  <Check className="h-2.5 w-2.5 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 구분선 */}
                    <div className="border-t border-base-300" />

                    {/* 테마 섹션 */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-xs font-medium text-base-content/50">뱃지 색상</label>

                      {/* 미리보기 뱃지 */}
                      <div className="flex items-center gap-2 rounded-xl bg-base-200 px-4 py-3">
                        <span className="text-xs text-base-content/40">미리보기</span>
                        <span
                          className={`rounded-xl px-3 py-1 text-[10px] font-medium ${selectedTheme.badgeBg} ${selectedTheme.badgeText}`}
                        >
                          직업명
                        </span>
                        <span
                          className={`rounded-xl px-3 py-1 text-[10px] font-medium ${selectedTheme.badgeBg} ${selectedTheme.badgeText}`}
                        >
                          유니온 9,999
                        </span>
                      </div>

                      {/* 색상 스와치 */}
                      <div className="flex flex-wrap gap-2">
                        {THEME_OPTIONS.map((t) => {
                          const selected = theme === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => setTheme(t.id)}
                              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-2 transition-all ${
                                selected
                                  ? "border-primary"
                                  : "border-base-300 hover:border-base-content/30"
                              }`}
                            >
                              <span
                                className={`h-6 w-6 rounded-full border border-base-300 ${t.swatchBg}`}
                              />
                              <span className="text-[10px] text-base-content/60">{t.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 구분선 + 버튼 */}
                    <div className="border-t border-base-300 pt-1">
                      {themeError && <p className="mb-3 text-xs text-error">{themeError}</p>}
                      {themeSuccess && <p className="mb-3 text-xs text-success">저장되었습니다.</p>}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleThemeReset}
                          disabled={themePending}
                          className="btn btn-sm btn-ghost border border-base-300"
                        >
                          리셋
                        </button>
                        <button
                          onClick={handleThemeSave}
                          disabled={themePending}
                          className="btn btn-sm btn-primary"
                        >
                          {themePending ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            "저장"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 개인 설정 탭 ── */}
                {activeTab === "personal" && (
                  <div className="flex flex-col gap-5">
                    {/* 대표 캐릭터 */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-xs font-medium text-base-content/50">대표 캐릭터</label>
                      <div className="flex items-center justify-between rounded-xl bg-base-200 px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">현재 캐릭터로 설정</span>
                          {characterLevel < 265 && (
                            <span className="text-xs text-base-content/40">
                              265레벨 이상만 등록 가능합니다.
                            </span>
                          )}
                        </div>
                        <button
                          onClick={handleSetMain}
                          disabled={characterLevel < 265 || mainPending}
                          className="btn btn-sm btn-primary"
                        >
                          {mainPending ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            "설정"
                          )}
                        </button>
                      </div>
                      {mainError && <p className="text-xs text-error">{mainError}</p>}
                      {mainSuccess && (
                        <p className="text-xs text-success">대표 캐릭터로 설정되었습니다.</p>
                      )}
                    </div>

                    {/* 구분선 */}
                    <div className="border-t border-base-300" />

                    {/* 알림 설정 */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-xs font-medium text-base-content/50">알림 설정</label>
                      <div className="flex items-center justify-between rounded-xl bg-base-200 px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">리뷰 알림</span>
                          <span className="text-xs text-base-content/40">
                            새 리뷰가 등록되면 알림을 보냅니다.
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-sm toggle-primary"
                          checked={reviewNotification}
                          onChange={(e) => setReviewNotification(e.target.checked)}
                        />
                      </div>
                    </div>

                    {/* 구분선 */}
                    <div className="border-t border-base-300" />

                    {/* 소개글 */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-xs font-medium text-base-content/50">소개글</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={200}
                        placeholder="소개글을 입력해주세요."
                        rows={3}
                        className="textarea textarea-sm w-full resize-none border border-base-300 bg-base-200 text-sm focus:outline-none"
                      />
                      <span className="text-right text-xs text-base-content/40">
                        {bio.length}/200
                      </span>
                    </div>

                    {/* 구분선 + 버튼 */}
                    <div className="border-t border-base-300 pt-1">
                      {personalError && <p className="mb-3 text-xs text-error">{personalError}</p>}
                      {personalSuccess && (
                        <p className="mb-3 text-xs text-success">저장되었습니다.</p>
                      )}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handlePersonalReset}
                          disabled={personalPending}
                          className="btn btn-sm btn-ghost border border-base-300"
                        >
                          리셋
                        </button>
                        <button
                          onClick={handlePersonalSave}
                          disabled={personalPending}
                          className="btn btn-sm btn-primary"
                        >
                          {personalPending ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            "저장"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 백드롭 */}
            <div className="modal-backdrop" onClick={() => setOpen(false)} />
          </dialog>,
          document.body,
        )}
    </>
  );
}
