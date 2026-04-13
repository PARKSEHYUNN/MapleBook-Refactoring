# MapleBook v1.0

메이플스토리 유저가 캐릭터를 검색하고 리뷰를 남기는 웹 서비스.

## Hard Rules (절대 어기지 말 것)

1. **리뷰 작성은 로그인한 유저만 가능** — 비로그인 유저가 작성 시도 시 로그인 페이지로 리다이렉트
2. **조회는 모든 유저 가능** — 캐릭터 검색, 리뷰 조회는 인증 불필요
3. **첫 로그인 시 약관 동의 필수** — 미동의 시 즉시 로그아웃, 서비스 이용 불가
4. **대표 캐릭터는 265레벨 이상만 등록 가능** — 레벨 미달 캐릭터는 UI에서 선택 불가 처리
5. **대표 캐릭터 미설정 시 리뷰 작성 불가** — 작성 시도 시 대표 캐릭터 설정 유도 메시지 표시
6. **캐릭터 정보 갱신은 유저의 명시적 요청으로만** — 갱신 버튼 클릭 시에만 NEXON API 호출
7. **NEXON API 호출 실패 시 캐시된 D1 데이터 반환** — 캐시도 없으면 에러 메시지 표시 (빈 화면 금지)
8. **Workers AI 요약 실패 시 개별 리뷰 목록으로 폴백** — AI 오류가 리뷰 조회를 막아선 안 됨

## Quick Ref

- **Entry:** `src/app/` (Next.js App Router)
- **Dev:** `npm run dev`
- **Build:** `npm run build`
- **Deploy:** `npm run deploy` (Cloudflare Workers via OpenNext)
- **DB Migration:** `npx drizzle-kit migrate`
- **DB Schema:** `src/db/schema.ts`
- **NEXON API Client:** `src/lib/nexon.ts`

## Architecture

```
브라우저 → Next.js (App Router) → Cloudflare D1
                               ↘ NEXON Open API (캐시 미스 또는 갱신 요청 시)
                               ↘ Cloudflare Workers AI (리뷰 요약)
```

**DB-first 원칙:** UI는 항상 D1에서 데이터를 읽음. NEXON API는 직접 호출하지 않음.
API 호출은 서버 사이드 로직(Route Handler / Server Action)에서만 수행.

## Secrets Policy

- `.env` 파일을 절대 읽거나 출력하거나 로그에 남기지 말 것
- `.env` 파일을 커밋하지 말 것 — `.env.example`이 템플릿 (실제 값 없음)
- 새 API 키 추가 시 → `.env.example`에 placeholder 추가 + 환경 변수로만 로드

## Dev Conventions

- 머지 전 테스트 통과 필수. 테스트 없이 완료 선언 금지.
- 새 기능은 환경 변수로 opt-in, 기본값 OFF.
- 커밋은 명시적으로 요청받을 때만 생성.
- 요청한 파일만 수정. 요청하지 않은 파일은 손대지 말 것.

## Compact Instructions

컨텍스트 압축 시 반드시 보존:
1. Hard Rules (위 8개)
2. 현재 활성 브랜치 / 미커밋 파일 목록
3. 진행 중인 태스크와 상태
4. 조사 중인 활성 에러 또는 버그
5. Dev Conventions
6. 이번 세션에서 수정한 파일 경로
