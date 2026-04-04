/**
 * @file src/lib/nexon.ts - NEXON Open API 요청 및 관리
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * NEXON Open API와의 통신을 전담하는 라이브러리 모듈입니다.
 * 게임 데이터(메이플스토리) 조회를 위한 API Key 인증,
 * 엔드포인트 관리 및 Fetch 기반의 공통 요청 로직을 포함합니다.
 * 응답 데이터의 타입 정의와 에러 핸들링을 통해 서비스 내에서 안정적인
 * 외부 데이터 연동을 지원합니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import { AccountOUIDType, CharacterListType } from "@/types/character";
import { NEXONOpenAPIError } from "@/types/common";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const NEXON_OPEN_API_BASE_URL = "https://open.api.nexon.com";

/**
 * NEXON Open API의 공통 Fetch Wrapper
 * API Key를 헤더를 자동으로 주입하고, 에러 처리를 일관되게 수행합니다.
 * @param endpoint - NEXON Open API의 Endpoint
 * @param option - 추가 옵션 (선택)
 * @param apiKey - 사용자 API 키 (선택, 생략 시 서버 환경변수 사용)
 * @throws {Error} - NEXON Open API 응답이 ok가 아닐 경우 (4xx, 5xx)
 */
async function nexonFetch<T>({
  endpoint,
  option = {},
  apiKey = "",
}: {
  endpoint: string;
  option?: RequestInit;
  apiKey?: string;
}): Promise<T> {
  // CloudFlare 로컬 시크릿 파일 접근
  const { env } = await getCloudflareContext();

  // 만약 입력받은 apiKey가 없다면 서버의 apiKey를 사용한다.
  const finalApiKey = apiKey || env.NEXON_API_SERVICE_KEY;

  // endpoint는 반드시 '/'로 시작해야 합니다. (예: '/maplestory/v1/id')
  const url = `${NEXON_OPEN_API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...option,
    headers: {
      "x-nxopen-api-key": finalApiKey,
      accept: "application/json",
      ...option.headers, // 호출자가 헤더를 직접 지정하면 기본값을 덮어씁니다.
    },
  });

  if (!response.ok) {
    // 넥슨 API가 반환하는 에러 메세지 파싱
    const errorData = (await response.json().catch(() => ({}))) as NEXONOpenAPIError;
    const errorMessage = errorData.error?.name || JSON.stringify(errorData) || "Unknown Error";
    throw new Error(`NEXON Open API Error: ${response.status} - ${errorMessage}`);
  }

  return response.json() as Promise<T>;
}

/**
 * 사용자의 NEXON Open API키를 받아서, 사용자의 계정 OUID를 출력하는 함수 입니다.
 * @param apiKey - 사용자의 NEXON Open API Key
 * @returns - 해당 NEXON Open API Key의 OUID
 */
export async function getAccountOUID(apiKey: string) {
  const { ouid } = await nexonFetch<AccountOUIDType>({
    endpoint: `/maplestory/v1/ouid`,
    apiKey: apiKey,
  });

  return ouid;
}

export async function getCharacterList(apiKey: string) {
  const data = await nexonFetch<CharacterListType>({
    endpoint: `/maplestory/v1/character/list`,
    apiKey: apiKey,
  });

  return data;
}
