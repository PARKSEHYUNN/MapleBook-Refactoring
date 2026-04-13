/**
 * @file src/types/common.ts - 기본 데이터 타입 정의
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * 프로젝트에서 사용하는 기본적인 정보에 대한
 * TypeScript 인터페이스 및 타입들을 모아둔 파일입니다.
 * 이곳의 정의된 타입들은 주로 DB 스키마(schema.ts)의 JSON 컬럼 타입 단언($type<T>) 및
 * 프론트엔드 UI 렌더링, API 응답 타입 등에 재사용됩니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

import z from "zod";

export type UserRole = "user" | "admin";
export type WorldName =
  | "오로라"
  | "레드"
  | "이노시스"
  | "유니온"
  | "스카니아"
  | "루나"
  | "제니스"
  | "크로아"
  | "베라"
  | "엘리시움"
  | "아케인"
  | "노바"
  | "챌린저스"
  | "챌린저스2"
  | "챌린저스3"
  | "챌린저스4"
  | "에오스"
  | "헬리오스";
export type ClassName =
  | "초보자"
  | "검사"
  | "파이터"
  | "페이지"
  | "스피어맨"
  | "크루세이더"
  | "나이트"
  | "버서커"
  | "히어로"
  | "팔라딘"
  | "다크나이트"
  | "매지션"
  | "위자드(불,독)"
  | "위자드(썬,콜)"
  | "클레릭"
  | "메이지(불,독)"
  | "메이지(썬,콜)"
  | "프리스트"
  | "아크메이지(불,독)"
  | "아크메이지(썬,콜)"
  | "비숍"
  | "아처"
  | "헌터"
  | "사수"
  | "레인저"
  | "저격수"
  | "보우마스터"
  | "신궁"
  | "아처(패스파인더)"
  | "에이션트아처"
  | "체이서"
  | "패스파인더"
  | "로그"
  | "어쌔신"
  | "시프"
  | "허밋"
  | "시프마스터"
  | "나이트로드"
  | "섀도어"
  | "세미듀어러"
  | "듀어러"
  | "듀얼마스터"
  | "슬래셔"
  | "듀얼블레이더"
  | "해적"
  | "인파이터"
  | "건슬링거"
  | "캐논슈터"
  | "버커니어"
  | "발키리"
  | "캐논블래스터"
  | "바이퍼"
  | "캡틴"
  | "캐논마스터"
  | "노블레스"
  | "소울마스터"
  | "플레임위자드"
  | "윈드브레이커"
  | "나이트워커"
  | "스트라이커"
  | "미하일"
  | "아란"
  | "에반"
  | "시티즌"
  | "베틀메이지"
  | "와일드헌터"
  | "메카닉"
  | "데몬슬레이어"
  | "데몬어벤져"
  | "제논"
  | "블래스터"
  | "메르세데스"
  | "팬텀"
  | "루미너스"
  | "카이저"
  | "엔젤릭버스터"
  | "제로"
  | "은월"
  | "키네시스"
  | "카데나"
  | "일리움"
  | "아크"
  | "호영"
  | "아델"
  | "카인"
  | "라라"
  | "칼리"
  | "렌";
export type UnionGrade =
  | "없음"
  | "노비스 유니온 1"
  | "노비스 유니온 2"
  | "노비스 유니온 3"
  | "노비스 유니온 4"
  | "노비스 유니온 5"
  | "베테랑 유니온 1"
  | "베테랑 유니온 2"
  | "베테랑 유니온 3"
  | "베테랑 유니온 4"
  | "베테랑 유니온 5"
  | "마스터 유니온 1"
  | "마스터 유니온 2"
  | "마스터 유니온 3"
  | "마스터 유니온 4"
  | "마스터 유니온 5"
  | "그랜드 마스터 유니온 1"
  | "그랜드 마스터 유니온 2"
  | "그랜드 마스터 유니온 3"
  | "그랜드 마스터 유니온 4"
  | "그랜드 마스터 유니온 5"
  | "슈프림 유니온 1"
  | "슈프림 유니온 2"
  | "슈프림 유니온 3"
  | "슈프림 유니온 4"
  | "슈프림 유니온 5";
export type StarRating = 1 | 2 | 3 | 4 | 5;
export type VoteRating = -1 | 1;
export type ReviewReportReason = "스팸" | "욕설/비하" | "허위 정보" | "기타";
export type ReviewReportStatus = "pending" | "resolved" | "dismissed";
export type ViewCountPeriodType = "daily" | "weekly" | "total";
export type NotificationsType = "review" | "notices";

export interface NEXONOpenAPIError {
  error?: {
    name: string;
    message?: string;
  };
}

export const loginSchema = z.object({
  apiKey: z.string().min(1, "API key is missing."),
  rememberMe: z.boolean().optional().default(false),
});

export const testLoginSchema = z.object({
  secret: z.string().min(1, "SECRET key is missing."),
});

export type loginBodyType = z.infer<typeof loginSchema>;

export type MeResponse =
  | { status: "UNAUTHORIZED" }
  | { status: "NEEDS_SETUP" }
  | { status: "NEEDS_CONSENT"; mainCharacterId: string }
  | { status: "NEEDS_CHARACTER" }
  | { status: "ACTIVE"; mainCharacterId: string; mainCharacterImage: string | null; mainCharacterName: string | null };
