import { useState, useTransition } from "react";

interface UseAsyncActionResult {
  pending: boolean;
  error: string | null;
  success: boolean;
  run: (action: () => Promise<void>) => void;
  reset: () => void;
}

export function useAsyncAction(): UseAsyncActionResult {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function run(action: () => Promise<void>) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        await action();
        setSuccess(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "저장에 실패했습니다.");
      }
    });
  }

  function reset() {
    setError(null);
    setSuccess(false);
  }

  return { pending, error, success, run, reset };
}
