// src/components/auth/SetupModal.tsx

"use client";

import { useState } from "react";

import { useMe } from "@/hooks/useMe";
import { CharacterList, CharacterListType } from "@/types/character";

import ConsentModal from "./ConsentModal";
import MainCharacterModal from "./MainCharacterModal";

type Step = "consent" | "character";

interface ConsentData {
  termsVersion: string;
  privacyVersion: string;
}

export default function SetupModal() {
  const [step, setStep] = useState<Step>("consent");
  const [consentData, setConsentData] = useState<ConsentData | null>(null);
  const [characterList, setCharacterList] = useState<CharacterList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useMe();

  // ConsentModal에서 "다음" 클릭 시
  const handleConsentNext = async (data: ConsentData) => {
    setConsentData(data);
    setIsLoading(true);

    // 캐릭터 목록 미리 fetch
    const res = await fetch("/api/me/characterList");
    const json = (await res.json()) as { data: CharacterList[] };
    setCharacterList(json.data.sort((a, b) => b.character_level - a.character_level));
    setIsLoading(false);
    setStep("character");
  };

  // MainCharacterModal "설정하기" or "건너뛰기"
  const handleSubmit = async (ocid: string | null) => {
    setIsLoading(true);
    await fetch("/api/me/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...consentData, mainCharacterId: ocid }),
    });
    await mutate();
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    const res = await fetch("/api/me/characterList");
    const json = (await res.json()) as { data: CharacterList[] };
    setCharacterList(json.data.sort((a, b) => b.character_level - a.character_level));
    setIsLoading(false);
  };

  if (step === "consent") {
    return <ConsentModal onNext={handleConsentNext} />;
  }

  return (
    <MainCharacterModal
      characters={characterList}
      onSelect={(ocid) => handleSubmit(ocid)}
      onSkip={() => handleSubmit(null)}
      onRefresh={() => handleRefresh()}
      isLoading={isLoading}
    />
  );
}
