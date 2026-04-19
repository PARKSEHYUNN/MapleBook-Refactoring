"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface MotionContextValue {
  motionUrl: string;
  setMotionUrl: (url: string) => void;
  flipped: boolean;
  setFlipped: (v: boolean | ((prev: boolean) => boolean)) => void;
}

const MotionContext = createContext<MotionContextValue | null>(null);

export function CharacterMotionProvider({
  children,
  defaultUrl,
  defaultFlipped = false,
}: {
  children: React.ReactNode;
  defaultUrl: string;
  defaultFlipped?: boolean;
}) {
  const [motionUrl, setMotionUrl] = useState(defaultUrl);
  const [flipped, setFlipped] = useState(defaultFlipped);

  // router.refresh() 후 서버에서 새 defaultFlipped props가 오면 동기화
  useEffect(() => {
    setFlipped(defaultFlipped);
  }, [defaultFlipped]);

  const value = useMemo(
    () => ({ motionUrl, setMotionUrl, flipped, setFlipped }),
    [motionUrl, flipped],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useCharacterMotion() {
  const ctx = useContext(MotionContext);
  if (!ctx) {
    throw new Error("useCharacterMotion must be used within CharacterMotionProvider");
  }
  return ctx;
}

export function CharacterHeaderImage({ alt }: { alt: string }) {
  const { motionUrl, flipped } = useCharacterMotion();
  if (!motionUrl) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={motionUrl}
      alt={alt}
      loading="eager"
      style={{
        transform: flipped ? "translateX(-50%) scale(-1, 1)" : "translateX(-50%) scale(1)",
      }}
      className="absolute left-1/2 top-8 z-0 object-contain drop-shadow-lg pixelated"
    />
  );
}
