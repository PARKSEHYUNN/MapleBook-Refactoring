/**
 * @file src/lib/crypto.ts - AES-GCM 기반 암호화 및 복호화 유틸리티
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * Web Crypto API를 사용하여 데이터의 기밀성을 보장하는 보안 모듈입니다.
 * AES-GCM 알고리즘을 활용하여 텍스트 데이터의 암호화 및 복호화를 수행하며,
 * 초기화 벡터(IV)를 암호문과 결합하여 Base64 형태로 안전하게 인코딩합니다.
 * 사용자 세션 토큰, 민감한 정보의 저장 및 전송 시 데이터 보호를 위해 사용됩니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

/**
 * 시크릿 문자열에서 AES-GCM CryptoKey 생성
 * 시크릿을 UTF-8 인코딩 후 32바이트로 잘라 raw 키로 임포트
 * @param secret - 키 소스 문자열 (32자 이상 권장)
 */
async function getKey(secret: string): Promise<CryptoKey> {
  const raw = new TextEncoder().encode(secret).slice(0, 32);
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

/**
 * 평문 문자열을 AES-GCM으로 암호화하여 Base64 문자열 반환
 * 랜덤 12바이트 IV를 생성하여 암호문 앞에 붙임 (IV + ciphertext)
 * @param text - 암호화할 평문
 * @param secret - 암호화 키 소스
 * @returns Base64 인코딩된 (IV + 암호문) 문자열
 */
export async function encrypt(text: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(text);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  const buf = new Uint8Array([...iv, ...new Uint8Array(ciphertext)]);
  return btoa(String.fromCharCode(...buf));
}

/**
 * Base64 암호문(IV + ciphertext)을 AES-GCM으로 복호화하여 평문 반환
 * 복호화 실패(변조·잘못된 키 등) 시 null 반환
 * @param token - Base64 인코딩된 (IV + 암호문) 문자열
 * @param secret - 복호화 키 소스
 * @returns 복호화된 평문, 실패 시 null
 */
export async function decrypt(token: string, secret: string): Promise<string | null> {
  try {
    const buf = Uint8Array.from(atob(token), (c) => c.charCodeAt(0));
    const iv = buf.slice(0, 12);
    const ciphertext = buf.slice(12);
    const key = await getKey(secret);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
    return new TextDecoder().decode(plain);
  } catch {
    return null;
  }
}
