# 메이플스토리 공지 정보 조회 API

**Base URL:** `https://open.api.nexon.com`  
**인증:** 모든 요청에 헤더 `x-nxopen-api-key` 필요  
**주의:** 실시간 조회 또는 최소 일 1회 배치 처리를 권장합니다.

---

## 1. 공지사항 목록 조회

**GET** `/maplestory/v1/notice`

최근 공지사항 20건을 조회합니다.

**파라미터:** `x-nxopen-api-key` (header)만 필요

**응답 200:**
```json
{
  "notice": [
    {
      "title": "string",
      "url": "string",
      "notice_id": "number",
      "date": "string (KST)"
    }
  ]
}
```

---

## 2. 공지사항 상세 조회

**GET** `/maplestory/v1/notice/detail`

특정 공지사항의 상세 내용을 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `notice_id` | query | number | 필수 | 공지사항 식별자 |

**응답 200:**
```json
{
  "title": "string",
  "url": "string",
  "contents": "string",
  "date": "string (KST)"
}
```

---

## 3. 업데이트 공지사항 목록 조회

**GET** `/maplestory/v1/notice-update`

최근 업데이트 공지사항 20건을 조회합니다.

**파라미터:** `x-nxopen-api-key` (header)만 필요

**응답 200:**
```json
{
  "update_notice": [
    {
      "title": "string",
      "url": "string",
      "notice_id": "number",
      "date": "string (KST)"
    }
  ]
}
```

---

## 4. 업데이트 공지사항 상세 조회

**GET** `/maplestory/v1/notice-update/detail`

특정 업데이트 공지사항의 상세 내용을 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `notice_id` | query | number | 필수 | 공지사항 식별자 |

**응답 200:**
```json
{
  "title": "string",
  "url": "string",
  "contents": "string",
  "date": "string (KST)"
}
```

---

## 5. 이벤트 공지사항 목록 조회

**GET** `/maplestory/v1/notice-event`

진행 중인 이벤트 공지사항 최근 20건을 조회합니다.

**파라미터:** `x-nxopen-api-key` (header)만 필요

**응답 200:**
```json
{
  "event_notice": [
    {
      "title": "string",
      "url": "string",
      "notice_id": "number",
      "date": "string (KST)",
      "date_event_start": "string (KST)",
      "date_event_end": "string (KST)"
    }
  ]
}
```

---

## 6. 이벤트 공지사항 상세 조회

**GET** `/maplestory/v1/notice-event/detail`

특정 이벤트 공지사항의 상세 내용을 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `notice_id` | query | number | 필수 | 공지사항 식별자 |

**응답 200:**
```json
{
  "title": "string",
  "url": "string",
  "contents": "string",
  "date": "string (KST)",
  "date_event_start": "string (KST)",
  "date_event_end": "string (KST)"
}
```

---

## 7. 캐시샵 공지사항 목록 조회

**GET** `/maplestory/v1/notice-cashshop`

최근 캐시샵 공지사항 20건을 조회합니다.

**파라미터:** `x-nxopen-api-key` (header)만 필요

**응답 200:**
```json
{
  "cashshop_notice": [
    {
      "title": "string",
      "url": "string",
      "notice_id": "number",
      "date": "string (KST)",
      "date_sale_start": "string (KST)",
      "date_sale_end": "string (KST)",
      "ongoing_flag": "string (true = 상시 판매)"
    }
  ]
}
```

---

## 8. 캐시샵 공지사항 상세 조회

**GET** `/maplestory/v1/notice-cashshop/detail`

특정 캐시샵 공지사항의 상세 내용을 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `notice_id` | query | number | 필수 | 공지사항 식별자 |

**응답 200:**
```json
{
  "title": "string",
  "url": "string",
  "contents": "string",
  "date": "string (KST)",
  "date_sale_start": "string (KST)",
  "date_sale_end": "string (KST)",
  "ongoing_flag": "string (true = 상시 판매)"
}
```

---

## 에러 응답

| 상태 코드 | 설명 |
|----------|------|
| 400 | Bad Request — 잘못된 파라미터 |
| 403 | Forbidden — 권한 없음 |
| 429 | Too Many Requests — 요청 한도 초과 |
| 500 | Internal Server Error |
