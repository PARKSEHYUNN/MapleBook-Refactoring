// src/components/layout/AuthGate.tsx

"use client";

import { useEffect } from "react";

import { TERMS_VERSION } from "@/constants/terms";
import { useMe } from "@/hooks/useMe";

import ConsentModal from "../auth/ConsentModal";
import SetupModal from "../auth/SetupModal";

export default function AuthGate() {
  const { me, mutate } = useMe();

  useEffect(() => {
    if (me?.status === "NEEDS_SETUP") {
      // 백그라운드 fetch
      fetch("/api/me/characterList");
    }
  }, [me?.status]);

  if (me?.status === "NEEDS_SETUP") {
    return <SetupModal />;
  }

  if (me?.status === "NEEDS_CONSENT") {
    const handleConsentNext = async () => {
      await fetch("/api/me/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          termsVersion: TERMS_VERSION.SERVICE,
          privacyVersion: TERMS_VERSION.PRIVACY,
          mainCharacterId: Number(me.mainCharacterId),
        }),
      });
      await mutate();
    };
    return <ConsentModal onNext={handleConsentNext} mainCharacterId={me.mainCharacterId} />;
  }

  return null;
}
