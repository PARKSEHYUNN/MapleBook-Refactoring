// src/components/providers/CursorManager.tsx

"use client";

import { useEffect, useState } from "react";

export default function CursorManager({ children }: { children: React.ReactNode }) {
  const [frame, setFrame] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    // 1. 2프레임 깜빡임을 위한 타이머 (예: 0.5초 간격)
    const interval = setInterval(() => {
      setFrame((prev) => (prev === 1 ? 2 : 1));
    }, 500);

    // 2. 호버 및 클릭 감지 이벤트
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(window.getComputedStyle(target).cursor === "pointer");
    };
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // 상태에 따른 클래스 결정
  const getCursorClass = () => {
    if (isMouseDown) {
      return "cursor-active";
    }
    if (isHovering) {
      return `cursor-hover-${frame}`;
    }
    return "cursor-normal";
  };

  return <div className={getCursorClass()}>{children}</div>;
}
