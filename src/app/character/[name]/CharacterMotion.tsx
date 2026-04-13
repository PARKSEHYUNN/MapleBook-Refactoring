"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDown, FlipHorizontal2, Pause, Play } from "lucide-react";

import {
  ACTION_FRAMES,
  ACTIONS,
  EMOTION_FRAMES,
  EMOTIONS,
  WMOTIONS,
} from "@/constants/character-motion";
import { DefaultSettingsJsonType } from "@/types/user";

import { useCharacterMotion } from "./CharacterMotionProvider";

interface Props {
  characterImage: string;
  initialSettings?: DefaultSettingsJsonType;
}

export default function CharacterMotion({ characterImage, initialSettings }: Props) {
  const { setMotionUrl, flipped, setFlipped } = useCharacterMotion();

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(initialSettings?.action ?? "A00");
  const [actionFrame, setActionFrame] = useState(initialSettings?.actionFrame ?? 0);
  const [emotion, setEmotion] = useState(initialSettings?.emotion ?? "E00");
  const [emotionFrame, setEmotionFrame] = useState(initialSettings?.emotionFrame ?? 0);
  const [wmotion, setWmotion] = useState(initialSettings?.wmotion ?? "W00");
  const [actionPlaying, setActionPlaying] = useState(false);
  const [emotionPlaying, setEmotionPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const actionMaxFrame = ACTION_FRAMES[action] ?? 0;
  const emotionMaxFrame = EMOTION_FRAMES[emotion] ?? 0;

  function handleActionChange(value: string) {
    setAction(value);
    setActionFrame(0);
    setActionPlaying(false);
  }

  function handleEmotionChange(value: string) {
    setEmotion(value);
    setEmotionFrame(0);
    setEmotionPlaying(false);
  }

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!actionPlaying && !emotionPlaying) {
      return;
    }
    intervalRef.current = setInterval(() => {
      if (actionPlaying) {
        setActionFrame((prev) => (prev >= actionMaxFrame ? 0 : prev + 1));
      }
      if (emotionPlaying) {
        setEmotionFrame((prev) => (prev >= emotionMaxFrame ? 0 : prev + 1));
      }
    }, 500);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [actionPlaying, emotionPlaying, actionMaxFrame, emotionMaxFrame]);

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

  useEffect(() => {
    setMotionUrl(motionImageUrl);
  }, [motionImageUrl, setMotionUrl]);

  return (
    <div className="mt-2 rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
      {/* 헤더 */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-base-200"
      >
        <span className="text-sm text-base-content/70">캐릭터 모션</span>
        <ChevronDown
          width={16}
          className={`text-base-content/50 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* 내용 - 슬라이드 다운 */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-3 px-4 pb-4 pt-1">
            {/* action */}
            <div className="flex flex-1 min-w-32 flex-col gap-2">
              <label className="text-xs text-base-content/50">액션</label>
              <select
                value={action}
                onChange={(e) => handleActionChange(e.target.value)}
                className="select select-sm w-full border border-base-300 bg-base-200 text-sm focus:outline-none"
              >
                {ACTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
              {actionMaxFrame > 0 && (
                <div className="flex gap-1">
                  <select
                    value={actionFrame}
                    onChange={(e) => {
                      setActionFrame(Number(e.target.value));
                      setActionPlaying(false);
                    }}
                    className="select select-sm flex-1 border border-base-300 bg-base-200 text-sm focus:outline-none"
                  >
                    {Array.from({ length: actionMaxFrame + 1 }, (_, i) => i).map((f) => (
                      <option key={f} value={f}>
                        {f} 프레임
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setActionPlaying((prev) => !prev)}
                    className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border text-xs transition-colors ${actionPlaying ? "border-base-content/30 bg-base-content/10 text-base-content" : "border-base-300 bg-base-200 text-base-content/50 hover:bg-base-300"}`}
                  >
                    {actionPlaying ? <Pause width={12} /> : <Play width={12} />}
                  </button>
                </div>
              )}
            </div>

            {/* emotion */}
            <div className="flex flex-1 min-w-32 flex-col gap-2">
              <label className="text-xs text-base-content/50">감정표현</label>
              <select
                value={emotion}
                onChange={(e) => handleEmotionChange(e.target.value)}
                className="select select-sm w-full border border-base-300 bg-base-200 text-sm focus:outline-none"
              >
                {EMOTIONS.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
              {emotionMaxFrame > 0 && (
                <div className="flex gap-1">
                  <select
                    value={emotionFrame}
                    onChange={(e) => {
                      setEmotionFrame(Number(e.target.value));
                      setEmotionPlaying(false);
                    }}
                    className="select select-sm flex-1 border border-base-300 bg-base-200 text-sm focus:outline-none"
                  >
                    {Array.from({ length: emotionMaxFrame + 1 }, (_, i) => i).map((f) => (
                      <option key={f} value={f}>
                        {f} 프레임
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setEmotionPlaying((prev) => !prev)}
                    className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border text-xs transition-colors ${emotionPlaying ? "border-base-content/30 bg-base-content/10 text-base-content" : "border-base-300 bg-base-200 text-base-content/50 hover:bg-base-300"}`}
                  >
                    {emotionPlaying ? <Pause width={12} /> : <Play width={12} />}
                  </button>
                </div>
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
        </div>
      </div>
    </div>
  );
}
