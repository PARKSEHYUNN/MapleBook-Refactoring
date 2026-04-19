"use client";

/**
 * @file src/components/ui/Tooltip.tsx - 공통 툴팁 컴포넌트
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 마우스/터치 위치 기반으로 툴팁을 렌더링합니다.
 * Portal로 document.body에 마운트하므로 overflow:hidden 부모에 영향받지 않으며,
 * 커서 위치에서 오프셋을 더한 뒤 뷰포트 경계 안으로 클램프합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  /** 툴팁을 트리거하는 요소 */
  children: ReactNode;
  /** 툴팁 내에 표시할 콘텐츠 (텍스트 또는 JSX) */
  content: ReactNode;
  /** 툴팁 말풍선 박스에 적용할 추가 클래스 */
  className?: string;
  /** 래퍼 요소에 적용할 클래스 (기본값: "inline-flex") — 전체 너비 행에는 "flex w-full" 사용 */
  wrapperClassName?: string;
  /** 커서 기준 X 오프셋 (기본값: 14) */
  offsetX?: number;
  /** 커서 기준 Y 오프셋 (기본값: 14) */
  offsetY?: number;
}

/** 커서/터치 포인트에서 툴팁까지의 오프셋 (px) */
const OFFSET_X = 14;
const OFFSET_Y = 14;
/** 뷰포트 가장자리 여백 (px) */
const VIEWPORT_MARGIN = 8;

interface Point {
  x: number;
  y: number;
}

function clampToViewport(x: number, y: number, w: number, h: number): Point {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.max(VIEWPORT_MARGIN, Math.min(x, vw - w - VIEWPORT_MARGIN)),
    y: Math.max(VIEWPORT_MARGIN, Math.min(y, vh - h - VIEWPORT_MARGIN)),
  };
}

export default function Tooltip({
  children,
  content,
  className = "",
  wrapperClassName = "inline-flex",
  offsetX = OFFSET_X,
  offsetY = OFFSET_Y,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<Point>({ x: -9999, y: -9999 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<Point>({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 툴팁이 마운트된 직후 실제 크기로 클램프 위치 재계산
  useLayoutEffect(() => {
    if (!visible || !tooltipRef.current) return;
    const { width, height } = tooltipRef.current.getBoundingClientRect();
    const { x, y } = cursorRef.current;
    setPos(clampToViewport(x + offsetX, y + offsetY, width, height));
  }, [visible, offsetX, offsetY]);

  function updatePos(x: number, y: number) {
    cursorRef.current = { x, y };
    if (visible && tooltipRef.current) {
      const { width, height } = tooltipRef.current.getBoundingClientRect();
      setPos(clampToViewport(x + offsetX, y + offsetY, width, height));
    }
  }

  function handleMouseEnter(e: React.MouseEvent) {
    cursorRef.current = { x: e.clientX, y: e.clientY };
    timerRef.current = setTimeout(() => setVisible(true), 120);
  }

  function handleMouseMove(e: React.MouseEvent) {
    updatePos(e.clientX, e.clientY);
  }

  function handleMouseLeave() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setPos({ x: -9999, y: -9999 });
  }

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    if (!t) return;
    cursorRef.current = { x: t.clientX, y: t.clientY };
    timerRef.current = setTimeout(() => setVisible(true), 300);
  }

  function handleTouchMove(e: React.TouchEvent) {
    const t = e.touches[0];
    if (!t) return;
    updatePos(t.clientX, t.clientY);
  }

  function handleTouchEnd() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
    setPos({ x: -9999, y: -9999 });
  }

  return (
    <div
      className={`relative ${wrapperClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className="fixed z-9999 pointer-events-none"
            style={{ top: pos.y, left: pos.x }}
          >
            <div
              className={[
                "min-w-max rounded-xl border border-base-300 bg-base-200 px-3 py-2 shadow-lg",
                "text-xs text-base-content",
                "animate-in fade-in zoom-in-95 duration-100",
                className,
              ].join(" ")}
            >
              {content}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
