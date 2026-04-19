/**
 * 숫자를 억/만 단위 한국어 형식으로 변환
 * @example 1_234_500_000 → "12억 3450만"
 */
export function formatCombatPower(value: number): string {
  const uk = Math.floor(value / 100_000_000);
  const man = Math.floor((value % 100_000_000) / 10_000);
  const remainder = value % 10_000;

  const parts: string[] = [];
  if (uk > 0) parts.push(`${uk}억`);
  if (man > 0) parts.push(`${man}만`);
  if (remainder > 0) parts.push(`${remainder}`);
  return parts.length > 0 ? parts.join(" ") : "0";
}

/**
 * 전투력 증감량을 +/- 부호 포함 한국어 형식으로 변환 (장비 툴팁 diff 표시용)
 * @example 50_000 → "+ 5만", -10_000 → "- 1만"
 */
export function formatCombatPowerDiff(n: number): string {
  const abs = Math.abs(n);
  const eok = Math.floor(abs / 100_000_000);
  const man = Math.floor((abs % 100_000_000) / 10_000);
  const rest = abs % 10_000;

  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok}억`);
  if (man > 0) parts.push(`${man}만`);
  if (rest > 0 || parts.length === 0) parts.push(`${rest}`);

  const sign = n >= 0 ? "+" : "-";
  return `${sign} ${parts.join(" ")}`;
}

/**
 * ISO 날짜 문자열을 "YYYY. M. D." 형식으로 변환
 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}
